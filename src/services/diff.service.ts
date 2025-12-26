/**
 * Service for showing diff preview of redactions
 * Follows Single Responsibility Principle - only handles diff display
 */

import * as vscode from 'vscode';
import { ScrubResult } from '../types';

/**
 * Service class for showing diff previews
 */
export class DiffService {
    /**
     * Show a diff preview of the redactions
     * 
     * @param result - Scrub result with original and scrubbed text
     * @param title - Title for the diff view
     * @param showConfirmation - Whether to show confirmation dialog
     * @returns Promise that resolves with user's choice (true = approve, false = cancel)
     */
    public async showDiff(
        result: ScrubResult, 
        title: string,
        showConfirmation: boolean = false
    ): Promise<boolean> {
        // Create temporary documents for diff view
        const originalDoc = await vscode.workspace.openTextDocument({
            content: result.originalText,
            language: 'plaintext',
        });

        const scrubbedDoc = await vscode.workspace.openTextDocument({
            content: result.scrubbedText,
            language: 'plaintext',
        });

        // Show diff editor
        await vscode.commands.executeCommand(
            'vscode.diff',
            originalDoc.uri,
            scrubbedDoc.uri,
            title
        );

        // Show confirmation dialog if enabled
        if (showConfirmation) {
            const choice = await vscode.window.showInformationMessage(
                `${result.redactions.length} secret${result.redactions.length > 1 ? 's' : ''} will be redacted. Continue?`,
                { modal: true },
                'Copy with Redactions',
                'Cancel'
            );

            return choice === 'Copy with Redactions';
        }

        // Auto-approve if no confirmation needed
        return true;
    }

    /**
     * Create a simple text summary of redactions
     * 
     * @param result - Scrub result
     * @returns Formatted summary string
     */
    public createSummary(result: ScrubResult): string {
        if (!result.hasSecrets) {
            return 'No secrets detected.';
        }

        const lines = [
            `Found ${result.redactions.length} secret${result.redactions.length > 1 ? 's' : ''}:`,
            '',
        ];

        for (const redaction of result.redactions) {
            lines.push(`- ${redaction.type}: ${redaction.original} → ${redaction.redacted}`);
        }

        return lines.join('\n');
    }
}
