"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, MessageSquare, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PatientProfileDialog } from "@/components/patient-profile-dialog"

interface Patient {
  id: string
  name: string
  phone: string
  age: number
  gender: string
  medicalHistory: {
    conditions: string[]
    medications: string[]
    allergies: string[]
  }
  appointments: Array<{
    type: string
    date: string
    status: string
    notes: string
  }>
  preferences: {
    language: string
    contactTime: string
    reminderType: string
  }
  notes?: Array<{
    id: number
    content: string
    timestamp: string
    author: string
  }>
}

export function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching patients:', error)
        toast({
          title: "Error",
          description: "Failed to load patients",
          variant: "destructive",
        })
        setLoading(false)
      })
  }, [toast])

  const handleViewProfile = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsProfileOpen(true)
  }

  const handleProfileSave = (updatedPatient: Patient) => {
    setPatients(patients.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    ))
    setIsProfileOpen(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading patients...</div>
  }

  return (
    <>
      <div className="space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="flex items-start gap-4 p-4 rounded-lg border">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {patient.name ? patient.name.split(' ').map(n => n[0]).join('') : '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <span className="text-xs text-muted-foreground">{patient.phone}</span>
                    <span className="text-xs text-muted-foreground">{patient.age} years old • {patient.gender}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {patient.appointments?.length > 0 
                          ? `Next: ${patient.appointments[0].type} on ${new Date(patient.appointments[0].date).toLocaleDateString()}`
                          : 'No upcoming appointments'}
                      </span>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {patient.medicalHistory?.conditions?.length > 0 
                        ? patient.medicalHistory.conditions[0]
                        : 'No conditions'}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex"
                    onClick={() => handleViewProfile(patient)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPatient && (
        <PatientProfileDialog
          patient={selectedPatient}
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          onSave={handleProfileSave}
        />
      )}
    </>
  )
}
