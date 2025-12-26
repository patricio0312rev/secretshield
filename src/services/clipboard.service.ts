/**
 * Service for clipboard operations
 * Follows Single Responsibility Principle - only handles clipboard
 */

import * as vscode from 'vscode';

/**
 * Service class for managing clipboard operations
 */
export class ClipboardService {
    /**
     * Copy text to the system clipboard
     * 
     * @param text - Text to copy
     * @returns Promise that resolves when copy is complete
     * @throws Error if clipboard operation fails
     */
    public async copyToClipboard(text: string): Promise<void> {
        try {
            await vscode.env.clipboard.writeText(text);
        } catch (error) {
            throw new Error(`Failed to copy to clipboard: ${error}`);
        }
    }

    /**
     * Get text from the system clipboard
     * 
     * @returns Promise that resolves with clipboard text
     * @throws Error if clipboard operation fails
     */
    public async getFromClipboard(): Promise<string> {
        try {
            return await vscode.env.clipboard.readText();
        } catch (error) {
            throw new Error(`Failed to read from clipboard: ${error}`);
        }
    }
}
