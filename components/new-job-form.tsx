"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from "@/components/ui/dialog"

const formSchema = z.object({
  personName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  jobType: z.string({
    required_error: "Please select a job type.",
  }),
  notes: z.string().optional(),
})

interface Patient {
  id: string;
  name: string;
}

interface NewJobFormProps {
  onSuccess?: () => void;
}

export function NewJobForm({ onSuccess }: NewJobFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Fetch patients from the EHR data
    console.log('Fetching patients...')
    fetch('/api/patients')
      .then(res => {
        console.log('API Response status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('Received patients data:', data)
        setPatients(data)
      })
      .catch(error => {
        console.error('Error fetching patients:', error)
        toast({
          title: "Error",
          description: "Failed to load patient list",
          variant: "destructive",
        })
      })
  }, [toast])

  // Add a debug effect to monitor patients state
  useEffect(() => {
    console.log('Current patients state:', patients)
  }, [patients])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personName: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      // Find the selected patient to get their ID
      const selectedPatient = patients.find(p => p.name === values.personName)
      if (!selectedPatient) {
        throw new Error('Selected patient not found')
      }
      
      // Generate detailed notes based on job type
      let detailedNotes = values.notes || "";
      if (!detailedNotes) {
        switch (values.jobType) {
          case "checkup":
            detailedNotes = `Regular check-up call for ${values.personName}. Review recent symptoms and medication effectiveness.`;
            break;
          case "appointment":
            detailedNotes = `Schedule appointment for ${values.personName}. Discuss available time slots and prepare necessary documentation.`;
            break;
          case "reminder":
            detailedNotes = `Send appointment reminder to ${values.personName}. Confirm attendance and provide preparation instructions.`;
            break;
          case "followup":
            detailedNotes = `Follow-up call with ${values.personName} after recent treatment. Check on recovery progress and address any concerns.`;
            break;
          default:
            detailedNotes = `AI-assisted task for ${values.personName}.`;
        }
      }
      
      // Create the job first
      const jobResponse = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          patientName: values.personName,
          jobType: values.jobType,
          notes: detailedNotes
        }),
      })

      if (!jobResponse.ok) {
        throw new Error('Failed to create job')
      }

      const job = await jobResponse.json()
      
      // Format the data for the outbound call
      const jobData = {
        patientId: selectedPatient.id,
        jobType: values.jobType,
        additionalNotes: detailedNotes,
        jobId: job.id // Pass the job ID to update progress
      }
      
      // Use the ngrok URL from environment variable
      const ngrokUrl = process.env.NEXT_PUBLIC_NGROK_URL
      if (!ngrokUrl) {
        throw new Error('Ngrok URL not configured')
      }
      
      // Remove trailing slash if present to avoid double slashes
      const baseUrl = ngrokUrl.endsWith('/') ? ngrokUrl.slice(0, -1) : ngrokUrl
      const apiUrl = `${baseUrl}/outbound-call`
      
      // Use our own API as a proxy to avoid CORS issues
      const response = await fetch('/api/proxy-outbound-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: apiUrl,
          data: jobData
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`Failed to create job: ${response.status} ${errorText}`)
      }

      const responseData = await response.json()
      console.log('API success response:', responseData)

      // Update job status to In Progress
      await fetch('/api/jobs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          status: 'In Progress',
          progress: 0
        }),
      })

      // Simulate job completion after a delay (for demo purposes)
      setTimeout(async () => {
        try {
          // Update job status to Completed
          await fetch('/api/jobs', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jobId: job.id,
              status: 'Completed',
              progress: 100
            }),
          })
          
          // Refresh the page to show updated job status
          router.refresh()
        } catch (error) {
          console.error('Error updating job status:', error)
        }
      }, 30000) // Simulate completion after 30 seconds

      toast({
        title: "Job created successfully",
        description: `Created a new ${values.jobType} job for ${values.personName}`,
      })
      
      // Reset form and close modal
      form.reset()
      router.refresh()
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // The modal will be closed by the DialogClose component
    } catch (error) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="personName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.name}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem key="checkup" value="checkup">
                    <span key="checkup-text">Patient Check-up</span>
                  </SelectItem>
                  <SelectItem key="appointment" value="appointment">
                    <span key="appointment-text">Schedule Appointment</span>
                  </SelectItem>
                  <SelectItem key="reminder" value="reminder">
                    <span key="reminder-text">Appointment Reminder</span>
                  </SelectItem>
                  <SelectItem key="followup" value="followup">
                    <span key="followup-text">Patient Follow-up</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the type of task for the AI assistant to perform</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional information or context for this job"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <DialogClose>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Submit Job"}
          </Button>
        </div>
      </form>
    </Form>
  )
}