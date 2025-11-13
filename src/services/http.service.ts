import axios, {
  type AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";

import { axiosConfig } from "@/configs/axios.config";

let refreshPromise: Promise<void> | null = null;

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export class HttpService {
  private instance: AxiosInstance;

  constructor(config = axiosConfig) {
    const instance = axios.create({ ...config });
    Object.assign(instance, this.setupInterceptorsTo(instance));
    this.instance = instance;
    this.setHttpConfigs(config);
  }

  public delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config);
  }

  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  public patch<T, R>(url: string, data: T, config?: AxiosRequestConfig) {
    return this.instance.patch<R>(url, data, config);
  }

  public post<T, R>(url: string, data?: T, config?: AxiosRequestConfig) {
    return this.instance.post<R>(url, data, config);
  }

  public put<T, R>(url: string, data?: T, config?: AxiosRequestConfig) {
    return this.instance.put<R>(url, data, config);
  }

  public head<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.head<T>(url, config);
  }

  private setHttpConfigs(config?: Partial<AxiosRequestConfig>) {
    if (config?.baseURL) {
      this.instance.defaults.baseURL = config.baseURL;
    }
  }

  /** REQUEST INTERCEPTOR */
  private onRequest = async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const session = await this.ensureSessionIsFresh();

    if (!session) redirect("/sign-in");

    const token = session?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };

  private onRequestError = (error: AxiosError) => Promise.reject(error);

  private onResponse = (response: AxiosResponse) => response;

  /** RETRY LOGIC WITHOUT ANY */
  private onResponseError = async (error: AxiosError) => {
    const config = error.config as RetryAxiosRequestConfig;

    if (!config) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;

      const session = await this.ensureSessionIsFresh();
      const newToken = session?.accessToken;

      if (newToken) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers["Authorization"] = `Bearer ${newToken}`;
        return this.instance(config);
      }
    }

    return Promise.reject(error);
  };

  private setupInterceptorsTo(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(this.onRequest, this.onRequestError);
    axiosInstance.interceptors.response.use(
      this.onResponse,
      this.onResponseError,
    );
    return axiosInstance;
  }

  /** 🔥 Ensure session fresh with refresh lock */
  private async ensureSessionIsFresh() {
    const session = await getSession();

    if (!session) return null;

    const now = Math.floor(Date.now() / 1000);

    if (session.expiresAt && now < session.expiresAt) {
      return session;
    }

    // Already refreshing? wait
    if (refreshPromise) {
      await refreshPromise;
      return await getSession();
    }

    // Trigger refresh
    refreshPromise = fetch("/api/auth/session?update", {
      method: "GET",
      cache: "no-store",
    })
      .then(() => {})
      .finally(() => {
        refreshPromise = null;
      });

    await refreshPromise;

    return await getSession();
  }
}
