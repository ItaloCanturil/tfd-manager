export type UserRole = "COORDINATOR" | "RECEPTIONIST" | "TRANSPORT";

export type AuthenticatedUser = {
  id: string;
  name: string;
  role: UserRole;
  username: string;
};

export type Patient = {
  birthDate: string;
  cpf: string;
  createdAt: string;
  id: string;
  name: string;
  phone: string;
  rg: string;
  susCard: string;
  updatedAt: string;
};

export type BookingStatus = "CONFIRMED" | "ABSENT" | "CANCELED";

export type Booking = {
  appointmentDate: string;
  companionCpf: string | null;
  companionName: string | null;
  companionSus: string | null;
  createdAt: string;
  finalDestination: string;
  hasCompanion: boolean;
  id: string;
  patientId: string;
  status: BookingStatus;
  tripId: string;
  updatedAt: string;
};

export type TripStatus = "ACTIVE" | "CANCELED";

export type Trip = {
  capacity: number;
  createdAt: string;
  departureDate: string;
  id: string;
  name: string;
  notes: string | null;
  routeId: string;
  status: TripStatus;
  updatedAt: string;
};

export type UpdatePatientInput = Pick<
  Patient,
  "birthDate" | "cpf" | "name" | "phone" | "rg" | "susCard"
>;

export type CreateBookingInput = {
  appointmentDate: string;
  companionCpf?: string;
  companionName?: string;
  companionSus?: string;
  finalDestination: string;
  hasCompanion?: boolean;
  patientId: string;
  tripId: string;
};

type LoginResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const errorBody =
      body && typeof body === "object" ? (body as { message?: unknown }) : null;
    const message =
      typeof errorBody?.message === "string"
        ? errorBody.message
        : "Nao foi possivel concluir a requisicao.";

    throw new Error(message);
  }

  return body as T;
}

export async function login(username: string, password: string) {
  const response = await fetch(`${apiUrl}/auth/login`, {
    body: JSON.stringify({ password, username }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return readJson<LoginResponse>(response);
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readJson<AuthenticatedUser>(response);
}

export async function getPatientByCpf(token: string, cpf: string) {
  const response = await fetch(
    `${apiUrl}/patients/cpf/${encodeURIComponent(cpf)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return readJson<Patient>(response);
}

export async function listPatients(token: string) {
  const response = await fetch(`${apiUrl}/patients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readJson<Patient[]>(response);
}

export async function updatePatient(
  token: string,
  id: string,
  patient: UpdatePatientInput,
) {
  const response = await fetch(`${apiUrl}/patients/${id}`, {
    body: JSON.stringify(patient),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  return readJson<Patient>(response);
}

export async function listBookingsByPatient(token: string, patientId: string) {
  const params = new URLSearchParams({ patientId });
  const response = await fetch(`${apiUrl}/bookings?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readJson<Booking[]>(response);
}

export async function createBooking(
  token: string,
  booking: CreateBookingInput,
) {
  const response = await fetch(`${apiUrl}/bookings`, {
    body: JSON.stringify(booking),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return readJson<Booking>(response);
}

export async function listActiveTrips(token: string) {
  const params = new URLSearchParams({ status: "ACTIVE" });
  const response = await fetch(`${apiUrl}/trips?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readJson<Trip[]>(response);
}

export { apiUrl };
