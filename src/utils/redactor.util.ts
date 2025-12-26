/**
 * Utility functions for redacting secrets with different styles
 */

import { RedactionStyle, SecretType } from '../types';

/**
 * Redact a secret value based on the specified style
 * 
 * @param value - Original secret value
 * @param style - Redaction style to use
 * @param type - Type of secret (for labeled style)
 * @returns Redacted string
 */
export function redactSecret(
    value: string,
    style: RedactionStyle,
    type?: SecretType
): string {
    switch (style) {
        case RedactionStyle.PARTIAL:
            return redactPartial(value);
        case RedactionStyle.FULL:
            return '[REDACTED]';
        case RedactionStyle.PLACEHOLDER:
            return redactPlaceholder(type);
        case RedactionStyle.LABELED:
            return redactLabeled(type);
        default:
            return redactPartial(value);
    }
}

/**
 * Partial redaction - shows beginning and end
 * Example: sk-1234567890abcdef -> sk-****...****
 */
function redactPartial(value: string): string {
    if (value.length <= 8) {
        return '*'.repeat(value.length);
    }

    const prefixLength = Math.min(4, Math.floor(value.length * 0.2));
    const suffixLength = Math.min(4, Math.floor(value.length * 0.2));

    const prefix = value.substring(0, prefixLength);
    const suffix = value.substring(value.length - suffixLength);

    return `${prefix}${'*'.repeat(4)}...${'*'.repeat(4)}`;
}

/**
 * Placeholder redaction - helpful hint
 * Example: <YOUR_OPENAI_API_KEY>
 */
function redactPlaceholder(type?: SecretType): string {
    if (!type) {
        return '<YOUR_SECRET_HERE>';
    }

    const typeMap: Record<SecretType, string> = {
        [SecretType.OPENAI_API_KEY]: '<YOUR_OPENAI_API_KEY>',
        [SecretType.GITHUB_TOKEN]: '<YOUR_GITHUB_TOKEN>',
        [SecretType.STRIPE_KEY]: '<YOUR_STRIPE_KEY>',
        [SecretType.AWS_ACCESS_KEY]: '<YOUR_AWS_ACCESS_KEY>',
        [SecretType.AWS_SECRET_KEY]: '<YOUR_AWS_SECRET_KEY>',
        [SecretType.JWT_TOKEN]: '<YOUR_JWT_TOKEN>',
        [SecretType.PRIVATE_KEY]: '<YOUR_PRIVATE_KEY>',
        [SecretType.DATABASE_URL]: '<YOUR_DATABASE_URL>',
        [SecretType.GENERIC_API_KEY]: '<YOUR_API_KEY>',
        [SecretType.GENERIC_SECRET]: '<YOUR_SECRET>',
    };

    return typeMap[type] || '<YOUR_SECRET_HERE>';
}

/**
 * Labeled redaction - shows type
 * Example: [OPENAI_API_KEY]
 */
function redactLabeled(type?: SecretType): string {
    if (!type) {
        return '[SECRET]';
    }

    const typeMap: Record<SecretType, string> = {
        [SecretType.OPENAI_API_KEY]: '[OPENAI_API_KEY]',
        [SecretType.GITHUB_TOKEN]: '[GITHUB_TOKEN]',
        [SecretType.STRIPE_KEY]: '[STRIPE_KEY]',
        [SecretType.AWS_ACCESS_KEY]: '[AWS_ACCESS_KEY]',
        [SecretType.AWS_SECRET_KEY]: '[AWS_SECRET_KEY]',
        [SecretType.JWT_TOKEN]: '[JWT_TOKEN]',
        [SecretType.PRIVATE_KEY]: '[PRIVATE_KEY]',
        [SecretType.DATABASE_URL]: '[DATABASE_URL]',
        [SecretType.GENERIC_API_KEY]: '[API_KEY]',
        [SecretType.GENERIC_SECRET]: '[SECRET]',
    };

    return typeMap[type] || '[SECRET]';
}
