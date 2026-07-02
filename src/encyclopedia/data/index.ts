import { chapter01 } from "./chapter-01";
import { chapter02 } from "./chapter-02";
import { chapter03 } from "./chapter-03";
import { chapter04 } from "./chapter-04";
import { chapter05 } from "./chapter-05";
import { chapter06 } from "./chapter-06";
import { chapter07 } from "./chapter-07";
import { chapter08 } from "./chapter-08";
import { chapter09 } from "./chapter-09";
import { chapter10 } from "./chapter-10";
import { chapter11 } from "./chapter-11";
import { chapter12 } from "./chapter-12";
import { chapter13 } from "./chapter-13";
import { chapter14 } from "./chapter-14";
import { chapter15 } from "./chapter-15";
import { chapter16 } from "./chapter-16";
import { chapter17 } from "./chapter-17";
import { chapter18 } from "./chapter-18";
import { chapter19 } from "./chapter-19";
import { chapter20 } from "./chapter-20";

import { EncyclopediaChapter } from "./types";

export const chapters: EncyclopediaChapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
  chapter11,
  chapter12,
  chapter13,
  chapter14,
  chapter15,
  chapter16,
  chapter17,
  chapter18,
  chapter19,
  chapter20
];

export * from "./types";
export { glossaryData } from "./glossary";
export { faqData } from "./faq";
export { loreData } from "./lore";
export { versionsData } from "./versions";
