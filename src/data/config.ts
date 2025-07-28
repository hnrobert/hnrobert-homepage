import configData from "../configs/config.json";

export interface ConfigData {
  techStack: string[];
  featuredProjects: any[];
  hobbies: string[];
  fileSourceLink: string;
}

class ConfigService {
  private config: ConfigData;

  constructor() {
    this.config = configData as ConfigData;
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

  getFileSourceLink(): string {
    return this.config.fileSourceLink;
  }

}

export const configService = new ConfigService();
export default configService;
