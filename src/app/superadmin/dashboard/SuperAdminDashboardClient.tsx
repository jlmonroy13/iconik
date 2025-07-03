"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input, Button, useNotifications } from "@/components/ui"
import { superAdminCreateSpaSchema, SuperAdminCreateSpaFormData } from "./schemas"
import { API_ROUTES } from "@/lib/constants/routes"

export default function SuperAdminDashboardClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSuccess, showError } = useNotifications()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuperAdminCreateSpaFormData>({
    resolver: zodResolver(superAdminCreateSpaSchema),
    defaultValues: {
      spaName: "",
      spaSlug: "",
      spaEmail: "",
      adminName: "",
      adminEmail: "",
    },
  })

  const onSubmit = async (data: SuperAdminCreateSpaFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(API_ROUTES.DASHBOARD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      if (!response.ok) {
        showError("Error", res.error || "Error desconocido al crear el spa o el administrador.")
      } else {
        showSuccess("Éxito", res.message || "Spa y administrador creados exitosamente.")
        reset()
      }
    } catch {
      showError("Error", "Error de red o del servidor. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Crear nuevo spa</h2>
          <Input
            label="Spa Name"
            {...register("spaName")}
            error={errors.spaName?.message}
          />
          <Input
            label="Spa Slug"
            {...register("spaSlug")}
            error={errors.spaSlug?.message}
          />
          <Input
            label="Correo electrónico del spa (opcional)"
            type="email"
            {...register("spaEmail")}
            error={errors.spaEmail?.message}
            placeholder="opcional"
          />
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Crear administrador del spa</h2>
          <Input
            label="Nombre del administrador"
            {...register("adminName")}
            error={errors.adminName?.message}
          />
          <Input
            label="Correo electrónico del administrador"
            type="email"
            {...register("adminEmail")}
            error={errors.adminEmail?.message}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creando..." : "Crear spa y administrador"}
          </Button>
        </form>
      </div>
    </div>
  )
}
