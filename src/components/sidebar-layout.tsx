"use client";
import React, { PropsWithChildren } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import Header from "./header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
const queryClient = new QueryClient();

const SidebarLayout = (props: PropsWithChildren) => {
  const exceptionRoutes = ["/login", "/register"];
  const pathname = usePathname();

  const canRenderSidebar = !exceptionRoutes.includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        {canRenderSidebar && <AppSidebar />}
        <SidebarInset>
          {canRenderSidebar && <Header />}
          <div className='flex flex-1 flex-col'>{props.children}</div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default SidebarLayout;
