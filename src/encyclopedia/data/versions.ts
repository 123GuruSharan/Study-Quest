import { VersionLog } from "./types";

export const versionsData: VersionLog[] = [
  {
    version: "v1.1",
    date: "July 2026",
    title: "The Encyclopedia Update",
    changes: [
      "Added interactive Game Encyclopedia system with detailed rules chapters.",
      "Added interactive Formula Playgrounds and Boss Combat Simulators.",
      "Added Kindle-style Focus Reading Mode for distraction-free reading.",
      "Added Bookmark System for saving favorite chapters in local storage.",
      "Added search autocomplete suggestions and top search keywords panels.",
      "Added print stylesheets formatting pages cleanly for PDF exports."
    ]
  },
  {
    version: "v1.0",
    date: "June 2026",
    title: "Production Launch",
    changes: [
      "Added persistent Supabase user statistics mapping and user profile sync.",
      "Added dynamic weekly bosses with HP scaling and damage formulas.",
      "Added daily surprise chest claiming engine with midnight cooldowns.",
      "Added custom reward shop catalog item redemptions.",
      "Wiped all mockup pre-seeded stats to begin all new users at Level 1 / 0 XP."
    ]
  }
];
