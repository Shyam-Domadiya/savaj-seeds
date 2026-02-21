"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Breadcrumb } from "@/components/shared/breadcrumb"

export default function PrivacyPolicy() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-12">
                <Breadcrumb />
                <div className="max-w-4xl mx-auto mt-8 prose prose-green dark:prose-invert">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: February 21, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Information We Collect</h2>
                        <p>We collect information that you voluntarily provide to us when you express an interest in obtaining information about us or our products, such as your name, email address, and contact details.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, operate, and maintain our website, to improve our services, and to communicate with you about your orders or inquiries.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">3. Data Protection</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Cookies</h2>
                        <p>Our website uses cookies to enhance user experience and analyze traffic. You can choose to disable cookies through your browser settings.</p>
                    </section>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
