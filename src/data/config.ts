import configData from "../configs/config.json";

export interface ConfigData {
  techStack: Record<string, number>;
  featuredProjects: string[];
  hobbies: string[];
}

class ConfigService {
  private config: ConfigData;

  constructor() {
    this.config = configData as ConfigData;
  }

  getTechStack(): string[] {
    return Object.keys(this.config.techStack);
  }

  getTechStackWithLevels(): Record<string, number> {
    return this.config.techStack;
  }

  getFeaturedProjects(): string[] {
    return this.config.featuredProjects;
  }

  getHobbies(): string[] {
    return this.config.hobbies;
  }

}

export const configService = new ConfigService();
export default configService;
