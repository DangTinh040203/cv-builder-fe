import { HttpService } from "@/services/http.service";
import { type Resume } from "@/types/resume.type";

export class ResumeService extends HttpService {
  async getResume() {
    const { data } = await this.get<Resume>("/user/resume");
    return data;
  }
}

export const resumeService = new ResumeService();
