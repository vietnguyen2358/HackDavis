"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, MessageSquare, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PatientProfileDialog } from "@/components/patient-profile-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

// Import react-window for virtualization
import { FixedSizeList as List } from 'react-window';

// Define Patient interface at the top so it can be used by the fallback component
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

// Fallback to a regular list if react-window fails
interface PatientListFallbackProps {
  patients: Patient[];
  handlePatientClick: (patient: Patient) => void;
}

const PatientListFallback = ({ patients, handlePatientClick }: PatientListFallbackProps) => {
  return patients.map(patient => (
    <div key={patient.id} className="flex items-start gap-4 p-4 rounded-lg border mb-2">
      <Avatar className="h-12 w-12">
        <AvatarFallback>
          {patient.name ? patient.name.split(' ').map((n: string) => n[0]).join('') : '??'}
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
                    ? `Next: ${patient.appointments[0].type} on ${format(new Date(patient.appointments[0].date), 'MMM d, yyyy')}`
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePatientClick(patient)}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  ));
};

export function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [useVirtualization, setUseVirtualization] = useState(true)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000)
  const { toast } = useToast()
  const listContainerRef = useRef<HTMLDivElement | null>(null)
  const [listHeight, setListHeight] = useState(600)

  // Handle window resize for responsive list
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Measure container height
  useEffect(() => {
    if (listContainerRef.current) {
      setListHeight(Math.max(600, window.innerHeight * 0.7))
    }
  }, [windowWidth, listContainerRef.current])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/ehr-data')
        if (!response.ok) {
          throw new Error('Failed to fetch patient data')
        }
        const data = await response.json()
        setPatients(data.patients || [])
      } catch (err) {
        console.error('Error fetching patients:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [toast])

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsProfileOpen(true)
  }

  const handleSavePatient = async (updatedPatient: Patient) => {
    try {
      // In a real app, you would send this to your API
      // For now, we'll just update the local state
      setPatients(prevPatients => 
        prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
      )
      
      toast({
        title: "Success",
        description: "Patient information updated successfully.",
      })
    } catch (err) {
      console.error('Error updating patient:', err)
      toast({
        title: "Error",
        description: "Failed to update patient information. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Memoize the patient row renderer to prevent unnecessary re-renders
  const PatientRow = useMemo(() => ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const patient = patients[index]
    if (!patient) return null;
    
    return (
      <div style={style} className="flex items-start gap-4 p-4 rounded-lg border mb-2 mx-1">
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
                      ? `Next: ${patient.appointments[0].type} on ${format(new Date(patient.appointments[0].date), 'MMM d, yyyy')}`
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePatientClick(patient)}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    )
  }, [patients, handlePatientClick])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  // Handle case when no patients are found
  if (patients.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No patients found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4" ref={listContainerRef}>
        {useVirtualization ? (
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-0 -top-10 z-10"
              onClick={() => setUseVirtualization(false)}
            >
              Switch to Standard View
            </Button>
            
            {/* Handle errors with virtualization gracefully */}
            <div className="w-full" style={{ height: `${listHeight}px` }}>
              {(() => {
                try {
                  return (
                    <List
                      height={listHeight}
                      width={windowWidth > 768 ? windowWidth * 0.8 : windowWidth * 0.95}
                      itemCount={patients.length}
                      itemSize={120}
                      className="mx-auto"
                    >
                      {PatientRow}
                    </List>
                  );
                } catch (e) {
                  // If virtualization fails, switch to standard view
                  setUseVirtualization(false);
                  return <PatientListFallback patients={patients} handlePatientClick={handlePatientClick} />;
                }
              })()}
            </div>
          </div>
        ) : (
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4"
              onClick={() => setUseVirtualization(true)}
            >
              Switch to Virtual List
            </Button>
            <PatientListFallback patients={patients} handlePatientClick={handlePatientClick} />
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientProfileDialog
          patient={selectedPatient}
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          onSave={handleSavePatient}
        />
      )}
    </>
  )
}
