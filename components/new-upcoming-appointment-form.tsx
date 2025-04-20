"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Define interfaces matching the API structure
interface Patient {
  id: string;
  name: string;
}
interface Doctor {
  id: string;
  name: string;
}
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

const formSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  doctorId: z.string().min(1, { message: "Doctor is required." }),
  reason: z.string().min(2, { message: "Reason is required." }),
  type: z.enum(["Check-up", "Follow-up", "Consultation"]),
  notes: z.string().optional(),
})

interface NewUpcomingAppointmentFormProps {
  onSuccess?: () => void;
  onAppointmentCreated?: () => void;
}

export function NewUpcomingAppointmentForm({ onSuccess, onAppointmentCreated }: NewUpcomingAppointmentFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInitialData() {
      setLoadingData(true);
      setErrorData(null);
      try {
        const response = await fetch("/api/calendar-data");
        if (!response.ok) {
          throw new Error("Failed to fetch calendar data");
        }
        const data = await response.json();
        setPatients(data.patients || []);
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setErrorData(err instanceof Error ? err.message : "Failed to load data");
        setPatients([]);
        setDoctors([]);
      } finally {
        setLoadingData(false);
      }
    }
    fetchInitialData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      date: "",
      time: "",
      doctorId: "",
      reason: "",
      type: "Check-up",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: values.patientId,
          doctorId: values.doctorId,
          date: values.date,
          time: values.time,
          type: values.type,
          notes: values.notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create appointment' }));
        throw new Error(errorData.message || "Failed to create appointment");
      }

      const createdAppointment = await response.json();
      console.log("Appointment created:", createdAppointment);

      toast({ title: "Appointment created!" })
      form.reset()
      if (onSuccess) onSuccess()
      if (onAppointmentCreated) onAppointmentCreated();
      router.refresh()

    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingData) {
    return <div className="p-4 text-center">Loading form data...</div>;
  }
  if (errorData) {
    return <div className="p-4 text-center text-red-500">Error loading form data: {errorData}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={patients.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={doctors.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input placeholder="Reason for appointment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || loadingData}>
          {isSubmitting ? "Submitting..." : "Create Appointment"}
        </Button>
      </form>
    </Form>
  )
}
