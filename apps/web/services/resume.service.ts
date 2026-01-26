import { HttpService, type HttpServiceOptions } from "@/services/http.service";

export class ResumeService extends HttpService {
  constructor(options?: HttpServiceOptions) {
    super(options);
  }
}
