"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Save } from "lucide-react"

interface PatientProfileDialogProps {
  patient: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedPatient: any) => void
}

export function PatientProfileDialog({ patient, open, onOpenChange, onSave }: PatientProfileDialogProps) {
  const { toast } = useToast()
  const [editedPatient, setEditedPatient] = useState(patient)
  const [newNote, setNewNote] = useState("")

  const handleSave = async () => {
    try {
      // Create a clean copy of the patient data without _id
      const cleanPatientData = { ...editedPatient };
      delete cleanPatientData._id;
      
      console.log('Saving patient data:', cleanPatientData);
      
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanPatientData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update patient');
      }

      const updatedPatient = await response.json();
      console.log('Patient updated successfully:', updatedPatient);
      onSave(updatedPatient);
      toast({
        title: "Success",
        description: "Patient information updated successfully",
      })
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update patient information",
        variant: "destructive",
      })
    }
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const updatedPatient = {
      ...editedPatient,
      notes: [
        ...(editedPatient.notes || []),
        {
          id: Date.now(),
          content: newNote,
          timestamp: new Date().toISOString(),
          author: "Dr. Smith", // This should come from the logged-in user
        },
      ],
    }

    setEditedPatient(updatedPatient)
    setNewNote("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Patient Profile - {patient.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="h-full">
          <TabsList>
            <TabsTrigger value="info">Patient Info</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(80vh-8rem)]">
            <TabsContent value="info" className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editedPatient.name}
                    onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editedPatient.phone}
                    onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={editedPatient.age}
                    onChange={(e) => setEditedPatient({ ...editedPatient, age: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Input
                    value={editedPatient.gender}
                    onChange={(e) => setEditedPatient({ ...editedPatient, gender: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="medical" className="space-y-4 p-4">
              <div className="space-y-4">
                <div>
                  <Label>Medical Conditions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedPatient.medicalHistory?.conditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="secondary">{condition}</Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Condition
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Medications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedPatient.medicalHistory?.medications.map((medication: string, index: number) => (
                      <Badge key={index} variant="secondary">{medication}</Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Medication
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Allergies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedPatient.medicalHistory?.allergies.map((allergy: string, index: number) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Allergy
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4 p-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a new clinical note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
                <div className="space-y-4">
                  {editedPatient.notes?.map((note: any) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{note.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 