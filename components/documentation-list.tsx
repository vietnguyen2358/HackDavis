"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Mic, FileCheck, Download, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface TranscriptionData {
  _id: string
  title: string
  patientId: string
  transcription: string
  notes: string
  duration: string
  createdAt: string
  type: string
}

interface DocumentationListProps {
  type: "transcription" | "notes" | "forms"
}

export function DocumentationList({ type }: DocumentationListProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<TranscriptionData[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/transcriptions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API error response:", errorData);
          throw new Error(errorData.error || `Failed to fetch transcriptions: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Transcriptions fetched:", data);
        
        // Filter by type if needed
        let filteredData;
        if (type === "transcription") {
          filteredData = data.data || [];
        } else if (type === "notes") {
          // Show only entries with notes
          filteredData = data.data ? data.data.filter((item: TranscriptionData) => item.notes && item.notes.trim() !== "") : [];
        } else {
          // For now, we don't have real forms, so return empty array
          filteredData = [];
        }
        
        setItems(filteredData);
      } catch (error) {
        console.error("Error fetching transcriptions:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load transcriptions",
          variant: "destructive",
        });
        
        // Set empty array in case of error
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTranscriptions();
  }, [type, toast]);

  const getIcon = () => {
    switch (type) {
      case "transcription":
        return Mic
      case "notes":
        return FileText
      case "forms":
        return FileCheck
    }
  }

  const getIconColor = () => {
    switch (type) {
      case "transcription":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900"
      case "notes":
        return "text-purple-500 bg-purple-100 dark:bg-purple-900"
      default:
        return "text-green-500 bg-green-100 dark:bg-green-900"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const downloadPdf = (id: string) => {
    // Open the PDF endpoint in a new tab
    window.open(`/api/transcriptions/${id}/pdf`, '_blank')
  }

  const Icon = getIcon()
  const iconColor = getIconColor()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No {type} found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item._id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`p-2 rounded-full ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                  {type === "transcription" && <Badge variant="outline">{item.duration}</Badge>}
                  {type === "notes" && <Badge variant="outline">Clinical Notes</Badge>}
                  {type === "forms" && <Badge variant="outline">Form</Badge>}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link href={`/documentation/view/${item._id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadPdf(item._id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
