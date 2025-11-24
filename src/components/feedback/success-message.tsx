import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SuccessMessageProps {
  title?: string
  message: string
}

export function SuccessMessage({ title = "Sucesso", message }: SuccessMessageProps) {
  return (
    <Alert className="border-green-200 bg-green-50 text-green-800">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
