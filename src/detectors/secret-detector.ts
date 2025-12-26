/**
 * Secret detector service for finding secrets in text
 * Follows Single Responsibility Principle - only handles detection
 */

import { DetectedSecret, SensitivityLevel } from '../types';
import { SECRET_PATTERNS, getPatternsBySensitivity, SecretPattern } from '../constants';

/**
 * Service for detecting secrets in text using regex patterns
 */
export class SecretDetector {
    /**
     * Detect all secrets in the given text
     * 
     * @param text - Text to scan for secrets
     * @param sensitivity - Detection sensitivity level
     * @returns Array of detected secrets
     */
    public detectSecrets(text: string, sensitivity: SensitivityLevel): DetectedSecret[] {
        const patterns = getPatternsBySensitivity(sensitivity);
        const detected: DetectedSecret[] = [];

        for (const pattern of patterns) {
            const matches = this.findMatches(text, pattern);
            detected.push(...matches);
        }

        // Remove duplicates (same position and value)
        return this.deduplicateSecrets(detected);
    }

    /**
     * Find all matches for a specific pattern
     * 
     * @param text - Text to search in
     * @param pattern - Pattern to search for
     * @returns Array of detected secrets for this pattern
     */
    private findMatches(text: string, pattern: SecretPattern): DetectedSecret[] {
        const matches: DetectedSecret[] = [];
        
        // Reset regex lastIndex to ensure clean search
        pattern.pattern.lastIndex = 0;
        
        let match: RegExpExecArray | null;
        
        while ((match = pattern.pattern.exec(text)) !== null) {
            const value = match[0];
            const start = match.index;
            const end = start + value.length;

            // Extract context (surrounding text)
            const context = this.extractContext(text, start, end);

            matches.push({
                type: pattern.type,
                value,
                start,
                end,
                confidence: pattern.confidence,
                context,
            });

            // Prevent infinite loop for zero-width matches
            if (match.index === pattern.pattern.lastIndex) {
                pattern.pattern.lastIndex++;
            }
        }

        return matches;
    }

    /**
     * Extract context around a detected secret
     * 
     * @param text - Full text
     * @param start - Start position of secret
     * @param end - End position of secret
     * @returns Context string (e.g., variable name)
     */
    private extractContext(text: string, start: number, end: number): string | undefined {
        // Look backwards for variable name or key
        const beforeText = text.substring(Math.max(0, start - 50), start);
        const contextMatch = beforeText.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*['"]?$/);
        
        if (contextMatch) {
            return contextMatch[1];
        }

        return undefined;
    }

    /**
     * Remove duplicate secrets (same position and value)
     * 
     * @param secrets - Array of detected secrets
     * @returns Deduplicated array
     */
    private deduplicateSecrets(secrets: DetectedSecret[]): DetectedSecret[] {
        const seen = new Set<string>();
        const unique: DetectedSecret[] = [];

        for (const secret of secrets) {
            const key = `${secret.start}-${secret.end}-${secret.value}`;
            
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(secret);
            }
        }

        // Sort by position for consistent ordering
        return unique.sort((a, b) => a.start - b.start);
    }
}
