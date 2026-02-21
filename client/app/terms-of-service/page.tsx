"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Breadcrumb } from "@/components/shared/breadcrumb"

export default function TermsOfService() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-12">
                <Breadcrumb />
                <div className="max-w-4xl mx-auto mt-8 prose prose-green dark:prose-invert">
                    <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: February 21, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Acceptable Use</h2>
                        <p>By accessing and using Savaj Seeds website, you agree to comply with all applicable laws and regulations. You are prohibited from using the site for any unlawful purpose.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">2. Intellectual Property</h2>
                        <p>All content on this website, including text, graphics, logos, and images, is the property of Savaj Seeds and is protected by intellectual property laws.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">3. Disclaimer of Warranties</h2>
                        <p>Our seeds are provided "as is" without any warranties, express or implied. We do not guarantee specific crop yields as they depend on various environmental factors.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Contact Information</h2>
                        <p>If you have any questions about these Terms, please contact us at support@savajseeds.com.</p>
                    </section>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
