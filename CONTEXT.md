# Project Context

## Project Purpose

This project is a local web system for managing TFD (Tratamento Fora do Domicilio) seat bookings. It replaces manual Word documents and spreadsheet workflows with a centralized, secure, and organized application for administrative healthcare transport operations.

The current system focuses on booking seats for specific TFD trips, managing patients, routes, trips, companions, documents, and printable transport reports.

## Domain Language

- **TFD**: Treatment Outside the Home. An administrative healthcare transport process where patients travel to another city or facility for appointments, exams, procedures, or treatment.
- **Patient**: The person who requests or receives a TFD seat booking. Patient records include identification, SUS card, birth date, phone, and address-related information.
- **Route**: A recurring transport configuration, including destination, operating weekdays, default capacity, and transport type.
- **Trip**: A dated instance of a route. A trip has its own departure date, status, and capacity, which may differ from the route default.
- **Booking**: A confirmed seat reservation for a patient on a specific trip. A booking is not a queue position.
- **Final Destination**: The patient's destination within a route. This matters for shared routes such as Juazeiro/Petrolina, where the vehicle capacity is shared but each patient still needs an individual destination.
- **Companion**: A person traveling with the patient. A companion occupies an additional vehicle seat.
- **Document**: A supporting medical or administrative file attached to justify or record the TFD request, such as a consultation referral, exam request, or surgery authorization.
- **Report**: A printable output used by transport operations, especially patient lists grouped by trip or destination.
- **Coordinator**: The user role with full access to manage users, patients, routes, trips, bookings, and reports.
- **Receptionist**: The user role responsible for operational work such as maintaining patient records and creating or updating bookings.
- **Transport**: The read-only user role focused on viewing the information required to operate and print trip lists.

## Core Business Rules

- The system is not a waiting-list system. A patient either gets a seat on a specific trip or must choose another available trip.
- Every booking is tied to one specific trip with a defined date, route, status, and capacity.
- The appointment date is required on each booking because it determines the latest viable trip before the patient's appointment.
- Companions consume vehicle capacity and must be counted as additional occupied seats.
- Companion eligibility may come from age rules or manually recorded criteria such as medical report, oncology, hemodialysis, hearing impairment, illiteracy, judicial priority, or regulation status.
- Priority classification does not reorder bookings. It is used to identify the patient and support companion eligibility.
- Receptionists manually choose an earlier available trip when the ideal trip is full. The system provides visibility but does not automatically reallocate patients.
- If a trip is canceled, its seats are released and patient communication happens manually outside the system.
- If a patient is absent, the seat is lost and the patient must make a new request. There is no automatic rebooking.
- A vehicle serves only one route or destination group per trip.
- Shared routes may have multiple final destinations while still sharing the same vehicle capacity.

## Roles and Permissions

- **Coordinator**
  - Full visibility and edit access.
  - Manages users and their active status.
  - Manages patients, routes, trips, bookings, and reports.
- **Receptionist**
  - Creates and edits patient records.
  - Consults operational information.
  - Creates and updates trip bookings.
  - Performs manual booking decisions based on available capacity.
- **Transport**
  - Read-only access to trip and booking information needed for transport execution.
  - Uses printable lists and reports for daily operations.

All users must authenticate before accessing the system, except explicitly public technical endpoints such as health checks.

## Current Architecture

- **Repository structure**: Turborepo monorepo.
- **Backend**: NestJS standalone REST API.
- **Frontend**: Next.js App Router with Tailwind CSS.
- **Database**: PostgreSQL.
- **ORM and migrations**: Drizzle ORM and Drizzle Kit.
- **Infrastructure**: Docker and Docker Compose.
- **File storage**: Local filesystem storage through a Docker volume, intended for on-premise use.

The backend is currently organized into modules for authentication, users, patients, routes, trips, bookings, and reports. TFD is the first operational domain implemented in the system.

## Future ERP Direction

The project is expected to grow from a TFD seat-booking system into a broader healthcare ERP. Future modules should be added as clear domain modules instead of being mixed into the existing TFD flow.

The next planned direction is an attendance and ticket queue workflow for local healthcare service management. That future module should support local network operation, ticket or password issuance, queue control, call panels, and real-time patient flow tracking without depending on internet access.

The future attendance module is operational and administrative. It should not be treated as a full clinical medical record unless that scope is explicitly defined later.
