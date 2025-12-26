/**
 * Utility functions for pattern matching (allowlist/denylist)
 */

/**
 * Check if a value matches any pattern in a list
 * Supports wildcards (*) and simple glob patterns
 * 
 * @param value - Value to check
 * @param patterns - List of patterns to match against
 * @returns True if value matches any pattern
 */
export function matchesPattern(value: string, patterns: string[]): boolean {
    if (patterns.length === 0) {
        return false;
    }

    return patterns.some(pattern => {
        // Convert glob pattern to regex
        const regexPattern = pattern
            .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
            .replace(/\*/g, '.*'); // Convert * to .*

        const regex = new RegExp(`^${regexPattern}$`, 'i');
        return regex.test(value);
    });
}

/**
 * Check if a value should be allowed (not redacted)
 * 
 * @param value - Value to check
 * @param allowList - List of allowed patterns
 * @returns True if value is in allowlist
 */
export function isAllowed(value: string, allowList: string[]): boolean {
    return matchesPattern(value, allowList);
}

/**
 * Check if a value should be denied (forced redaction)
 * 
 * @param value - Value to check
 * @param denyList - List of denied patterns
 * @returns True if value is in denylist
 */
export function isDenied(value: string, denyList: string[]): boolean {
    return matchesPattern(value, denyList);
}

/**
 * Check if a value should be redacted based on allow/deny lists
 * Priority: denylist > allowlist
 * 
 * @param value - Value to check
 * @param allowList - Patterns that should NOT be redacted
 * @param denyList - Patterns that MUST be redacted
 * @returns True if value should be redacted
 */
export function shouldRedact(
    value: string,
    allowList: string[],
    denyList: string[]
): boolean {
    // Denylist takes priority
    if (isDenied(value, denyList)) {
        return true;
    }

    // If in allowlist, don't redact
    if (isAllowed(value, allowList)) {
        return false;
    }

    // Default: redact if not explicitly allowed
    return true;
}
