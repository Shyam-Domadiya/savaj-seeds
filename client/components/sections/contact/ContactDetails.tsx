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
    <div className={cn("space-y-6", className)}>
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Address</h4>
              <div className="text-muted-foreground space-y-1">
                <p>{businessInfo.address.street}</p>
                <p>{businessInfo.address.city}, {businessInfo.address.state}</p>
                <p>{businessInfo.address.pincode}, {businessInfo.address.country}</p>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Phone Numbers</h4>
              <div className="space-y-2">
                {businessInfo.contact.phone.map((phone, index) => (
                  <Link
                    key={index}
                    href={`tel:${phone}`}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {phone}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Email Addresses */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email Addresses</h4>
              <div className="space-y-2">
                {businessInfo.contact.email.map((email, index) => (
                  <Link
                    key={index}
                    href={`mailto:${email}`}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {email}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          {businessInfo.contact.whatsapp && (
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">WhatsApp</h4>
                <Link
                  href={`https://wa.me/${businessInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-green-600 transition-colors duration-300"
                >
                  {businessInfo.contact.whatsapp}
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>




    </div>
  );
}