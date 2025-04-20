"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, Clock, MessageSquare, Users } from "lucide-react"
import { useMemo, memo } from "react"

const StatCard = memo(({ stat }: { stat: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}}) => {
  const Icon = stat.icon;
  
  return (
    <Card className="card-hover border-t-4 transition-all" style={{ borderTopColor: `hsl(${stat.valueColor})` }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
            <p className="text-3xl font-bold" style={{ color: `hsl(${stat.valueColor})` }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </div>
          <div className={`p-3 rounded-full ${stat.iconBg}`}>
            <Icon className={`h-6 w-6 ${stat.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = "StatCard";

export function DashboardStats() {
  const stats = useMemo(() => [
    {
      title: "Total Patients",
      value: "1,284",
      description: "+12% from last month",
      icon: Users,
      iconBg: "gradient-primary",
      iconColor: "text-primary-foreground",
      valueColor: "var(--primary)",
    },
    {
      title: "Hours Saved",
      value: "128",
      description: "This month through automation",
      icon: Clock,
      iconBg: "gradient-success",
      iconColor: "text-white",
      valueColor: "var(--success)",
    },
    {
      title: "Automated Tasks",
      value: "842",
      description: "Completed this month",
      icon: ClipboardList,
      iconBg: "gradient-primary",
      iconColor: "text-white",
      valueColor: "var(--primary)",
    },
    {
      title: "Patient Engagements",
      value: "356",
      description: "Automated communications",
      icon: MessageSquare,
      iconBg: "gradient-primary",
      iconColor: "text-white",
      valueColor: "var(--primary)",
    },
  ], []);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  )
}
