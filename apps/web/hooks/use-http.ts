"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

import { HttpService, type HttpServiceOptions } from "@/services/http.service";

type HttpServiceConstructor<T extends HttpService> = new (
  options?: HttpServiceOptions,
) => T;

/* Example usage:
 * Returns an instance of the specified HttpService subclass with authentication token handling.
 * @param ServiceClass - The HttpService subclass to instantiate.
 * @returns An instance of the specified HttpService subclass.
 * @example
 * const resumeService = useService(ResumeService);
 */
export function useService<T extends HttpService>(
  ServiceClass: HttpServiceConstructor<T>,
): T {
  const { getToken } = useAuth();

  const service = useMemo(() => {
    return new ServiceClass({
      getToken: () => getToken(),
    });
  }, [ServiceClass, getToken]);

  return service;
}

export function useHttp() {
  return useService(HttpService);
}
