/**
 * Retry with Exponential Backoff Utility
 * Automatically retries failed async operations with increasing delays
 */

export interface RetryOptions {
    maxRetries?: number; // Maximum number of retry attempts (default: 3)
    initialDelay?: number; // Initial delay in milliseconds (default: 1000)
    maxDelay?: number; // Maximum delay in milliseconds (default: 10000)
    backoffMultiplier?: number; // Delay multiplier for each retry (default: 2)
    onRetry?: (attempt: number, error: Error, delay: number) => void; // Callback on each retry
    shouldRetry?: (error: Error) => boolean; // Determine if error is retryable
}

/**
 * Default retry predicate - determines if an error should trigger a retry
 */
const defaultShouldRetry = (error: Error): boolean => {
    const errorMessage = error.message.toLowerCase();

    // Network errors - should retry
    if (
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('failed to fetch')
    ) {
        return true;
    }

    // Rate limiting - should retry
    if (
        errorMessage.includes('rate limit') ||
        errorMessage.includes('too many requests') ||
        errorMessage.includes('429')
    ) {
        return true;
    }

    // Server errors (5xx) - should retry
    if (
        errorMessage.includes('500') ||
        errorMessage.includes('502') ||
        errorMessage.includes('503') ||
        errorMessage.includes('504') ||
        errorMessage.includes('internal server error') ||
        errorMessage.includes('service unavailable')
    ) {
        return true;
    }

    // Temporary failures - should retry
    if (
        errorMessage.includes('temporarily unavailable') ||
        errorMessage.includes('try again')
    ) {
        return true;
    }

    // Client errors (4xx) except rate limiting - should NOT retry
    if (
        errorMessage.includes('400') ||
        errorMessage.includes('401') ||
        errorMessage.includes('403') ||
        errorMessage.includes('404') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('forbidden') ||
        errorMessage.includes('not found')
    ) {
        return false;
    }

    // Default: don't retry unknown errors
    return false;
};

/**
 * Calculate delay for exponential backoff with jitter
 */
const calculateDelay = (
    attempt: number,
    initialDelay: number,
    maxDelay: number,
    backoffMultiplier: number
): number => {
    // Exponential backoff: initialDelay * (multiplier ^ attempt)
    const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt);

    // Apply max delay cap
    const cappedDelay = Math.min(exponentialDelay, maxDelay);

    // Add jitter (random factor between 0.5 and 1.5)
    const jitter = 0.5 + Math.random();

    return Math.floor(cappedDelay * jitter);
};

/**
 * Sleep utility
 */
const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        backoffMultiplier = 2,
        onRetry,
        shouldRetry = defaultShouldRetry
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Attempt the operation
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // If this was the last attempt, throw the error
            if (attempt === maxRetries) {
                throw lastError;
            }

            // Check if error is retryable
            if (!shouldRetry(lastError)) {
                throw lastError;
            }

            // Calculate delay before next retry
            const delay = calculateDelay(attempt, initialDelay, maxDelay, backoffMultiplier);

            // Call retry callback if provided
            if (onRetry) {
                onRetry(attempt + 1, lastError, delay);
            }

            // Log retry attempt
            console.log(
                `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay. Error: ${lastError.message}`
            );

            // Wait before retrying
            await sleep(delay);
        }
    }

    // This should never be reached, but TypeScript requires it
    throw lastError!;
}

/**
 * Preset configurations for common retry scenarios
 */
export const RETRY_PRESETS = {
    // Fast retries for quick operations
    FAST: {
        maxRetries: 2,
        initialDelay: 500,
        maxDelay: 2000,
        backoffMultiplier: 1.5
    },

    // Standard retries for most API calls
    STANDARD: {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2
    },

    // Aggressive retries for critical operations
    AGGRESSIVE: {
        maxRetries: 5,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffMultiplier: 2.5
    },

    // Gentle retries for rate-limited APIs
    GENTLE: {
        maxRetries: 3,
        initialDelay: 2000,
        maxDelay: 15000,
        backoffMultiplier: 2
    }
};
