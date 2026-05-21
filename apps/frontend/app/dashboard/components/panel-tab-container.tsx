"use client";

import { useEffect, useState } from "react";

import {
  listBookingsByAppointment,
  type AuthenticatedUser,
  type Booking,
  type Patient,
} from "../../lib/tfd-api";
import type { DashboardTrip, RoleHome } from "./dashboard-config";
import { PanelTabView } from "./panel-tab-view";

type PanelTabContainerProps = {
  home: RoleHome;
  onPatientSearch: (value: string) => void;
  onTripDateChange: (value: string) => void;
  patientSearch: string;
  patients: Patient[];
  role: AuthenticatedUser["role"];
  token: string;
  tripDate: string;
  trips: DashboardTrip[];
};

export function PanelTabContainer({
  home,
  onPatientSearch,
  onTripDateChange,
  patientSearch,
  patients,
  role,
  token,
  tripDate,
  trips,
}: PanelTabContainerProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let isActive = true;

    if (!token) {
      setBookings([]);
      return () => {
        isActive = false;
      };
    }

    listBookingsByAppointment(token, tripDate)
      .then((bookingList) => {
        if (isActive) {
          setBookings(bookingList);
        }
      })
      .catch(() => {
        if (isActive) {
          setBookings([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token, tripDate]);

  return (
    <PanelTabView
      bookings={bookings}
      home={home}
      onPatientSearch={onPatientSearch}
      onTripDateChange={onTripDateChange}
      patientSearch={patientSearch}
      patients={patients}
      role={role}
      tripDate={tripDate}
      trips={trips}
    />
  );
}
