import { toast } from "sonner";

/**
 * Clerk error format:
 * {
 *   errors: [
 *     {
 *       message: string,
 *       long_message: string,
 *       code: string,
 *       meta: { param_name: string }
 *     }
 *   ]
 * }
 */

interface ClerkError {
  message: string;
  long_message: string;
  code: string;
  meta?: {
    param_name?: string;
  };
}

interface ClerkAPIError {
  errors: ClerkError[];
}

/**
 * Check if an error is a Clerk API error
 */
export function isClerkAPIError(error: unknown): error is ClerkAPIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as ClerkAPIError).errors)
  );
}

/**
 * Get the first error message from a Clerk API error
 */
export function getClerkErrorMessage(error: unknown): string {
  if (isClerkAPIError(error)) {
    const firstError = error.errors[0];
    if (firstError) {
      return firstError.long_message || firstError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong, please try again.";
}

/**
 * Get all error messages from a Clerk API error
 */
export function getClerkErrorMessages(error: unknown): string[] {
  if (isClerkAPIError(error)) {
    return error.errors.map((err) => err.long_message || err.message);
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ["Something went wrong, please try again."];
}

/**
 * Show a toast for each Clerk error
 */
export function showClerkErrors(error: unknown) {
  const messages = getClerkErrorMessages(error);

  messages.forEach((message) => {
    toast.error(message);
  });
}

/**
 * Show a single toast for the first Clerk error
 */
export function showClerkError(error: unknown) {
  const message = getClerkErrorMessage(error);
  toast.error(message);
}

/**
 * Handle Clerk errors in catch blocks
 * Usage:
 * ```ts
 * try {
 *   await signUp.create({ ... });
 * } catch (error) {
 *   handleClerkError(error);
 * }
 * ```
 */
export function handleClerkError(
  error: unknown,
  options?: {
    showAll?: boolean; // Show all errors as separate toasts
    fallbackMessage?: string;
  },
) {
  const { showAll = false, fallbackMessage } = options || {};

  if (showAll) {
    showClerkErrors(error);
  } else {
    const message = fallbackMessage
      ? isClerkAPIError(error)
        ? getClerkErrorMessage(error)
        : fallbackMessage
      : getClerkErrorMessage(error);
    toast.error(message);
  }
}
