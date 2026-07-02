import { missionsConfig } from "@/config/missions";
import { Mission } from "@/types/mission";
import { ruleSystem } from "./ruleSystem";

export class ValidationSystem {
  validateMissionForm(data: {
    title: string;
    subject: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Epic";
    deadline: string;
    missionsList: Mission[];
  }): { isValid: boolean; errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};

    // Title validation
    if (!data.title || data.title.trim().length < missionsConfig.validationLimits.titleMinLength) {
      errors.title = `Title must be at least ${missionsConfig.validationLimits.titleMinLength} characters.`;
    } else if (data.title.trim().length > missionsConfig.validationLimits.titleMaxLength) {
      errors.title = `Title must be less than ${missionsConfig.validationLimits.titleMaxLength} characters.`;
    }

    // Duplicate check
    const isDuplicate = data.missionsList.some(
      (m) =>
        m.title.trim().toLowerCase() === data.title.trim().toLowerCase() &&
        m.status !== "Completed" &&
        m.status !== "Cancelled"
    );
    if (isDuplicate) {
      errors.title = "A mission with this title already exists and is active.";
    }

    // Subject validation
    if (!data.subject || !missionsConfig.subjects.includes(data.subject)) {
      errors.subject = "Please select a valid subject category.";
    }

    // Deadline validation
    if (!data.deadline) {
      errors.deadline = "Deadline is required.";
    } else {
      const deadlineDate = new Date(data.deadline);
      if (isNaN(deadlineDate.getTime())) {
        errors.deadline = "Invalid date format.";
      } else if (deadlineDate.getTime() < Date.now()) {
        errors.deadline = "Deadline cannot be in the past.";
      }
    }

    // Easy Limit validation
    if (data.difficulty === "Easy" && !ruleSystem.canCreateEasyMission(data.missionsList)) {
      errors.difficulty = "You cannot create another Easy mission today. (Limit: 1 per day).";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const validationSystem = new ValidationSystem();
