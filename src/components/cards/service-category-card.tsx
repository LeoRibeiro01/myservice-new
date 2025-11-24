import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ServiceCategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export function ServiceCategoryCard({ title, description, icon: Icon, href }: ServiceCategoryCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Icon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
