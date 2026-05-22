import { PatientDetailsPage } from "../components/patient-details-page";

export default async function Page({
  params,
}: {
  params: Promise<{ cpf: string }>;
}) {
  const { cpf } = await params;

  return <PatientDetailsPage cpf={cpf} />;
}
