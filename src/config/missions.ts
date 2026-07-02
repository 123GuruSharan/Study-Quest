export const missionsConfig = {
  subjects: [
    "Algorithms",
    "Languages",
    "Deep Work",
    "Reading",
    "Math",
    "Systems Programming",
    "Database Systems",
  ],
  energyCosts: {
    Easy: 15,
    Medium: 30,
    Hard: 50,
  },
  priorities: ["Low", "Medium", "High", "Critical"],
  validationLimits: {
    maxEasyMissionsPerDay: 1,
    titleMinLength: 3,
    titleMaxLength: 80,
  },
};
