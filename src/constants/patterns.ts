/**
 * Regular expression patterns for detecting various types of secrets
 */

import { SecretType } from '../types';

/**
 * Pattern definition for a secret detector
 */
export interface SecretPattern {
    type: SecretType;
    pattern: RegExp;
    description: string;
    confidence: number; // 0-1, how confident we are this is a real secret
}

/**
 * Patterns for detecting various types of secrets
 * Ordered by specificity (most specific first)
 */
export const SECRET_PATTERNS: SecretPattern[] = [
    // OpenAI API Keys
    {
        type: SecretType.OPENAI_API_KEY,
        pattern: /sk-[a-zA-Z0-9]{48}/g,
        description: 'OpenAI API Key',
        confidence: 0.95,
    },
    {
        type: SecretType.OPENAI_API_KEY,
        pattern: /sk-proj-[a-zA-Z0-9\-_]{48,}/g,
        description: 'OpenAI Project API Key',
        confidence: 0.95,
    },

    // GitHub Tokens
    {
        type: SecretType.GITHUB_TOKEN,
        pattern: /ghp_[a-zA-Z0-9]{36}/g,
        description: 'GitHub Personal Access Token',
        confidence: 0.95,
    },
    {
        type: SecretType.GITHUB_TOKEN,
        pattern: /gho_[a-zA-Z0-9]{36}/g,
        description: 'GitHub OAuth Token',
        confidence: 0.95,
    },
    {
        type: SecretType.GITHUB_TOKEN,
        pattern: /ghs_[a-zA-Z0-9]{36}/g,
        description: 'GitHub App Token',
        confidence: 0.95,
    },

    // Stripe Keys
    {
        type: SecretType.STRIPE_KEY,
        pattern: /sk_live_[a-zA-Z0-9]{24,}/g,
        description: 'Stripe Secret Key (Live)',
        confidence: 0.95,
    },
    {
        type: SecretType.STRIPE_KEY,
        pattern: /sk_test_[a-zA-Z0-9]{24,}/g,
        description: 'Stripe Secret Key (Test)',
        confidence: 0.9,
    },
    {
        type: SecretType.STRIPE_KEY,
        pattern: /pk_live_[a-zA-Z0-9]{24,}/g,
        description: 'Stripe Publishable Key (Live)',
        confidence: 0.8,
    },

    // AWS Keys
    {
        type: SecretType.AWS_ACCESS_KEY,
        pattern: /AKIA[0-9A-Z]{16}/g,
        description: 'AWS Access Key ID',
        confidence: 0.95,
    },
    {
        type: SecretType.AWS_SECRET_KEY,
        pattern: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)[\s:=]+([a-zA-Z0-9+/]{40})/g,
        description: 'AWS Secret Access Key',
        confidence: 0.95,
    },

    // JWT Tokens
    {
        type: SecretType.JWT_TOKEN,
        pattern: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g,
        description: 'JWT Token',
        confidence: 0.9,
    },

    // Private Keys
    {
        type: SecretType.PRIVATE_KEY,
        pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
        description: 'Private Key',
        confidence: 1.0,
    },

    // Database URLs
    {
        type: SecretType.DATABASE_URL,
        pattern: /(?:postgres|postgresql|mysql|mongodb|redis):\/\/[^\s"']+:[^\s"']+@[^\s"']+/gi,
        description: 'Database Connection URL',
        confidence: 0.95,
    },

    // Environment variable patterns for keys
    {
        type: SecretType.GENERIC_API_KEY,
        pattern: /(?:API_KEY|ACCESS_KEY|[A-Z_]*_KEY)\s*[:=]\s*['"]([a-zA-Z0-9_\-]{8,})['"]?/g,
        description: 'Environment Variable Key Pattern',
        confidence: 0.85,
    },
    {
        type: SecretType.GENERIC_API_KEY,
        pattern: /export\s+(?:API_KEY|ACCESS_KEY|[A-Z_]*_KEY)\s*=\s*['"]?([a-zA-Z0-9_\-]{8,})['"]?/g,
        description: 'Exported Environment Variable Key',
        confidence: 0.85,
    },

    // Generic API Keys (less specific, lower confidence)
    {
        type: SecretType.GENERIC_API_KEY,
        pattern: /(?:api[_-]?key|apikey|api[_-]?secret|access[_-]?token)[\s:=]+['"]?([a-zA-Z0-9_\-]{32,})['"]?/gi,
        description: 'Generic API Key',
        confidence: 0.7,
    },

    // Generic Secrets (broad pattern, lowest confidence)
    {
        type: SecretType.GENERIC_SECRET,
        pattern: /(?:password|passwd|pwd|secret|token)[\s:=]+['"]?([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{12,})['"]?/gi,
        description: 'Generic Secret',
        confidence: 0.6,
    },
];

/**
 * Get patterns filtered by sensitivity level
 */
export function getPatternsBySensitivity(sensitivity: 'strict' | 'balanced' | 'lenient'): SecretPattern[] {
    switch (sensitivity) {
        case 'strict':
            return SECRET_PATTERNS; // All patterns
        case 'balanced':
            return SECRET_PATTERNS.filter(p => p.confidence >= 0.8); // High confidence only
        case 'lenient':
            return SECRET_PATTERNS.filter(p => p.confidence >= 0.9); // Very high confidence only
        default:
            return SECRET_PATTERNS.filter(p => p.confidence >= 0.8);
    }
}
