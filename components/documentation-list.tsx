"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, Download, Eye, RefreshCw } from "lucide-react"
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

export function DocumentationList() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [items, setItems] = useState<TranscriptionData[]>([])
  const { toast } = useToast()

  const fetchTranscriptions = async () => {
    try {
      setIsRefreshing(true);
      
      const response = await fetch("/api/transcriptions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        // Add cache-busting parameter to prevent caching
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(errorData.error || `Failed to fetch transcriptions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Transcriptions fetched:", data);
      
      // Sort transcriptions by date (newest first)
      const sortedData = data.data ? 
        [...data.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
        : [];
      
      setItems(sortedData);
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
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTranscriptions();

    // Set up auto-refresh every 5 seconds
    const intervalId = setInterval(() => {
      fetchTranscriptions();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  const handleManualRefresh = () => {
    fetchTranscriptions();
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No transcriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-start gap-4 p-4 rounded-lg border">
              <div className="p-2 rounded-full text-blue-500 bg-blue-100 dark:bg-blue-900">
                <Mic className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                      <Badge variant="outline">{item.duration}</Badge>
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
      )}
    </div>
  )
}
