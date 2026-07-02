import { storageProvider } from "../storage";
import { UserProfile } from "@/types/user";

export class UserRepository {
  private key = "studyquest_user_profile";

  async getUser(): Promise<UserProfile | null> {
    return storageProvider.getItem<UserProfile>(this.key);
  }

  async saveUser(user: UserProfile): Promise<void> {
    await storageProvider.setItem<UserProfile>(this.key, user);
  }
}

export const userRepository = new UserRepository();
