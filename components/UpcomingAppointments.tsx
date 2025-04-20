"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, Clock, Loader2, FileText } from "lucide-react";

// Interface matching the appointment structure in JSON/API
interface Appointment {
  id: string; // Changed from _id
  patientId: string;
  doctorId: string;
  patientName?: string;
  doctorName?: string;
  date: string;
  time: string;
  type: string; // Assuming type is still string
  status: string; // Assuming status is still string
  notes?: string;
  // Removed details structure and progress, adapt if needed
}

// Get initials for AvatarFallback
const getInitials = (name?: string) => {
  return name ? name.split(' ').map(n => n[0]).join('') : '?';
};

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all appointments from the new endpoint
      const response = await fetch("/api/appointments");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      // Sorting logic remains the same (assuming status property exists)
      const sorted = Array.isArray(data) ? data.sort((a: Appointment, b: Appointment) => {
        const statusPriority = {
          in_progress: 0, // Keep if these statuses are used
          pending: 1,
          completed: 2,
        };
        // Provide default priority for unknown statuses
        const priorityA = statusPriority[a.status as keyof typeof statusPriority] ?? 99;
        const priorityB = statusPriority[b.status as keyof typeof statusPriority] ?? 99;
        return priorityA - priorityB;
      }) : [];
      setAppointments(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch appointments");
       setAppointments([]); // Clear appointments on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // Optionally add a listener or interval to refresh data if needed
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
         <p className="text-center text-muted-foreground">No upcoming appointments.</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt.id} // Use id instead of _id
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                 {/* Use initials, remove placeholder image */}
                <AvatarFallback>{getInitials(appt.patientName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{appt.patientName || "Unknown Patient"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {/* Format date if needed, assuming YYYY-MM-DD */}
                    {appt.date} {appt.time}
                  </span>
                  <Badge variant="outline">{appt.type}</Badge>
                  {/* Update status badge logic based on actual statuses used */}
                  {appt.status === "in_progress" && (
                    <Badge variant="secondary">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />In Progress
                    </Badge>
                  )}
                  {appt.status === "completed" && (
                    <Badge variant="default">
                      <CheckCircle2 className="mr-1 h-3 w-3" />Completed
                    </Badge>
                  )}
                  {appt.status === "pending" && (
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />Pending
                    </Badge>
                  )}
                </div>
                {/* Use appt.notes directly */}
                {appt.notes && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {appt.notes}
                  </div>
                )}
              </div>
            </div>
            {/* Remove Progress bar section or adapt if needed */}
             {/* {appt.status === "in_progress" && (...)} */}
          </div>
        ))
      )}
    </div>
  );
}
