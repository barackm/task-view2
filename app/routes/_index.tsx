import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import DashboardLayout from "~/components/dashboard-layout";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
