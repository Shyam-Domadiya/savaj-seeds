"use client"

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Building
} from 'lucide-react';
import { businessInfo } from '@/lib/data/team';
import { cn } from '@/lib/utils';

interface BusinessInfoProps {
  className?: string;
}

export function BusinessInfo({
  className
}: BusinessInfoProps) {

  return (
    <div className={cn("space-y-10", className)}>
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
          <Building className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Contact Information</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          {/* Address */}
          <div className="flex items-start gap-4 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 text-primary flex-shrink-0 transition-colors duration-300 group-hover:bg-primary/10">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">Our Location</h4>
              <div className="text-muted-foreground space-y-1 leading-relaxed">
                <p>{businessInfo.address.street}</p>
                <p>{businessInfo.address.city}, {businessInfo.address.state}</p>
                <p>{businessInfo.address.pincode}, {businessInfo.address.country}</p>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-start gap-4 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 text-primary flex-shrink-0 transition-colors duration-300 group-hover:bg-primary/10">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Call Us</h4>
              <div className="space-y-2">
                {businessInfo.contact.phone.map((phone, index) => (
                  <Link
                    key={index}
                    href={`tel:${phone}`}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-lg"
                  >
                    {phone}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Email Addresses */}
          <div className="flex items-start gap-4 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 text-primary flex-shrink-0 transition-colors duration-300 group-hover:bg-primary/10">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Email Support</h4>
              <div className="space-y-2">
                {businessInfo.contact.email.map((email, index) => (
                  <Link
                    key={index}
                    href={`mailto:${email}`}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-lg break-all"
                  >
                    {email}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          {businessInfo.contact.whatsapp && (
            <div className="flex items-start gap-4 group">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex-shrink-0 transition-colors duration-300 group-hover:bg-green-100">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Instant Chat</h4>
                <Link
                  href={`https://wa.me/${businessInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-green-600 transition-colors duration-300 text-lg"
                >
                  {businessInfo.contact.whatsapp}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>




    </div>
  );
}