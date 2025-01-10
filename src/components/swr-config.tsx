"use client";

import React from "react";
import { SWRConfig } from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  refreshInterval: 0,
  shouldRetryOnError: false,
};

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrOptions}>{children}</SWRConfig>;
}
