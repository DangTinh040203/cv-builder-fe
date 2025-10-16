import { HttpService } from "@/services/http.service";

interface SignInPayload {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService extends HttpService {
  async signIn(payload: SignInPayload) {
    const { data } = await this.post<SignInPayload, Tokens>(
      "auth/sign-in/credentials",
      payload,
    );
    return data;
  }

  async signUp(payload: SignInPayload) {
    await this.post<SignInPayload, unknown>(
      "auth/sign-up/credentials",
      payload,
    );
  }

  async verifyEmail(otp: string, email: string) {
    await this.post<{ otp: string; email: string }, unknown>(
      "auth/verify-email",
      { otp, email },
    );
  }
}

export const authService = new AuthService();
