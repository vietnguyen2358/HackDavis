"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  personName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  jobType: z.string({
    required_error: "Please select a job type.",
  }),
  notes: z.string().optional(),
})

export function NewJobForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personName: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Job created successfully",
      description: `Created a new ${values.jobType} job for ${values.personName}`,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="personName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Person's Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient or staff name" {...field} />
              </FormControl>
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
                  <SelectItem value="check-up">Patient Check-up</SelectItem>
                  <SelectItem value="appointment">Schedule Appointment</SelectItem>
                  <SelectItem value="follow-up">Patient Follow-up</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="paperwork">Paperwork Automation</SelectItem>
                  <SelectItem value="call">Outgoing Call</SelectItem>
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

        <Button type="submit" className="w-full">
          Submit Job
        </Button>
      </form>
    </Form>
  )
}
