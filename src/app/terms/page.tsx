import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms & Conditions | Good's Lanka Tours & Travels",
  description: "Read the terms and conditions for Good's Lanka Tours & Travels services.",
};

export default function TermsPage() {
  return (
    <main className="pt-32 lg:pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-tropical-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Legal</span>
        <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">Terms & Conditions</h1>
        <div className="section-divider mb-8" />
        <p className="text-gray-400 text-sm mb-12">Last updated: January 1, 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">1. Booking & Reservations</h2>
            <p>All tour bookings are subject to availability and confirmation by our team. A booking is confirmed only upon receipt of the required deposit (20% of the total tour cost) and written confirmation from Good&apos;s Lanka Tours & Travels. Full payment is required 14 days prior to the tour departure date.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">2. Cancellation Policy</h2>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>30+ days before departure:</strong> Full refund minus processing fee</li>
              <li><strong>15–29 days before departure:</strong> 50% refund</li>
              <li><strong>Less than 15 days:</strong> No refund</li>
              <li>Cancellations must be submitted in writing via email</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">3. Travel Insurance</h2>
            <p>We strongly recommend all travelers obtain comprehensive travel insurance before departure. Good&apos;s Lanka Tours & Travels is not liable for any medical expenses, losses, or damages during your trip that would be covered by travel insurance.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">4. Itinerary Changes</h2>
            <p>We reserve the right to modify tour itineraries due to weather conditions, safety concerns, or circumstances beyond our control. In such cases, we will provide suitable alternatives of equal or greater value. No refunds are given for minor itinerary adjustments.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">5. Traveler Responsibilities</h2>
            <p>Travelers are responsible for ensuring valid travel documents (passport, visa, ETA), meeting health requirements, and following the guidelines provided by our tour guides. We are not liable for denied entry due to insufficient documentation.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">6. Liability</h2>
            <p>Good&apos;s Lanka Tours & Travels acts as a facilitator between travelers and third-party service providers (hotels, transport, activities). While we carefully vet our partners, we are not directly liable for services provided by third parties. Our maximum liability is limited to the tour price paid.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">7. Pricing</h2>
            <p>All prices on our website are in US Dollars (USD) and are per person unless stated otherwise. Prices are subject to change without notice, but confirmed bookings will be honored at the booked price. Additional costs (visa fees, personal expenses, tips) are not included unless explicitly mentioned.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-ocean-900 mb-3">8. Contact</h2>
            <p>For questions regarding these terms, contact us at:</p>
            <p className="mt-2">
              <strong>Good&apos;s Lanka Tours & Travels</strong><br />
              42 Temple Road, Colombo 03, Sri Lanka<br />
              Email: legal@goodslanka.com<br />
              Phone: +94 77 726 6044
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
