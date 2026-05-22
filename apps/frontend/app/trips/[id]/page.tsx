import { TripDetailsPage } from "../components/trip-details-page";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TripDetailsPage tripId={id} />;
}
