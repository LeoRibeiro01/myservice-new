"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ChangeEvent } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Camera,
  FileImage,
  Building,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, title: "Informações Pessoais", description: "Dados básicos e contato" },
  { id: 2, title: "Documentação", description: "Documentos obrigatórios" },
  { id: 3, title: "Informações Profissionais", description: "Experiência e serviços" },
  { id: 4, title: "Verificação", description: "Validação e aprovação" },
]

const serviceCategories = [
  "Construção e Reforma",
  "Limpeza e Organização",
  "Elétrica e Hidráulica",
  "Jardinagem e Paisagismo",
  "Tecnologia e Design",
  "Educação e Ensino",
  "Saúde e Bem-estar",
  "Transporte e Logística",
  "Alimentação e Gastronomia",
  "Beleza e Estética",
  "Consultoria e Negócios",
  "Arte e Entretenimento",
]

export default function ProviderRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Informações Pessoais
    fullName: "",
    cpf: "",
    rg: "",
    birthDate: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Documentação
    profilePhoto: null,
    cpfDocument: null,
    rgDocument: null,
    addressProof: null,
    criminalRecord: null,

    // Informações Profissionais
    businessName: "",
    cnpj: "",
    serviceCategory: "",
    services: [],
    experience: "",
    description: "",
    hourlyRate: "",
    portfolio: [],
    certifications: [],

    // Verificação
    bankAccount: "",
    bankAgency: "",
    bankNumber: "",
    pixKey: "",

    // Termos
    termsAccepted: false,
    privacyAccepted: false,
    backgroundCheckAccepted: false,
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    profilePhoto: false,
    cpfDocument: false,
    rgDocument: false,
    addressProof: false,
    criminalRecord: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string) => {
    // Simular upload de arquivo
    setUploadedFiles((prev) => ({ ...prev, [field]: true }))
    alert(`Arquivo ${field} enviado com sucesso!`)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Simular envio de cadastro
    setTimeout(() => {
      // Redirecionar para o dashboard do prestador
      router.push("/dashboard/provider")
    }, 1500)
  }

  const getStepProgress = () => (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              MyService
            </Link>
            <div className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-indigo-600 hover:underline">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Prestador de Serviço</h1>
            <p className="text-gray-600">Complete todas as etapas para se tornar um prestador verificado</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso do cadastro</span>
              <span className="text-sm text-gray-500">{currentStep}/4 etapas</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-center p-4 rounded-lg border ${
                  currentStep === step.id
                    ? "bg-indigo-50 border-indigo-200"
                    : currentStep > step.id
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step.id ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {step.id}
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Informações Pessoais */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nome completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("fullName", e.target.value)}
                        placeholder="Seu nome completo"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rg">RG *</Label>
                    <Input
                      id="rg"
                      value={formData.rg}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("rg", e.target.value)}
                      placeholder="00.000.000-0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Data de nascimento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("birthDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                        placeholder="seu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("whatsapp", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço completo *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("address", e.target.value)}
                      placeholder="Rua, número, complemento"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("city", e.target.value)}
                      placeholder="Sua cidade"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("zipCode", e.target.value)}
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documentação */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Documentos obrigatórios</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Todos os documentos são obrigatórios para verificação de identidade e segurança dos clientes.
                        Aceitos: JPG, PNG, PDF (máx. 5MB cada)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Foto do perfil *</h3>
                      <p className="text-sm text-gray-600 mb-4">Foto clara do rosto, sem óculos escuros ou chapéu</p>
                      <Button variant="outline" onClick={() => handleFileUpload("profilePhoto")} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedFiles.profilePhoto ? "Arquivo enviado ✓" : "Enviar foto"}
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">CPF (frente e verso) *</h3>
                      <p className="text-sm text-gray-600 mb-4">Documento de identidade fiscal</p>
                      <Button variant="outline" onClick={() => handleFileUpload("cpfDocument")} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedFiles.cpfDocument ? "Arquivo enviado ✓" : "Enviar CPF"}
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">RG (frente e verso) *</h3>
                      <p className="text-sm text-gray-600 mb-4">Carteira de identidade ou CNH</p>
                      <Button variant="outline" onClick={() => handleFileUpload("rgDocument")} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedFiles.rgDocument ? "Arquivo enviado ✓" : "Enviar RG"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Comprovante de residência *</h3>
                      <p className="text-sm text-gray-600 mb-4">Conta de luz, água ou telefone (últimos 3 meses)</p>
                      <Button variant="outline" onClick={() => handleFileUpload("addressProof")} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedFiles.addressProof ? "Arquivo enviado ✓" : "Enviar comprovante"}
                      </Button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Antecedentes criminais *</h3>
                      <p className="text-sm text-gray-600 mb-4">Certidão negativa de antecedentes criminais</p>
                      <Button variant="outline" onClick={() => handleFileUpload("criminalRecord")} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedFiles.criminalRecord ? "Arquivo enviado ✓" : "Enviar certidão"}
                      </Button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-blue-800">Como obter a certidão?</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Acesse o site da Polícia Civil do seu estado ou vá presencialmente a um posto de
                            atendimento. O documento é gratuito para fins trabalhistas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Informações Profissionais */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Nome do negócio (opcional)</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("businessName", e.target.value)}
                        placeholder="Nome da sua empresa"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("cnpj", e.target.value)}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceCategory">Categoria principal *</Label>
                  <Select
                    value={formData.serviceCategory}
                    onValueChange={(value) => handleInputChange("serviceCategory", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua área de atuação" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="services">Serviços oferecidos *</Label>
                  <Textarea
                    id="services"
                    value={formData.services}
                    onChange={(e) => handleInputChange("services", e.target.value)}
                    placeholder="Liste os serviços que você oferece (ex: Instalação elétrica, Manutenção preventiva, Reparo de equipamentos)"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experiência profissional *</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua experiência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Menos de 1 ano</SelectItem>
                      <SelectItem value="1-3">1 a 3 anos</SelectItem>
                      <SelectItem value="3-5">3 a 5 anos</SelectItem>
                      <SelectItem value="5-10">5 a 10 anos</SelectItem>
                      <SelectItem value="10+">Mais de 10 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição profissional *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva sua experiência, especialidades e diferenciais. Esta descrição aparecerá no seu perfil."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Valor por hora (R$) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">R$</span>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("hourlyRate", e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Você poderá alterar este valor a qualquer momento no seu perfil
                  </p>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Portfólio (opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Adicione fotos dos seus trabalhos</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Mostre a qualidade dos seus serviços com fotos de trabalhos realizados
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar fotos
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Certificações (opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Certificados e cursos</h3>
                    <p className="text-sm text-gray-600 mb-4">Adicione certificados que comprovem sua qualificação</p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar certificados
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verificação */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-green-800">Quase pronto!</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Complete as informações bancárias para receber pagamentos e aceite os termos para finalizar.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Informações bancárias
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bankNumber">Banco *</Label>
                      <Select
                        value={formData.bankNumber}
                        onValueChange={(value) => handleInputChange("bankNumber", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="001">Banco do Brasil</SelectItem>
                          <SelectItem value="104">Caixa Econômica</SelectItem>
                          <SelectItem value="237">Bradesco</SelectItem>
                          <SelectItem value="341">Itaú</SelectItem>
                          <SelectItem value="033">Santander</SelectItem>
                          <SelectItem value="260">Nu Pagamentos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bankAgency">Agência *</Label>
                      <Input
                        id="bankAgency"
                        value={formData.bankAgency}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("bankAgency", e.target.value)}
                        placeholder="0000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankAccount">Conta *</Label>
                      <Input
                        id="bankAccount"
                        value={formData.bankAccount}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("bankAccount", e.target.value)}
                        placeholder="00000-0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pixKey">Chave PIX (opcional)</Label>
                  <Input
                    id="pixKey"
                    value={formData.pixKey}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("pixKey", e.target.value)}
                    placeholder="CPF, e-mail, telefone ou chave aleatória"
                  />
                  <p className="text-sm text-gray-500 mt-1">Facilite o recebimento de pagamentos com PIX</p>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Termos e condições</h3>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      Aceito os{" "}
                      <Link href="/terms" className="text-indigo-600 hover:underline">
                        termos de uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacy" className="text-indigo-600 hover:underline">
                        política de privacidade
                      </Link>{" "}
                      da plataforma MyService
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={formData.privacyAccepted}
                      onCheckedChange={(checked) => handleInputChange("privacyAccepted", checked)}
                    />
                    <Label htmlFor="privacy" className="text-sm leading-relaxed">
                      Autorizo o tratamento dos meus dados pessoais conforme a LGPD para fins de prestação de serviços
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="background"
                      checked={formData.backgroundCheckAccepted}
                      onCheckedChange={(checked) => handleInputChange("backgroundCheckAccepted", checked)}
                    />
                    <Label htmlFor="background" className="text-sm leading-relaxed">
                      Autorizo a verificação de antecedentes criminais e validação dos documentos fornecidos
                    </Label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Próximos passos</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Análise da documentação (até 24 horas)</li>
                    <li>• Verificação de antecedentes (até 48 horas)</li>
                    <li>• Aprovação e ativação do perfil</li>
                    <li>• Você receberá um e-mail com o resultado</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Voltar
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep}>Próximo</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted || !formData.privacyAccepted || !formData.backgroundCheckAccepted}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finalizar cadastro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
