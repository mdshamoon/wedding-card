// Central place to edit all wedding details.
export const wedding = {
  groom: "Mohd Shamoon",
  bride: "Alina Fatima",

  // Bismillah shown at the top of the invitation
  bismillah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",

  hostLine: "Together with their beloved families",

  // The primary date the countdown targets (the Nikah / wedding day).
  // Format: YYYY-MM-DDTHH:mm:ss (local time)
  countdownTarget: "2027-03-24T11:00:00",

  events: [
    {
      title: "The Nikah",
      day: "Wednesday",
      date: "24 March 2027",
      time: "11:00 AM onwards",
      venue: "Blessing Garden",
      address: "Baheri, Uttar Pradesh",
    },
    {
      title: "The Reception (Walima)",
      day: "Thursday",
      date: "25 March 2027",
      time: "7:00 PM onwards",
      venue: "Grand Heritage",
      address: "Kiccha, Uttarakhand",
    },
  ],

  quote: {
    text: "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.",
    source: "— Surah Ar-Rum (30:21)",
  },

  closing: "Your presence is the blessing we seek",
} as const;
