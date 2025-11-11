import { HttpService } from "@/services/http.service";
import { type Resume } from "@/types/resume.type";

export class ResumeService extends HttpService {
  async getResume() {
    const { data } = await this.get<Resume>("/user/resume");
    return data;
  }

  async updateResume(
    id: string,
    payload: Omit<Resume, "_id" | "userId">,
  ): Promise<Resume> {
    const { data } = await this.post<typeof payload, Resume>(
      `/user/resume/${id}`,
      payload,
    );

    return data;
  }
}

export const resumeService = new ResumeService();
