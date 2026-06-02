export interface Package {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  tourDescription: string;
  image: string;
  images: string[];
  duration: string;
  nights: number;
  groupSize: string;
  maxGuests: number;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; description: string }[];
}

export const packages: Package[] = [
  {
    id: "1",
    name: "Cultural Triangle Explorer",
    slug: "cultural-triangle-explorer",
    tagline: "Uncover Ancient Kingdoms",
    description: "Journey through Sri Lanka's ancient cities — from the rock fortress of Sigiriya to the sacred city of Kandy. Experience UNESCO World Heritage Sites, ancient temples, and the rich cultural tapestry that makes Sri Lanka unique.",
    tourDescription: "This extraordinary 7-day journey takes you deep into the heart of Sri Lanka's legendary Cultural Triangle — a treasure chest of ancient civilisations that flourished over 2,000 years ago. You'll climb the breathtaking Sigiriya Rock Fortress, a 5th-century palace perched 200 metres above the surrounding jungle, explore the ancient cave temples of Dambulla adorned with centuries-old frescoes, and cycle through the sprawling ruins of Polonnaruwa. The journey culminates in Kandy, Sri Lanka's last royal capital, where you'll witness the sacred Temple of the Tooth Relic and experience a traditional Kandyan dance performance. Throughout the trip, your private English-speaking guide brings history to life, and hand-picked accommodation ensures comfort after each day of discovery.",
    image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80",
      "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=800&q=80",
      "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?w=800&q=80"
    ],
    duration: "7 Days / 6 Nights",
    nights: 6,
    groupSize: "2-12 People",
    maxGuests: 12,
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 342,
    category: "Cultural",
    highlights: ["Sigiriya Rock Fortress", "Temple of the Tooth", "Dambulla Cave Temple", "Polonnaruwa Ruins", "Traditional Dance Show", "Spice Garden Visit"],
    included: [
      "English Speaking Private Driver Guide",
      "Airport Pick-up and Drop Off",
      "Activities & Attractions Entrance Fees",
      "Air-conditioned Private Vehicle",
      "Unlimited Wi-Fi (inside the vehicle)",
      "6 Nights Accommodation (Breakfast included)",
      "Daily Breakfast & Dinner",
      "All Government Taxes & Service Charges"
    ],
    excluded: [
      "Personal Expenses (Laundry, Telephone calls, Tips)",
      "Extra Excursions not mentioned in itinerary",
      "Lunch / Snacks (unless specified)",
      "Travel Insurance",
      "International Flights",
      "Camera / Video Entry Fees at certain sites",
      "Alcoholic Beverages"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Colombo", description: "Airport pickup and transfer to Negombo. Evening beach walk and welcome dinner." },
      { day: 2, title: "Dambulla & Sigiriya", description: "Visit Dambulla Cave Temple, then climb the iconic Sigiriya Rock Fortress." },
      { day: 3, title: "Polonnaruwa", description: "Explore the ancient ruins of Polonnaruwa by bicycle." },
      { day: 4, title: "Kandy", description: "Drive to Kandy via a spice garden. Visit the Temple of the Tooth." },
      { day: 5, title: "Kandy Exploration", description: "Royal Botanical Gardens and traditional Kandyan dance show." },
      { day: 6, title: "Tea Country", description: "Visit a tea factory and plantation in the highlands." },
      { day: 7, title: "Departure", description: "Transfer to the airport for departure." }
    ]
  },
  {
    id: "2",
    name: "Tropical Beach Escape",
    slug: "tropical-beach-escape",
    tagline: "Sun, Sand & Serenity",
    description: "Relax on Sri Lanka's most pristine beaches. From the whale-watching paradise of Mirissa to the colonial charm of Galle, this coastal journey combines luxury relaxation with thrilling ocean adventures.",
    tourDescription: "Escape to the sun-drenched southern coast of Sri Lanka on this 5-day paradise retreat. Begin in Bentota, where crystal-clear lagoon waters invite you to jet-ski, snorkel, and ride banana boats. Drive along the scenic coastal highway to the UNESCO-listed Galle Fort, where Dutch colonial ramparts meet boutique cafés and artisan shops. Continue to Mirissa — Sri Lanka's most celebrated beach town — for a sunrise whale watching expedition where blue whales and spinner dolphins put on a spectacular show. Your days here are filled with golden sands, swaying palms, and spectacular Indian Ocean sunsets. Accommodation is carefully chosen for each destination — oceanfront resorts and charming boutique guesthouses that put you right at the heart of the coast.",
    image: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=800&q=80"
    ],
    duration: "5 Days / 4 Nights",
    nights: 4,
    groupSize: "2-8 People",
    maxGuests: 8,
    price: 649,
    originalPrice: 849,
    rating: 4.8,
    reviewCount: 289,
    category: "Beach",
    highlights: ["Mirissa Beach", "Whale Watching", "Galle Fort Tour", "Bentota Water Sports", "Coconut Tree Hill", "Sunset Cruise"],
    included: [
      "English Speaking Private Driver Guide",
      "Airport Pick-up and Drop Off",
      "Whale Watching Boat Trip",
      "Water Sports Session (Jet Ski, Banana Boat, Snorkeling)",
      "Air-conditioned Private Vehicle",
      "Unlimited Wi-Fi (inside the vehicle)",
      "4 Nights Beach Resort Accommodation",
      "Daily Breakfast"
    ],
    excluded: [
      "Personal Expenses (Laundry, Telephone calls, Tips)",
      "Lunch / Dinner / Snacks",
      "Extra Excursions not mentioned in itinerary",
      "Travel Insurance",
      "International Flights",
      "Alcoholic Beverages"
    ],
    itinerary: [
      { day: 1, title: "Arrival at Bentota", description: "Transfer to beach resort. Evening sunset on the beach." },
      { day: 2, title: "Bentota Adventures", description: "Morning water sports — jet ski, banana boat, snorkeling." },
      { day: 3, title: "Galle Fort", description: "Explore the UNESCO Galle Fort, boutiques, and cafés." },
      { day: 4, title: "Mirissa Magic", description: "Early morning whale watching, afternoon at Coconut Tree Hill." },
      { day: 5, title: "Departure", description: "Leisure morning and transfer to airport." }
    ]
  },
  {
    id: "3",
    name: "Hill Country Adventure",
    slug: "hill-country-adventure",
    tagline: "Misty Mountains & Tea Trails",
    description: "Traverse the breathtaking highlands of Sri Lanka. Trek through emerald tea plantations, cross the legendary Nine Arch Bridge, and experience the famous train journey through misty mountain passes.",
    tourDescription: "Sri Lanka's hill country is unlike anywhere else on Earth — a world of rolling emerald tea estates, mist-draped peaks, cascading waterfalls, and one of the world's most scenic train journeys. This 6-day adventure begins in Kandy and climbs steadily into the clouds, passing through Nuwara Eliya (known as 'Little England' for its colonial-era charm) before arriving in Ella, the jewel of the highlands. You'll trek to World's End at Horton Plains for a sunrise that reveals a sheer 880-metre drop, photograph the iconic Nine Arch Bridge as the vintage blue train passes overhead, and hike to Ravana Falls. Expert guides lead every trek, and you'll sleep in beautifully located boutique hotels and tea estate bungalows that place you right in the heart of the landscape.",
    image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80",
      "https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=800&q=80"
    ],
    duration: "6 Days / 5 Nights",
    nights: 5,
    groupSize: "2-10 People",
    maxGuests: 10,
    price: 749,
    originalPrice: 999,
    rating: 4.9,
    reviewCount: 412,
    category: "Adventure",
    highlights: ["Ella Train Journey", "Nine Arch Bridge", "Little Adam's Peak", "Tea Plantation Tour", "Ravana Falls", "Horton Plains"],
    included: [
      "English Speaking Private Driver Guide",
      "Airport Pick-up and Drop Off",
      "Scenic Train Tickets (Kandy to Ella)",
      "Activities & Attractions Entrance Fees",
      "Air-conditioned Private Vehicle",
      "Unlimited Wi-Fi (inside the vehicle)",
      "5 Nights Boutique Hotel Accommodation",
      "Daily Breakfast & Lunch"
    ],
    excluded: [
      "Personal Expenses (Laundry, Telephone calls, Tips)",
      "Dinner / Snacks (unless specified)",
      "Extra Excursions not mentioned in itinerary",
      "Travel Insurance",
      "International Flights",
      "Camera / Video Entry Fees at certain sites"
    ],
    itinerary: [
      { day: 1, title: "Kandy Arrival", description: "Arrive in Kandy, visit the botanical gardens." },
      { day: 2, title: "Train to Nuwara Eliya", description: "Scenic train ride through tea country to Nuwara Eliya." },
      { day: 3, title: "Horton Plains", description: "Early morning trek to World's End viewpoint." },
      { day: 4, title: "Ella", description: "Continue to Ella, visit Nine Arch Bridge and tea factory." },
      { day: 5, title: "Ella Adventures", description: "Trek Little Adam's Peak, visit Ravana Falls." },
      { day: 6, title: "Departure", description: "Transfer to Colombo or airport." }
    ]
  },
  {
    id: "4",
    name: "Wildlife Safari Expedition",
    slug: "wildlife-safari-expedition",
    tagline: "Into the Wild",
    description: "Embark on an extraordinary wildlife adventure. Track leopards in Yala, observe elephants in Udawalawe, and discover exotic birdlife — Sri Lanka's wilderness will leave you speechless.",
    tourDescription: "Sri Lanka has one of the highest concentrations of leopards in the world, and this 5-day safari expedition gives you the best chance to witness them in the wild. Your journey begins at Udawalawe National Park, home to over 500 wild elephants that roam freely in vast open grasslands — making for spectacular sightings from the very first evening. From there, you venture to Yala National Park, Sri Lanka's most famous wildlife reserve, where early morning and dusk jeep drives through diverse ecosystems reveal leopards, sloth bears, crocodiles, and hundreds of bird species. Expert naturalist guides accompany every game drive, enriching every sighting with their deep knowledge of animal behaviour and ecology. Comfortable safari lodges keep you close to the action.",
    image: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?w=800&q=80",
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80"
    ],
    duration: "5 Days / 4 Nights",
    nights: 4,
    groupSize: "2-6 People",
    maxGuests: 6,
    price: 799,
    originalPrice: 1049,
    rating: 4.8,
    reviewCount: 256,
    category: "Wildlife",
    highlights: ["Yala Leopard Safari", "Udawalawe Elephants", "Bundala Bird Sanctuary", "Camping Experience", "Night Safari", "Wildlife Photography"],
    included: [
      "English Speaking Expert Naturalist Guide",
      "Airport Pick-up and Drop Off",
      "4x4 Jeep Safari Drives (all included)",
      "National Park Entrance Fees",
      "Air-conditioned Private Vehicle (transfers)",
      "Unlimited Wi-Fi (inside the vehicle)",
      "4 Nights Safari Lodge Accommodation",
      "All Meals (Breakfast, Lunch & Dinner)"
    ],
    excluded: [
      "Personal Expenses (Laundry, Telephone calls, Tips)",
      "Extra Excursions not mentioned in itinerary",
      "Alcoholic Beverages",
      "Travel Insurance",
      "International Flights",
      "Camera / Video Permits inside parks"
    ],
    itinerary: [
      { day: 1, title: "Arrival", description: "Transfer to Udawalawe, evening elephant sighting." },
      { day: 2, title: "Udawalawe Safari", description: "Full-day safari in Udawalawe National Park." },
      { day: 3, title: "Yala National Park", description: "Transfer to Yala, afternoon leopard safari." },
      { day: 4, title: "Yala Full Day", description: "Early morning and evening safari drives." },
      { day: 5, title: "Departure", description: "Morning bird watching, then transfer to airport." }
    ]
  },
  {
    id: "5",
    name: "Luxury Honeymoon Retreat",
    slug: "luxury-honeymoon-retreat",
    tagline: "Romance in Paradise",
    description: "Celebrate love in the most romantic settings Sri Lanka has to offer. Private villas, candlelit dinners on the beach, couples' spa treatments, and sunset cruises — pure tropical romance.",
    tourDescription: "Sri Lanka was made for romance. This ultra-luxurious 8-day honeymoon itinerary is crafted exclusively for couples who want the very best — and deserve nothing less. Wake up in a private ocean-view villa, where breakfast is served on your private terrace to the sound of waves. Your personal concierge arranges a candlelit dinner on the beach, a couple's massage at a world-class spa, and a golden-hour sunset cruise along the southern coast. Visit the romance of Galle Fort at dusk, journey through fragrant tea estates in the highlands, and end your trip with a private visit to a hidden waterfall deep in the jungle. Every detail — from rose-petal turndowns to private transfers in a premium vehicle — is arranged with love and care by our dedicated honeymoon team.",
    image: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80"
    ],
    duration: "8 Days / 7 Nights",
    nights: 7,
    groupSize: "2 People",
    maxGuests: 2,
    price: 1499,
    originalPrice: 1999,
    rating: 5.0,
    reviewCount: 178,
    category: "Luxury",
    highlights: ["Private Villa Stay", "Couples Spa", "Beach Candlelit Dinner", "Sunset Cruise", "Hot Air Balloon", "Private Waterfall Visit"],
    included: [
      "English Speaking Private Chauffeur Guide",
      "Airport Pick-up and Drop Off (VIP)",
      "Couples Spa Treatment (1 session)",
      "Romantic Candlelit Beach Dinner Setup",
      "Sunset Cruise",
      "Activities & Attractions Entrance Fees",
      "Air-conditioned Luxury Private Vehicle",
      "Unlimited Wi-Fi (inside the vehicle)",
      "7 Nights 5-Star / Boutique Villa Accommodation",
      "All Meals (Breakfast, Lunch & Dinner)"
    ],
    excluded: [
      "Personal Expenses (Laundry, Telephone calls, Tips)",
      "Extra Excursions not mentioned in itinerary",
      "Alcoholic Beverages & Champagne (on request, charged separately)",
      "Travel Insurance",
      "International Flights",
      "Hot Air Balloon Ride (available as paid add-on)"
    ],
    itinerary: [
      { day: 1, title: "Welcome to Paradise", description: "VIP airport pickup, transfer to luxury beach villa." },
      { day: 2, title: "Beach Bliss", description: "Private beach day, couples spa, sunset cocktails." },
      { day: 3, title: "Galle Romance", description: "Explore Galle Fort, boutique shopping, rooftop dinner." },
      { day: 4, title: "Hill Country", description: "Scenic drive to hill country, tea estate visit." },
      { day: 5, title: "Ella Adventure", description: "Nine Arch Bridge, waterfall visit, stargazing." },
      { day: 6, title: "Kandy Culture", description: "Temple visit, botanical gardens, cultural show." },
      { day: 7, title: "Coastal Finale", description: "Return to coast, sunset cruise, farewell dinner." },
      { day: 8, title: "Departure", description: "Leisurely breakfast and airport transfer." }
    ]
  },
  {
    id: "6",
    name: "Complete Sri Lanka Discovery",
    slug: "complete-sri-lanka-discovery",
    tagline: "The Ultimate Journey",
    description: "Experience everything Sri Lanka has to offer in one incredible journey. From ancient ruins to pristine beaches, misty mountains to wildlife safaris — this is the definitive Sri Lankan adventure.",
    tourDescription: "If you want to see everything Sri Lanka has to offer — and do it in style — this is the trip. Our flagship 14-day Complete Discovery itinerary is the most comprehensive Sri Lanka tour available, carefully designed to show you the island's iconic landmarks while leaving time to breathe it all in. You'll start in Colombo, travel north to the ancient cities of Anuradhapura, scale Sigiriya Rock, cycle through Polonnaruwa, worship at the Temple of the Tooth in Kandy, ride the legendary train through the hill country, hike in Ella, go on safari in Yala, swim in Mirissa, stroll the ramparts of Galle Fort, and splash into Bentota's lagoon. This two-week odyssey covers every major region of the island — cultural, coastal, highland, and wild — and is the ultimate Sri Lanka bucket-list adventure.",
    image: "https://images.unsplash.com/photo-1623595289196-007a22dd8560?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1623595289196-007a22dd8560?w=800&q=80",
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80",
      "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80"
    ],
    duration: "14 Days / 13 Nights",
    nights: 13,
    groupSize: "2-12 People",
    maxGuests: 12,
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 523,
    category: "Adventure",
    highlights: ["Sigiriya & Dambulla", "Ella Train", "Yala Safari", "Mirissa Beaches", "Galle Fort", "Kandy Temple", "Tea Country", "Colombo City Tour"],
    included: [
      "English Speaking Private Driver Guide",
      "Airport Pick-up and Drop Off",
      "Activities & Attractions Entrance Fees",
      "Air-conditioned Private Vehicle",
      "Unlimited Wi-Fi (inside the vehicle)",
      "Scenic Train Tickets (Kandy to Ella)",
      "4x4 Jeep Safari (Yala National Park)",
      "13 Nights Accommodation (Hand-picked hotels)",
      "Daily Breakfast & Dinner",
      "All Government Taxes & Service Charges"
    ],
    excluded: [
      "Personal Expenses (Laundry, Telephone calls, Tips)",
      "Lunch / Snacks (unless specified)",
      "Extra Excursions not mentioned in itinerary",
      "Travel Insurance",
      "International Flights",
      "Alcoholic Beverages",
      "Camera / Video Permits inside parks"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Colombo", description: "Welcome and city orientation tour." },
      { day: 2, title: "Negombo & North", description: "Fish market, lagoon, and heading north." },
      { day: 3, title: "Anuradhapura", description: "Ancient city exploration." },
      { day: 4, title: "Sigiriya", description: "Climb the Lion Rock, explore gardens." },
      { day: 5, title: "Polonnaruwa", description: "Cycle through ancient ruins." },
      { day: 6, title: "Kandy", description: "Temple of the Tooth, cultural show." },
      { day: 7, title: "Nuwara Eliya", description: "Tea country and colonial hill station." },
      { day: 8, title: "Ella Train", description: "Legendary scenic train journey." },
      { day: 9, title: "Ella Exploration", description: "Nine Arch Bridge, waterfalls, hiking." },
      { day: 10, title: "Yala Safari", description: "Full-day wildlife safari." },
      { day: 11, title: "Mirissa", description: "Beach day and whale watching." },
      { day: 12, title: "Galle", description: "Fort exploration and coastal charm." },
      { day: 13, title: "Bentota", description: "Water sports and relaxation." },
      { day: 14, title: "Departure", description: "Transfer to Colombo airport." }
    ]
  }
];
