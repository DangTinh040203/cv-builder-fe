/**
 * HttpService: minimal Axios wrapper with shared config + interceptors.
 * Exposes typed helpers: get, post, put, patch, delete, head.
 */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";

import { axiosConfig } from "@/configs/axios.config";

/** Centralized Axios instance with shared config and interceptors. */
export class HttpService {
  private instance: AxiosInstance;

  /** Create service; uses project axiosConfig by default. */
  constructor(config = axiosConfig) {
    const axiosConfigs = config;
    const instance = axios.create({ ...axiosConfigs });
    Object.assign(instance, this.setupInterceptorsTo(instance));
    this.instance = instance;
    this.setHttpConfigs(config);
  }

  /** DELETE request. */
  public async delete(url: string, config?: AxiosRequestConfig) {
    return await this.instance.delete(url, config);
  }

  /** GET request. Returns AxiosResponse<T>. */
  public async get<T>(url: string, config?: AxiosRequestConfig) {
    return await this.instance.get<T>(url, config);
  }

  /** PATCH request. */
  public async patch<T, R>(url: string, data: T, config?: AxiosRequestConfig) {
    return await this.instance.patch<R>(url, data, config);
  }

  /** POST request. */
  public async post<T, R>(url: string, data?: T, config?: AxiosRequestConfig) {
    return await this.instance.post<R>(url, data, config);
  }

  /** PUT request. */
  public async put<T, R>(url: string, data?: T, config?: AxiosRequestConfig) {
    return await this.instance.put<R>(url, data, config);
  }

  /** HEAD request (no body). */
  public async head<T>(url: string, config?: AxiosRequestConfig) {
    return await this.instance.head<T>(url, config);
  }

  /** Apply baseURL and merge defaults. */
  private setHttpConfigs(config?: Partial<AxiosRequestConfig>) {
    if (config?.baseURL) {
      this.instance.defaults.baseURL = config.baseURL;
    }

    this.instance.defaults = {
      ...this.instance.defaults,
    };
  }

  /** Request interceptor. Add headers/logging as needed. */
  private onRequest = async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const session = await getSession();
    if (!session) {
      redirect("/sign-in");
    }

    const token = session.user.accessToken;
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  };

  /** Request error handler. */
  private onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };

  /** Response interceptor. */
  private onResponse = (response: AxiosResponse) => {
    return response;
  };

  /** Response error handler. Map/normalize errors here. */
  private onResponseError = async (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };

  /** Register request/response interceptors. */
  private setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(this.onRequest, this.onRequestError);
    axiosInstance.interceptors.response.use(
      this.onResponse,
      this.onResponseError,
    );
    return axiosInstance;
  }
}
