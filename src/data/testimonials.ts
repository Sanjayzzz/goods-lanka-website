export interface Testimonial {
  id: string;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  title: string;
  review: string;
  tourPackage: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1", name: "Sarah Mitchell", country: "United Kingdom", avatar: "SM", rating: 5,
    title: "Absolutely Magical Experience!",
    review: "Sri Lanka exceeded every expectation. The team organized everything perfectly — from the stunning Sigiriya climb to the unforgettable train ride through tea country.",
    tourPackage: "Cultural Triangle Explorer", date: "March 2025"
  },
  {
    id: "2", name: "Marcus & Julia Weber", country: "Germany", avatar: "MW", rating: 5,
    title: "Our Dream Honeymoon",
    review: "We couldn't have asked for a more romantic honeymoon. The private villa was stunning, the candlelit beach dinner was out of a movie, and the spa treatments were heavenly.",
    tourPackage: "Luxury Honeymoon Retreat", date: "February 2025"
  },
  {
    id: "3", name: "Takeshi Yamamoto", country: "Japan", avatar: "TY", rating: 5,
    title: "Wildlife Photography Heaven",
    review: "As a wildlife photographer, Yala National Park was a dream come true. We spotted three leopards! The guide's knowledge was exceptional.",
    tourPackage: "Wildlife Safari Expedition", date: "January 2025"
  },
  {
    id: "4", name: "Emily & James Carter", country: "Australia", avatar: "EC", rating: 5,
    title: "Best Family Holiday Ever",
    review: "Traveling with two kids can be challenging, but Good's Lanka made it effortless. The kids loved the elephant safari, and we all fell in love with Ella.",
    tourPackage: "Complete Sri Lanka Discovery", date: "December 2024"
  },
  {
    id: "5", name: "Pierre Dubois", country: "France", avatar: "PD", rating: 4,
    title: "Surfing Paradise Found",
    review: "Arugam Bay's waves are incredible! The laid-back atmosphere, friendly locals, and amazing seafood made this trip special.",
    tourPackage: "Tropical Beach Escape", date: "November 2024"
  },
  {
    id: "6", name: "Anna Petrova", country: "Russia", avatar: "AP", rating: 5,
    title: "A Journey Through Time",
    review: "The ancient cities of Anuradhapura and Polonnaruwa left me speechless. Thousands of years of civilization beautifully preserved.",
    tourPackage: "Cultural Triangle Explorer", date: "October 2024"
  },
  {
    id: "7", name: "David & Lisa Chen", country: "Canada", avatar: "DC", rating: 5,
    title: "Exceeded All Expectations",
    review: "From start to finish, everything was flawless. The accommodations were luxurious, the food was incredible, and every destination was more beautiful than the last.",
    tourPackage: "Complete Sri Lanka Discovery", date: "September 2024"
  },
  {
    id: "8", name: "Sofia Rodriguez", country: "Spain", avatar: "SR", rating: 5,
    title: "The Train Ride Changed My Life",
    review: "The Ella train journey is something every traveler must experience. Watching the misty mountains and tea plantations roll by was the most magical moment of my life.",
    tourPackage: "Hill Country Adventure", date: "August 2024"
  }
];
