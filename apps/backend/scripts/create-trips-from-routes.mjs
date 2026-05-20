import pg from "pg";

const { Pool } = pg;

const DEFAULT_DATABASE_URL = "postgresql://tfd:tfd@localhost:5432/tfd?schema=public";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const startDate = parseDate(options.start, "start");
  const endDate = parseDate(options.end, "end");

  if (endDate < startDate) {
    throw new Error("The end date must be equal to or after the start date.");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    try {
      await client.query("begin");

      const schedulesResult = await client.query(`
        select
          route_schedules.id,
          route_schedules.route_id,
          route_schedules.label,
          route_schedules.weekdays,
          route_schedules.default_capacity,
          routes.destination
        from route_schedules
        inner join routes on routes.id = route_schedules.route_id
        where route_schedules.is_active = true
        order by routes.destination, route_schedules.departure_time
      `);

      let createdCount = 0;
      let skippedCount = 0;

      for (const schedule of schedulesResult.rows) {
        const tripDates = getTripDatesForRoute(
          startDate,
          endDate,
          schedule.weekdays,
        );

        for (const tripDate of tripDates) {
          const departureDate = formatDate(tripDate);
          const tripName = formatTripName(
            schedule.destination,
            schedule.label,
            tripDate,
          );

          const insertResult = await client.query(
            `
              insert into trips (
                route_id,
                route_schedule_id,
                name,
                departure_date,
                capacity
              )
              select $1, $2, $3, $4, $5
              where not exists (
                select 1
                from trips
                where route_schedule_id = $2 and departure_date = $4
              )
              returning id
            `,
            [
              schedule.route_id,
              schedule.id,
              tripName,
              departureDate,
              schedule.default_capacity,
            ],
          );

          if (insertResult.rowCount === 0) {
            skippedCount += 1;
          } else {
            createdCount += 1;
          }
        }
      }

      await client.query("commit");

      console.warn(
        `Trips generated. Created: ${createdCount}. Already existed: ${skippedCount}.`,
      );
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

function parseArgs(args) {
  const options = {};

  for (const arg of args) {
    const [name, value] = arg.split("=");

    if (!name.startsWith("--") || !value) {
      throw new Error(
        "Invalid argument. Use --start=YYYY-MM-DD and --end=YYYY-MM-DD.",
      );
    }

    options[name.slice(2)] = value;
  }

  if (!options.start || !options.end) {
    throw new Error("Missing required arguments: --start and --end.");
  }

  return options;
}

function parseDate(value, fieldName) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ${fieldName} date. Use YYYY-MM-DD.`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || formatDate(date) !== value) {
    throw new Error(`Invalid ${fieldName} date. Use a real calendar date.`);
  }

  return date;
}

function getTripDatesForRoute(startDate, endDate, fixedWeekdays) {
  const weekdays = new Set(fixedWeekdays);
  const dates = [];

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate = new Date(currentDate.getTime() + DAY_IN_MS)
  ) {
    if (weekdays.has(currentDate.getUTCDay())) {
      dates.push(new Date(currentDate));
    }
  }

  return dates;
}

function formatTripName(destination, label, date) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return `${destination} - ${label} - ${formattedDate}`;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
