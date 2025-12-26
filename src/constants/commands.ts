/**
 * VSCode command identifiers and user-facing messages
 */

/**
 * Command IDs registered by the extension
 */
export const COMMANDS = {
    COPY_WITH_SHIELD: 'secretshield.copyWithShield',
    COPY_WITHOUT_SHIELD: 'secretshield.copyWithoutShield',
} as const;

/**
 * User-facing messages
 */
export const MESSAGES = {
    NO_ACTIVE_EDITOR: 'No active editor found',
    NO_SECRETS_FOUND: 'No secrets detected - copied safely!',
    SECRETS_REDACTED: (count: number) => `${count} secret${count > 1 ? 's' : ''} redacted`,
    COPY_CANCELLED: 'Copy operation cancelled',
    COPY_WITHOUT_PROTECTION: 'Copied without protection',
    DIFF_PREVIEW_TITLE: 'SecretShield: Review Redactions',
} as const;

/**
 * Extension configuration key
 */
export const EXTENSION_CONFIG_KEY = 'secretshield';
