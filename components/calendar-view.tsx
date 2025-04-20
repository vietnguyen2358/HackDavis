"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Interface matching the appointment structure in JSON/API
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

// Helper to format YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set the initial date on the client side to avoid hydration mismatches
  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  // Fetch appointments when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/appointments?date=${formatDate(selectedDate)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const changeDate = (days: number) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Function to navigate to a specific date
  const goToDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Function to navigate to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Function to navigate to April 28, 2024
  const goToApril28 = () => {
    const april28 = new Date(2024, 3, 28); // Month is 0-indexed, so 3 = April
    setSelectedDate(april28);
  };

  // Memoize the initials function to prevent unnecessary recalculations
  const getInitials = useMemo(() => (name?: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('');
  }, []);

  // Memoize the filtered appointments to prevent unnecessary recalculations
  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(appt => appt.date === formatDate(selectedDate));
  }, [appointments, selectedDate]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Calendar
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="text-xs"
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToApril28}
            className="text-xs"
          >
            Apr 28, 2024
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Jump to Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={goToDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <button 
            onClick={() => changeDate(-1)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Previous
          </button>
          <button 
            onClick={() => changeDate(1)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Next
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-sm text-muted-foreground">No appointments scheduled for this date.</div>
            ) : (
              <div className="space-y-2">
                {filteredAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                        {getInitials(appt.patientName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{appt.patientName}</p>
                        <p className="text-xs text-muted-foreground">{appt.time} - {appt.type}</p>
                      </div>
                    </div>
                    <Badge variant={appt.status === 'completed' ? 'default' : 'outline'}>
                      {appt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
