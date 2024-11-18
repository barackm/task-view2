import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import Header from "./header";
import { PropsWithChildren } from "react";

const DashboardLayout = (props: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className='flex flex-1 flex-col gap-4 p-4'>{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
