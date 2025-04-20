"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewJobForm } from "@/components/new-job-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

export function NewJobModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-tiempos">
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
        <NewJobForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
} 