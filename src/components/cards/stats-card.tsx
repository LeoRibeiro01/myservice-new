import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.positive ? "text-green-600" : "text-red-600"}`}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className="bg-indigo-100 rounded-full p-3">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
