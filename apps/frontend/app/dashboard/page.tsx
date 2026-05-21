import dynamic from "next/dynamic";

import { DashboardPageSkeleton } from "./components/dashboard-page-skeleton";

const DashboardPage = dynamic(
  () =>
    import("./components/dashboard-page").then((module) => ({
      default: module.DashboardPage,
    })),
  { loading: () => <DashboardPageSkeleton /> },
);

export default function Page() {
  return <DashboardPage />;
}
