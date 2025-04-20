"use client"; // Need client directive for hooks

import { useState, useEffect } from "react"; // Import hooks
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, UserCheck, UserX, Loader2 } from "lucide-react"

// Interface matching the appointment structure
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  doctorName?: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

// Helper to format today's date as YYYY-MM-DD
const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export function CalendarStats() {
  const [todaysAppointmentsCount, setTodaysAppointmentsCount] = useState<number | string>("...");
  // Placeholder states for other stats - replace with real logic when available
  const [filledCancellations, setFilledCancellations] = useState<number | string>("N/A");
  const [noShowsPrevented, setNoShowsPrevented] = useState<number | string>("N/A");
  const [hoursOptimized, setHoursOptimized] = useState<number | string>("N/A");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = getTodayDateString();
        // Fetch appointments for today
        const response = await fetch(`/api/appointments?date=${today}`);
        if (!response.ok) {
          throw new Error("Failed to fetch today's appointments");
        }
        const todaysData: Appointment[] = await response.json();
        setTodaysAppointmentsCount(Array.isArray(todaysData) ? todaysData.length : 0);

        // TODO: Add logic here to calculate other stats when data/logic is available
        // For now, they remain N/A

      } catch (err) {
        console.error("Error fetching stats data:", err);
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setTodaysAppointmentsCount("?"); // Indicate error
        // Set other stats to error indicator as well
        setFilledCancellations("?");
        setNoShowsPrevented("?");
        setHoursOptimized("?");
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []); // Fetch on component mount

  // Define the stats structure using state values and dummy data
  const stats = [
    {
      title: "Today's Appointments",
      value: loading ? "..." : todaysAppointmentsCount,
      icon: Calendar,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Filled Cancellations",
      value: loading ? "..." : 3,
      icon: UserCheck,
      color: "text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "No-Shows Prevented",
      value: loading ? "..." : 5,
      icon: UserX,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      title: "Hours Optimized",
      value: loading ? "..." : "8.5",
      icon: Clock,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
    },
  ]

  // Handle overall error state for the component
  if (error) {
    return <div className="p-4 text-red-500 text-center">Error loading stats: {error}</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold flex items-center">
                   {/* Corrected logic to show loader or value */}
                  {loading && typeof stat.value !== 'number' && stat.value === "..." ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
