"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Clock,
} from "lucide-react"
import { businessInfo } from "@/lib/data/team"

interface ContactMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  action: () => void
  availability: string
  responseTime: string
  preferred?: boolean
}

export function MultiContactMethods() {
  const contactMethods: ContactMethod[] = [
    {
      id: "phone",
      name: "Phone Call",
      description: "Speak directly with our agricultural experts",
      icon: <Phone className="w-5 h-5" />,
      action: () => window.open(`tel:${businessInfo.contact.phone[0]}`),
      availability: "Mon-Fri 9AM-6PM, Sat 9AM-2PM",
      responseTime: "Immediate",
      preferred: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Quick messaging with instant responses",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => window.open(`https://wa.me/${businessInfo.contact.whatsapp?.replace(/[^0-9]/g, '')}`),
      availability: "24/7 automated, Live chat 9AM-6PM",
      responseTime: "Within 5 minutes",
      preferred: true,
    },
    {
      id: "email",
      name: "Email Support",
      description: "Detailed inquiries and documentation",
      icon: <Mail className="w-5 h-5" />,
      action: () => window.open(`mailto:${businessInfo.contact.email[0]}`),
      availability: "24/7",
      responseTime: "Within 4 hours",
    },
  ]

  const socialMethods = [
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      url: businessInfo.socialMedia.facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-4 h-4" />,
      url: businessInfo.socialMedia.instagram,
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-4 h-4" />,
      url: businessInfo.socialMedia.twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      url: businessInfo.socialMedia.linkedin,
      color: "hover:text-blue-700",
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-4 h-4" />,
      url: businessInfo.socialMedia.youtube,
      color: "hover:text-red-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Primary Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Choose Your Preferred Contact Method</CardTitle>
          <p className="text-muted-foreground">
            We offer multiple ways to get in touch. Select the method that works best for you.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactMethods.map((method) => (
              <Card
                key={method.id}
                className="relative cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                onClick={method.action}
              >
                {method.preferred && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">
                    Recommended
                  </Badge>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{method.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {method.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{method.availability}</span>
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          Response: {method.responseTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
