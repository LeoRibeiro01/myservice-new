"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { auth, db, storage } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, Camera, FileText, Shield } from "lucide-react"
import React from "react" // necessário para tipos React.ComponentType

// -------------------------
// TIPOS
// -------------------------
type UploadField = "profilePhoto" | "cpfDocument" | "rgDocument" | "addressProof" | "criminalRecord"

interface FormDataType {
  fullName: string
  cpf: string
  email: string
  phone: string
  cep: string
  address: string
  number: string
  neighborhood: string
  city: string
  state: string

  profilePhoto: File | null
  cpfDocument: File | null
  rgDocument: File | null
  addressProof: File | null
  criminalRecord: File | null

  businessName: string
  cnpj: string
  description: string
  serviceCategory: string
  experienceTime: string
  hourlyRate: string
}

// -------------------------
// COMPONENTE DocumentUploadCard
// -------------------------
interface DocumentUploadCardProps {
  icon: React.ComponentType<any>
  label: string
  description: string
  field: UploadField
  uploaded: boolean
  onUpload: (field: UploadField) => void
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({ icon: Icon, label, description, field, uploaded, onUpload }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="font-medium mb-2">{label}</h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <Button variant="outline" onClick={() => onUpload(field)} className="w-full">
      <Upload className="h-4 w-4 mr-2" />
      {uploaded ? "Arquivo enviado ✓" : "Enviar arquivo"}
    </Button>
  </div>
)

// -------------------------
// FUNÇÕES AUXILIARES
// -------------------------
const initialFormData = (): FormDataType => ({
  fullName: "",
  cpf: "",
  email: "",
  phone: "",
  cep: "",
  address: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",

  profilePhoto: null,
  cpfDocument: null,
  rgDocument: null,
  addressProof: null,
  criminalRecord: null,

  businessName: "",
  cnpj: "",
  description: "",
  serviceCategory: "",
  experienceTime: "",
  hourlyRate: "",
})

function maskCPF(value: string) {
  const v = (value || "").replace(/\D/g, "").slice(0, 11)
  return v
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
}

function maskPhone(v: string) {
  const val = (v || "").replace(/\D/g, "").slice(0, 11)
  if (val.length <= 10) return val.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "")
  return val.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
}

function maskCEP(v: string) {
  const val = (v || "").replace(/\D/g, "").slice(0, 8)
  return val.replace(/^(\d{5})(\d)/, "$1-$2")
}

function validateCPF(cpfRaw: string) {
  const cpf = (cpfRaw || "").replace(/\D/g, "")
  if (!cpf || cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  const calc = (base: number) => {
    let sum = 0
    for (let i = 0; i < base; i++) sum += parseInt(cpf.charAt(i)) * (base + 1 - i)
    let rest = (sum * 10) % 11
    return rest === (rest === 10 ? 0 : parseInt(cpf.charAt(base)))
  }

  return calc(9) && calc(10)
}

  async function sha256Hex(text: string) {
    const enc = new TextEncoder().encode(text)
    const hash = await crypto.subtle.digest("SHA-256", enc)
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // -------------------------
  // COMPONENTE PRINCIPAL
  // -------------------------
  export default function ProviderRegisterPage() {
    const router = useRouter()
    const steps = [
      { id: 1, title: "Informações Pessoais", description: "Dados básicos e contato" },
      { id: 2, title: "Documentos", description: "Envio de arquivos obrigatórios" },
      { id: 3, title: "Profissional", description: "Dados sobre sua atuação" },
      { id: 4, title: "Revisão", description: "Confirme todo o cadastro" },
    ]

    const [currentStep, setCurrentStep] = useState<number>(1)
    const [formData, setFormData] = useState<FormDataType>(initialFormData())
    const [uploadedFiles, setUploadedFiles] = useState<Record<UploadField, boolean>>({
      profilePhoto: false,
      cpfDocument: false,
      rgDocument: false,
      addressProof: false,
      criminalRecord: false,
    })
    const [uid, setUid] = useState<string | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const progress = (currentStep / steps.length) * 100

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setLoadingAuth(false)
          router.push("/auth/login")
          return
        }
        const uidLocal = user.uid
        setUid(uidLocal)

        try {
          const userDoc = await getDoc(doc(db, "users", uidLocal))
          if (userDoc.exists()) {
            const d = userDoc.data() as any
            setFormData((prev) => ({
              ...prev,
              fullName: d.name || prev.fullName,
              email: d.email || prev.email,
              phone: d.phone || prev.phone,
            }))
          }
        } catch (err) {
          console.error("Erro ao buscar user:", err)
        } finally {
          setLoadingAuth(false)
        }
      })
      return () => unsub()
    }, [router])

    const handleInputChange = (field: keyof FormDataType, value: string) => {
      if (field === "cpf") value = maskCPF(value)
      if (field === "phone") value = maskPhone(value)
      if (field === "cep") value = maskCEP(value)
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  const handleFileUpload = (field: UploadField) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      if (file && file.size > 5 * 1024 * 1024) {
        alert("Arquivo maior que 5MB.");
        return;
      }
      // só marca como enviado
      setUploadedFiles((prev) => ({ ...prev, [field]: true }));
      // opcional: guarda o File real se quiser
      setFormData((prev) => ({ ...prev, [field]: file } as any));
    };
    input.click();
  };


    const validateStep = (step: number): string | null => {
      setError(null)
      if (step === 1) {
        if (!formData.fullName.trim()) return "Preencha o nome completo."
        if (!validateCPF(formData.cpf)) return "CPF inválido."
        if (!formData.email.includes("@")) return "Email inválido."
        if ((formData.phone || "").replace(/\D/g, "").length < 10) return "Telefone inválido."
      }
      if (step === 2) {
        if (!uploadedFiles.profilePhoto) return "Envie a foto de perfil."
        if (!uploadedFiles.cpfDocument) return "Envie o CPF."
      }
      if (step === 3) {
        if (!formData.serviceCategory) return "Selecione a categoria de serviço."
        if (!formData.description.trim()) return "Descreva sua atuação."
      }
      return null
    }

    const nextStep = () => {
      const err = validateStep(currentStep)
      if (err) {
        setError(err)
        return
      }
      setError(null)
      setCurrentStep((s) => Math.min(s + 1, steps.length))
    }
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    if (saving || !uid) return;
    setError(null);

    const err = validateStep(1) || validateStep(2) || validateStep(3);
    if (err) {
      setError(err);
      if (validateStep(1) === err) setCurrentStep(1);
      else if (validateStep(2) === err) setCurrentStep(2);
      else setCurrentStep(3);
      return;
    }

    setSaving(true);

    try {
      const cpfHash = formData.cpf ? await sha256Hex(formData.cpf.replace(/\D/g, "")) : null;

      const payload = {
        uid,
        fullName: formData.fullName,
        cpfHash,
        email: formData.email,
        phone: formData.phone,
        address: {
          cep: formData.cep,
          street: formData.address,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
        businessName: formData.businessName || null,
        cnpj: formData.cnpj ? formData.cnpj.replace(/\D/g, "") : null,
        description: formData.description,
        serviceCategory: formData.serviceCategory,
        experienceTime: formData.experienceTime,
        hourlyRate: formData.hourlyRate || null,
        documents: {
          profilePhotoUrl: null,
          cpfUrl: null,
          rgUrl: null,
          addressUrl: null,
          criminalUrl: null,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "prestadores", uid), payload, { merge: true });
      await setDoc(doc(db, "users", uid), {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        type: "prestador",
        updatedAt: serverTimestamp(),
      }, { merge: true });

      router.push("/dashboard/prestador"); // ✅ vai pra dashboard sem travar
    } catch (err: any) {
      console.error("Erro ao salvar prestador:", err);
      setError("Erro ao salvar cadastro. Veja o console.");
    } finally {
      setSaving(false);
    }
  };



  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto h-16 px-4 flex justify-between items-center">
          <span className="font-bold text-2xl text-indigo-600">MyService</span>
          <Button variant="link" onClick={() => router.push("login")}>Entrar</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Cadastro de Prestador</h1>
          <p className="text-gray-600">Complete todas as etapas para ativar seu perfil</p>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>{currentStep}/{steps.length} etapas</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

 {/* -------------------------
     Steps do formulário
------------------------- */}

{/* STEP 1 - Dados pessoais */}
{currentStep === 1 && (
  <div className="space-y-4">
    <div>
      <Label>Nome completo *</Label>
      <Input
        value={formData.fullName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange("fullName", e.target.value)
        }
        placeholder="Seu nome completo"
      />
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <Label>CPF *</Label>
        <Input
          value={formData.cpf}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("cpf", e.target.value)
          }
          placeholder="000.000.000-00"
        />
      </div>

      <div>
        <Label>E-mail *</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("email", e.target.value)
          }
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <Label>Telefone *</Label>
        <Input
          value={formData.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("phone", e.target.value)
          }
          placeholder="(11) 99999-9999"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <Label>CEP</Label>
        <Input
          value={formData.cep}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("cep", e.target.value)
          }
          placeholder="00000-000"
        />
      </div>
      <div>
        <Label>Endereço</Label>
        <Input
          value={formData.address}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("address", e.target.value)
          }
          placeholder="Rua, Av..."
        />
      </div>
      <div>
        <Label>Número</Label>
        <Input
          value={formData.number}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("number", e.target.value)
          }
          placeholder="123"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <Label>Bairro</Label>
        <Input
          value={formData.neighborhood}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("neighborhood", e.target.value)
          }
        />
      </div>
      <div>
        <Label>Cidade</Label>
        <Input
          value={formData.city}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("city", e.target.value)
          }
        />
      </div>
      <div>
        <Label>Estado</Label>
        <Input
          value={formData.state}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("state", e.target.value)
          }
        />
      </div>
    </div>
  </div>
)}

{/* STEP 2 - Upload de documentos */}
{currentStep === 2 && (
  <div className="grid md:grid-cols-2 gap-6">
    {[
      { field: "profilePhoto", label: "Foto de Perfil", icon: Camera, description: "PNG/JPG até 5MB" },
      { field: "cpfDocument", label: "CPF (frente e verso)", icon: FileText, description: "Documento legível" },
      { field: "rgDocument", label: "RG (frente e verso)", icon: FileText, description: "Carteira de identidade ou CNH" },
      { field: "addressProof", label: "Comprovante de residência", icon: FileText, description: "Conta em seu nome (últimos 3 meses)" },
      { field: "criminalRecord", label: "Antecedentes", icon: Shield, description: "Certidão negativa (opcional)" },
    ].map((doc) => (
      <DocumentUploadCard
        key={doc.field}
        icon={doc.icon}
        label={doc.label}
        description={doc.description}
        field={doc.field as UploadField}
        uploaded={uploadedFiles[doc.field as UploadField]}
        onUpload={handleFileUpload}
      />
    ))}
  </div>
)}


{/* STEP 3 - Informações profissionais */}
{currentStep === 3 && (
  <div className="space-y-4">
    <div>
      <Label>Nome empresarial (opcional)</Label>
      <Input
        value={formData.businessName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange("businessName", e.target.value)
        }
        placeholder="Ex: Silva Reparos"
      />
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label>Categoria de serviço *</Label>
        <Select
          value={formData.serviceCategory}
          onValueChange={(v) => handleInputChange("serviceCategory", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Construção">Construção e Reforma</SelectItem>
            <SelectItem value="Limpeza">Limpeza e Organização</SelectItem>
            <SelectItem value="Tecnologia">Tecnologia e Design</SelectItem>
            <SelectItem value="Beleza">Beleza e Estética</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Valor por hora (R$)</Label>
        <Input
          value={formData.hourlyRate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("hourlyRate", e.target.value)
          }
          placeholder="0,00"
        />
      </div>
    </div>

    <div>
      <Label>Descrição profissional *</Label>
      <Textarea
        value={formData.description}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          handleInputChange("description", e.target.value)
        }
        placeholder="Descreva sua experiência, diferenciais..."
      />
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label>Tempo de experiência</Label>
        <Input
          value={formData.experienceTime}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("experienceTime", e.target.value)
          }
          placeholder="Ex: 3 anos"
        />
      </div>
      <div>
        <Label>CNPJ (opcional)</Label>
        <Input
          value={formData.cnpj || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange("cnpj", e.target.value)
          }
          placeholder="00.000.000/0001-00"
        />
      </div>
    </div>
  </div>
)}

{/* STEP 4 - Revisão final */}
{currentStep === 4 && (
  <div className="space-y-6">
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
      <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
      <div>
        <h3 className="text-green-800 font-semibold text-lg">Quase pronto!</h3>
        <p className="text-green-700 text-sm mt-1">Revise seus dados antes de finalizar.</p>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2 text-sm">
      <p><strong>Nome:</strong> {formData.fullName}</p>
      <p><strong>CPF:</strong> {formData.cpf || "—"}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Telefone:</strong> {formData.phone}</p>
      <p><strong>Endereço:</strong> {formData.address} {formData.number && `, ${formData.number}`}</p>
      {formData.businessName && <p><strong>Empresa:</strong> {formData.businessName}</p>}
      <p><strong>Atuação:</strong> {formData.serviceCategory}</p>
    </div>

    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
      <strong>Documentos enviados:</strong>
      <ul className="list-disc ml-5 mt-1">
        {uploadedFiles.profilePhoto && <li>Foto de perfil</li>}
        {uploadedFiles.cpfDocument && <li>CPF</li>}
        {uploadedFiles.rgDocument && <li>RG</li>}
        {uploadedFiles.addressProof && <li>Comprovante de endereço</li>}
        {uploadedFiles.criminalRecord && <li>Antecedentes criminais</li>}
        {!Object.values(uploadedFiles).some(Boolean) && <li>Nenhum documento enviado</li>}
      </ul>
    </div>
  </div>
)}

{/* Error */}
 {error && <div className="text-red-600">{error}</div>}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>Voltar</Button>
              {currentStep < steps.length ? (
                <Button onClick={nextStep}>Próximo</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={saving || !uid}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? "Finalizando cadastro..." : "Finalizar cadastro"}
                </Button>

              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
