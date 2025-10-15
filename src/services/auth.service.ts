import axios from "axios";

import { axiosConfig } from "@/configs/axios.config";
import { HttpService } from "@/services/http.service";

interface SignInPayload {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthServiceClient extends HttpService {
  async signIn(payload: SignInPayload) {
    const { data } = await this.post<SignInPayload, Tokens>(
      "sign-in/credentials",
      payload,
    );
    return data;
  }
}

export class AuthServiceServer {
  async signIn(payload: SignInPayload) {
    const response = await axios.post<Tokens>(
      "sign-in/credentials",
      payload,
      axiosConfig,
    );
    return response.data;
  }
}
