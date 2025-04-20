"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, Clock, Loader2, FileText } from "lucide-react";

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  type: "Check-up" | "Follow-up" | "Consultation";
  time: string;
  details?: {
    notes?: string;
    createdBy?: string;
  };
  status: "pending" | "in_progress" | "completed";
  progress?: number; // Only for in_progress
}

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments/upcoming");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        // Sort by status: in_progress > pending > completed
        const sorted = data.sort((a: Appointment, b: Appointment) => {
          const statusPriority = {
            in_progress: 0,
            pending: 1,
            completed: 2,
          };
          return statusPriority[a.status] - statusPriority[b.status];
        });
        setAppointments(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
      {appointments.map((appt) => (
        <div
          key={appt._id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={appt.patientName} />
              <AvatarFallback>
                <Calendar className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appt.patientName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(appt.date).toLocaleDateString()} {appt.time}
                </span>
                <Badge variant="outline">{appt.type}</Badge>
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
              {appt.details?.notes && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {appt.details.notes}
                </div>
              )}
            </div>
          </div>
          {appt.status === "in_progress" && (
            <div className="w-32">
              <Progress value={appt.progress ?? 0} className="h-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
