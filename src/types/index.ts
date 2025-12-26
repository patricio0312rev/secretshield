/**
 * Core type definitions for SecretShield extension
 */

/**
 * Redaction style options for masking secrets
 */
export enum RedactionStyle {
    /** Partial masking: sk-****...****  */
    PARTIAL = 'partial',
    /** Full replacement: [REDACTED] */
    FULL = 'full',
    /** Placeholder hint: <YOUR_API_KEY_HERE> */
    PLACEHOLDER = 'placeholder',
    /** Type-labeled: [OPENAI_API_KEY] */
    LABELED = 'labeled',
}

/**
 * Sensitivity levels for secret detection
 */
export enum SensitivityLevel {
    /** Aggressive detection - catches potential secrets */
    STRICT = 'strict',
    /** Balanced approach - common secrets only */
    BALANCED = 'balanced',
    /** Conservative - only obvious secrets */
    LENIENT = 'lenient',
}

/**
 * Types of secrets that can be detected
 */
export enum SecretType {
    OPENAI_API_KEY = 'openai_api_key',
    GITHUB_TOKEN = 'github_token',
    STRIPE_KEY = 'stripe_key',
    AWS_ACCESS_KEY = 'aws_access_key',
    AWS_SECRET_KEY = 'aws_secret_key',
    JWT_TOKEN = 'jwt_token',
    PRIVATE_KEY = 'private_key',
    DATABASE_URL = 'database_url',
    GENERIC_API_KEY = 'generic_api_key',
    GENERIC_SECRET = 'generic_secret',
}

/**
 * A detected secret in the text
 */
export interface DetectedSecret {
    /** Type of secret detected */
    type: SecretType;
    /** The actual secret value */
    value: string;
    /** Start position in the original text */
    start: number;
    /** End position in the original text */
    end: number;
    /** Confidence level (0-1) */
    confidence: number;
    /** Optional context (variable name, surrounding text) */
    context?: string;
}

/**
 * Result of redacting a single secret
 */
export interface RedactionResult {
    /** Original secret value */
    original: string;
    /** Redacted replacement */
    redacted: string;
    /** Type of secret */
    type: SecretType;
    /** Position in text */
    position: {
        start: number;
        end: number;
    };
}

/**
 * Complete scrubbing result with all redactions
 */
export interface ScrubResult {
    /** Original text */
    originalText: string;
    /** Scrubbed text with secrets redacted */
    scrubbedText: string;
    /** All secrets that were found and redacted */
    redactions: RedactionResult[];
    /** Whether any secrets were found */
    hasSecrets: boolean;
}

/**
 * Configuration for SecretShield extension
 */
export interface SecretShieldConfig {
    /** Redaction style to use */
    redactionStyle: RedactionStyle;
    /** Detection sensitivity level */
    sensitivity: SensitivityLevel;
    /** Show diff preview before copying */
    showDiff: boolean;
    /** Patterns to allow (won't be redacted) */
    allowList: string[];
    /** Patterns to deny (will be redacted) */
    denyList: string[];
    /** Intercept all copy operations */
    interceptAllCopy: boolean;
}
