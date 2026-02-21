"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Breadcrumb } from "@/components/shared/breadcrumb"

export default function RefundPolicy() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-12">
                <Breadcrumb />
                <div className="max-w-4xl mx-auto mt-8 prose prose-green dark:prose-invert">
                    <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: February 21, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Seed Quality Guarantee</h2>
                        <p>At Savaj Seeds, we strive for the highest quality. If you find that the seeds do not meet the germination standards stated on the packaging, please contact us within 30 days of purchase.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">2. Eligibility for Refunds</h2>
                        <p>To be eligible for a refund, you must provide proof of purchase and a description / photos of the issue. Refunds are processed for genuine quality defects only.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">3. Non-Refundable Items</h2>
                        <p>Opened seed packets where the issue is related to environmental factors (soil quality, water, weather) rather than seed quality are non-refundable.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Process</h2>
                        <p>Expect refund processing within 7-10 business days after approval of your claim.</p>
                    </section>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
