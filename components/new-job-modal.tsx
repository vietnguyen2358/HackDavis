"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewJobForm } from "@/components/new-job-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function NewJobModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Create a new automated task for the AI assistant
          </DialogDescription>
        </DialogHeader>
        <NewJobForm />
      </DialogContent>
    </Dialog>
  )
} 