import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const Env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_REQUEST_TIMEOUT: z.coerce.number().default(10000),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_REQUEST_TIMEOUT: process.env.NEXT_PUBLIC_REQUEST_TIMEOUT,
  },
  server: {
    AUTH_SECRET: z.string(),
  },
});
