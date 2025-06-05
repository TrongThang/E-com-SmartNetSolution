// components/ui/ProductForm.jsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function OrderSteps({ steps, currentStep }) {

    return (
        <>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"
                                }`}
                        >
                            <step.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-2 hidden sm:block">
                            <div
                                className={`text-sm font-medium ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}
                            >
                                {step.title}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}