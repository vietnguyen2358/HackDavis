import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Mic, FileCheck } from "lucide-react"

interface DocumentationListProps {
  type: "transcription" | "notes" | "forms"
}

export function DocumentationList({ type }: DocumentationListProps) {
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

  const getItems = () => {
    const Icon = getIcon()

    if (type === "transcription") {
      return [
        {
          id: 1,
          title: "Patient Consultation - Emma Thompson",
          date: "Today, 10:30 AM",
          duration: "12 min",
          icon: Icon,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 2,
          title: "Follow-up Call - Michael Chen",
          date: "Today, 9:15 AM",
          duration: "8 min",
          icon: Icon,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
        {
          id: 3,
          title: "Pre-Surgery Consultation - James Wilson",
          date: "Yesterday, 2:45 PM",
          duration: "15 min",
          icon: Icon,
          iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900",
        },
      ]
    } else if (type === "notes") {
      return [
        {
          id: 1,
          title: "Clinical Notes - Emma Thompson",
          date: "Today, 10:45 AM",
          type: "Consultation Notes",
          icon: Icon,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
        {
          id: 2,
          title: "Treatment Plan - Michael Chen",
          date: "Today, 9:30 AM",
          type: "Treatment Notes",
          icon: Icon,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
        {
          id: 3,
          title: "Surgery Preparation - James Wilson",
          date: "Yesterday, 3:00 PM",
          type: "Pre-Surgery Notes",
          icon: Icon,
          iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900",
        },
      ]
    } else {
      return [
        {
          id: 1,
          title: "Insurance Claim Form - Emma Thompson",
          date: "Today, 11:00 AM",
          formType: "Insurance Claim",
          icon: Icon,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 2,
          title: "Prescription Renewal - Michael Chen",
          date: "Today, 9:45 AM",
          formType: "Prescription",
          icon: Icon,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
        {
          id: 3,
          title: "Consent Form - James Wilson",
          date: "Yesterday, 3:15 PM",
          formType: "Consent Form",
          icon: Icon,
          iconColor: "text-green-500 bg-green-100 dark:bg-green-900",
        },
      ]
    }
  }

  const items = getItems()

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`p-2 rounded-full ${item.iconColor}`}>
            <item.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  {type === "transcription" && <Badge variant="outline">{item.duration}</Badge>}
                  {type === "notes" && <Badge variant="outline">{item.type}</Badge>}
                  {type === "forms" && <Badge variant="outline">{item.formType}</Badge>}
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
