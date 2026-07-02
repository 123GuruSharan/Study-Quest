import { FaqItem } from "./types";

export const faqData: FaqItem[] = [
  {
    id: "faq_no_xp",
    question: "Why didn't I receive XP after completing a study timer session?",
    answer: "Make sure you completed the work interval (25 mins) successfully. Canceling the timer early or keeping it paused for too long will not award focus XP payouts.",
    category: "XP & Levels"
  },
  {
    id: "faq_no_chest",
    question: "Why can't I claim the Surprise Chest?",
    answer: "The daily Surprise Chest has a strict calendar cooldown. You can only claim it once per day. It resets at local midnight (00:00). Check the countdown timer to see when the next claim becomes available.",
    category: "Rewards"
  },
  {
    id: "faq_combo_reset",
    question: "Why was my Combo Multiplier reset to 1.0x?",
    answer: "Your combo multiplier is fragile. Logging any amount of phone overuse (exceeding screen limit) or missing your Daily Targets at local midnight immediately resets the combo to 1.0x.",
    category: "Boosts"
  },
  {
    id: "faq_streak_freeze",
    question: "Why didn't my streak count increase today?",
    answer: "Streaks only increment once you complete your daily study targets. Simply logging in without completing missions will not increment your streak. If a calendar day passes with zero study completions, the streak resets to 0.",
    category: "Boosts"
  },
  {
    id: "faq_edit_complete",
    question: "Can I edit or delete completed missions?",
    answer: "No, completed missions are locked in your history logs to protect game integrity and prevent double-claiming rewards. You can only edit or delete Draft or Locked missions.",
    category: "Missions"
  },
  {
    id: "faq_reclaim_shop",
    question: "Can I refund or reclaim coins spent in the Shop?",
    answer: "No, reward purchases are final. Once you click 'Redeem' on a custom reward, the coins are permanently deducted. If you accidentally purchased an item, you will need to complete more missions to earn back the coins.",
    category: "Reward Shop"
  }
];
