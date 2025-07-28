import configData from "../configs/config.json";

export interface ProfileInfo {
  name: string;
  title: string;
  bio: string;
}

export interface ContactInfo {
  github: string;
  email: string;
}

export interface ConfigData {
  profile: ProfileInfo;
  techStack: string[];
  featuredProjects: any[];
  hobbies: string[];
  contact: ContactInfo;
}

class ConfigService {
  private config: ConfigData;

  constructor() {
    this.config = configData as ConfigData;
  }

  getProfile(): ProfileInfo {
    return this.config.profile;
  }

  getTechStack(): string[] {
    return this.config.techStack;
  }

  getFeaturedProjects(): any[] {
    return this.config.featuredProjects;
  }

  getHobbies(): string[] {
    return this.config.hobbies;
  }

  getContact(): ContactInfo {
    return this.config.contact;
  }

  getFullConfig(): ConfigData {
    return this.config;
  }
}

export const configService = new ConfigService();
export default configService;
