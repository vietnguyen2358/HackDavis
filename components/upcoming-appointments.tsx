import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText } from "lucide-react";

export function UpcomingAppointments({ selectedDate }: { selectedDate: string }) {
  interface Appointment {
    _id: string;
    patientName: string;
    date: string;
    type: string;
    time: string;
    details?: {
      notes?: string;
      createdBy?: string;
    };
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/google-calander/get-patients-appointments/${selectedDate}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then(data => {
        setAppointments(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;


  return (
    <div className="space-y-4">
    {appointments.map((appt) => (
      <div key={appt._id} className="flex items-center justify-between p-4 rounded-lg border">
        {/* Render appointment details here */}
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
            </div>
            {appt.details?.notes && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <FileText className="h-3 w-3" /> {appt.details.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}
