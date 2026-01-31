"use client";

import AppointmentsClient from "./client";
import { useEffect, useState } from "react";

// Backend removed - metadata removed for client component

export default function AppointmentsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Backend removed - using mock data
    setData([]);
  }, []);

  return <AppointmentsClient initialData={data} />;
}