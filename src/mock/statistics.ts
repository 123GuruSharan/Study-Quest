import { StudySessionLog } from "@/types/statistics";

export const mockHistoryLogs: StudySessionLog[] = [
  {
    id: "log_1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().split("T")[0],
    minutesFocused: 126, // 2.1 hrs
    xpEarned: 320,
    missionsCompleted: 1,
    phoneUsageMinutes: 80,
  },
  {
    id: "log_2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
    minutesFocused: 192, // 3.2 hrs
    xpEarned: 480,
    missionsCompleted: 2,
    phoneUsageMinutes: 110,
  },
  {
    id: "log_3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString().split("T")[0],
    minutesFocused: 240, // 4.0 hrs
    xpEarned: 620,
    missionsCompleted: 2,
    phoneUsageMinutes: 65,
  },
  {
    id: "log_4",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().split("T")[0],
    minutesFocused: 108, // 1.8 hrs
    xpEarned: 290,
    missionsCompleted: 1,
    phoneUsageMinutes: 45,
  },
  {
    id: "log_5",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0],
    minutesFocused: 288, // 4.8 hrs
    xpEarned: 750,
    missionsCompleted: 3,
    phoneUsageMinutes: 75,
  },
  {
    id: "log_6",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString().split("T")[0],
    minutesFocused: 330, // 5.5 hrs
    xpEarned: 880,
    missionsCompleted: 2,
    phoneUsageMinutes: 85,
  },
  {
    id: "log_7",
    date: new Date().toISOString().split("T")[0],
    minutesFocused: 270, // 4.5 hrs
    xpEarned: 980,
    missionsCompleted: 1,
    phoneUsageMinutes: 75,
  },
];
