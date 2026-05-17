export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqItems: FaqItem[] = [
  { id: "1", category: "Booking", question: "How do I book a tour package?", answer: "You can book directly through our website by selecting a package and filling out the booking form, or contact us via WhatsApp/email for personalized assistance. A 20% deposit confirms your booking." },
  { id: "2", category: "Booking", question: "What is your cancellation policy?", answer: "Free cancellation up to 30 days before departure. 50% refund for cancellations 15-29 days prior. No refund for cancellations less than 15 days before departure." },
  { id: "3", category: "Booking", question: "Can I customize a tour package?", answer: "Absolutely! All our packages can be customized. Contact our team with your preferences and we'll create a personalized itinerary just for you." },
  { id: "4", category: "Travel", question: "Do I need a visa to visit Sri Lanka?", answer: "Most nationalities need an Electronic Travel Authorization (ETA). You can apply online before arrival. We can assist you with the process." },
  { id: "5", category: "Travel", question: "What is the best time to visit Sri Lanka?", answer: "Sri Lanka is a year-round destination. The west and south coasts are best from December to April, while the east coast shines from May to September." },
  { id: "6", category: "Travel", question: "What currency is used in Sri Lanka?", answer: "Sri Lankan Rupee (LKR). USD, EUR, and GBP are widely accepted at hotels. ATMs are available in all major towns." },
  { id: "7", category: "Safety", question: "Is Sri Lanka safe for tourists?", answer: "Sri Lanka is one of the safest countries in South Asia for tourists. The people are incredibly friendly and welcoming. Standard travel precautions apply." },
  { id: "8", category: "Safety", question: "What vaccinations do I need?", answer: "No mandatory vaccinations. Recommended: Hepatitis A & B, Typhoid. Consult your doctor before travel. Mosquito repellent is advisable." },
  { id: "9", category: "Accommodation", question: "What type of accommodation do you offer?", answer: "We offer a range from luxury 5-star resorts and boutique hotels to eco-lodges and heritage properties, depending on the package tier." },
  { id: "10", category: "Accommodation", question: "Can I upgrade my accommodation?", answer: "Yes, all packages offer accommodation upgrade options. Contact us for premium hotel alternatives and pricing." },
  { id: "11", category: "Travel", question: "What should I pack for Sri Lanka?", answer: "Light, breathable clothing, sunscreen, insect repellent, comfortable walking shoes, and modest clothing for temple visits. A light jacket for hill country." },
  { id: "12", category: "Booking", question: "Do you offer group discounts?", answer: "Yes! Groups of 6+ receive 10% off, groups of 10+ receive 15% off. Contact us for custom group pricing and arrangements." }
];
