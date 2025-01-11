"use client";
import React, { PropsWithChildren } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import Header from "./header";
import { usePathname } from "next/navigation";

const SidebarLayout = (props: PropsWithChildren) => {
  const exceptionRoutes = ["/login", "/register"];
  const pathname = usePathname();

  const canRenderSidebar = !exceptionRoutes.includes(pathname);

  return (
    <SidebarProvider>
      {canRenderSidebar && <AppSidebar />}
      <SidebarInset>
        {canRenderSidebar && <Header />}
        <div className='flex flex-1 flex-col px-4'>{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SidebarLayout;
