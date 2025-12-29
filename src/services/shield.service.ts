/**
 * Main SecretShield service that orchestrates all operations
 * Follows Single Responsibility Principle - coordinates between services
 */

import * as vscode from 'vscode';
import { ConfigurationService } from './configuration.service';
import { ClipboardService } from './clipboard.service';
import { ScrubberService } from './scrubber.service';
import { DiffService } from './diff.service';
import { MESSAGES } from '../constants';
import { ScrubResult } from '../types';

/**
 * Main service class for SecretShield operations
 * Orchestrates configuration, detection, redaction, diff, and clipboard services
 */
export class ShieldService {
    private statusBarTimeout?: NodeJS.Timeout;

    constructor(
        private readonly configService: ConfigurationService,
        private readonly clipboardService: ClipboardService,
        private readonly scrubberService: ScrubberService,
        private readonly diffService: DiffService,
        private readonly statusBarItem: vscode.StatusBarItem
    ) {}

    /**
     * Show a temporary message in the status bar
     *
     * @param message - Message to display
     * @param duration - Duration in milliseconds (default: 3000)
     */
    private showStatusBarMessage(message: string, duration: number = 3000): void {
        if (this.statusBarTimeout) {
            clearTimeout(this.statusBarTimeout);
        }

        this.statusBarItem.text = `$(shield) ${message}`;
        this.statusBarItem.show();

        this.statusBarTimeout = setTimeout(() => {
            this.statusBarItem.hide();
        }, duration);
    }

    /**
     * Copy text with secret protection
     *
     * @param text - Text to copy
     * @returns Promise that resolves when copy is complete
     */
    public async copyWithShield(text: string): Promise<void> {
        const config = this.configService.getConfig();

        // Scrub the text
        const result = this.scrubberService.scrubText(text, config);

        // No secrets found - copy as is (no message shown per user request)
        if (!result.hasSecrets) {
            await this.clipboardService.copyToClipboard(text);
            return;
        }

        // Show diff if configured
        if (config.showDiff) {
            const approved = await this.diffService.showDiff(
                result,
                MESSAGES.DIFF_PREVIEW_TITLE,
                config.showConfirmation
            );

            if (!approved) {
                vscode.window.showWarningMessage(MESSAGES.COPY_CANCELLED);
                return;
            }
        } else if (config.showConfirmation) {
            // Show only confirmation dialog without diff
            const approved = await this.showConfirmationOnly(result);
            if (!approved) {
                vscode.window.showWarningMessage(MESSAGES.COPY_CANCELLED);
                return;
            }
        }

        // Copy scrubbed text (no message shown per user request)
        await this.clipboardService.copyToClipboard(result.scrubbedText);
    }

    /**
     * Copy text without protection (bypass shield)
     *
     * @param text - Text to copy
     * @returns Promise that resolves when copy is complete
     */
    public async copyWithoutShield(text: string): Promise<void> {
        await this.clipboardService.copyToClipboard(text);
        this.showStatusBarMessage(MESSAGES.COPY_WITHOUT_PROTECTION);
    }

    /**
     * Get text from active editor
     * 
     * @param editor - VSCode text editor
     * @returns Selected text or entire document
     */
    public getTextFromEditor(editor: vscode.TextEditor): string {
        const selection = editor.selection;
        const document = editor.document;

        // Get selection or entire document
        return selection.isEmpty
            ? document.getText()
            : document.getText(selection);
    }

    /**
     * Show only confirmation dialog without diff view
     */
    private async showConfirmationOnly(result: ScrubResult): Promise<boolean> {
        const choice = await vscode.window.showInformationMessage(
            `${result.redactions.length} secret${result.redactions.length > 1 ? 's' : ''} will be redacted. Continue?`,
            { modal: true },
            'Copy with Redactions',
            'Cancel'
        );

        return choice === 'Copy with Redactions';
    }
}
