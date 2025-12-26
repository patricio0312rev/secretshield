/**
 * Service for scrubbing secrets from text
 * Follows Single Responsibility Principle - coordinates detection and redaction
 */

import { 
    ScrubResult, 
    RedactionResult, 
    DetectedSecret, 
    SecretShieldConfig 
} from '../types';
import { SecretDetector } from '../detectors';
import { redactSecret, shouldRedact } from '../utils';

/**
 * Service class for scrubbing secrets from text
 */
export class ScrubberService {
    constructor(
        private readonly detector: SecretDetector
    ) {}

    /**
     * Scrub secrets from text based on configuration
     * 
     * @param text - Original text to scrub
     * @param config - Configuration settings
     * @returns Scrub result with redacted text
     */
    public scrubText(text: string, config: SecretShieldConfig): ScrubResult {
        // Detect all secrets
        const detected = this.detector.detectSecrets(text, config.sensitivity);

        // Filter based on allow/deny lists
        const toRedact = detected.filter(secret => 
            shouldRedact(secret.value, config.allowList, config.denyList)
        );

        // No secrets to redact
        if (toRedact.length === 0) {
            return {
                originalText: text,
                scrubbedText: text,
                redactions: [],
                hasSecrets: false,
            };
        }

        // Perform redaction
        const { scrubbedText, redactions } = this.performRedaction(
            text,
            toRedact,
            config
        );

        return {
            originalText: text,
            scrubbedText,
            redactions,
            hasSecrets: true,
        };
    }

    /**
     * Perform the actual redaction on the text
     * 
     * @param text - Original text
     * @param secrets - Secrets to redact
     * @param config - Configuration settings
     * @returns Scrubbed text and redaction details
     */
    private performRedaction(
        text: string,
        secrets: DetectedSecret[],
        config: SecretShieldConfig
    ): { scrubbedText: string; redactions: RedactionResult[] } {
        const redactions: RedactionResult[] = [];
        let result = text;
        let offset = 0; // Track position changes from redactions

        // Sort secrets by position (already sorted by detector)
        for (const secret of secrets) {
            const redacted = redactSecret(
                secret.value,
                config.redactionStyle,
                secret.type
            );

            // Calculate adjusted positions due to previous redactions
            const adjustedStart = secret.start + offset;
            const adjustedEnd = secret.end + offset;

            // Replace in result string
            result = 
                result.substring(0, adjustedStart) +
                redacted +
                result.substring(adjustedEnd);

            // Update offset for next redaction
            offset += redacted.length - secret.value.length;

            redactions.push({
                original: secret.value,
                redacted,
                type: secret.type,
                position: {
                    start: secret.start,
                    end: secret.end,
                },
            });
        }

        return { scrubbedText: result, redactions };
    }
}
