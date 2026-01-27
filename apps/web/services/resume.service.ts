import { HttpService, type HttpServiceOptions } from "@/services/http.service";
import { type Resume } from "@/types/resume.type";

export class ResumeService extends HttpService {
  constructor(options?: HttpServiceOptions) {
    super(options);
  }

  async getResume(): Promise<Resume> {
    const { data } = await this.get<Resume>("/resumes");
    return data;
  }
}
