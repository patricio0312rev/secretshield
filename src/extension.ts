/**
 * SecretShield Extension Entry Point
 * Follows Dependency Injection and Separation of Concerns
 */

import * as vscode from 'vscode';
import {
    ConfigurationService,
    ClipboardService,
    ScrubberService,
    DiffService,
    ShieldService,
} from './services';
import { SecretDetector } from './detectors';
import { COMMANDS, MESSAGES } from './constants';

/**
 * Extension activation function
 * Called when extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('SecretShield extension is now active');

    // Initialize services following Dependency Injection pattern
    const configService = new ConfigurationService();
    const clipboardService = new ClipboardService();
    const detector = new SecretDetector();
    const scrubberService = new ScrubberService(detector);
    const diffService = new DiffService();
    const shieldService = new ShieldService(
        configService,
        clipboardService,
        scrubberService,
        diffService
    );

    // Register copy with shield command (Cmd+C / Ctrl+C)
    const copyWithShieldCommand = vscode.commands.registerCommand(
        COMMANDS.COPY_WITH_SHIELD,
        async () => {
            await handleCopyWithShield(shieldService);
        }
    );

    // Register copy without shield command (bypass protection)
    const copyWithoutShieldCommand = vscode.commands.registerCommand(
        COMMANDS.COPY_WITHOUT_SHIELD,
        async () => {
            await handleCopyWithoutShield(shieldService);
        }
    );

    context.subscriptions.push(copyWithShieldCommand, copyWithoutShieldCommand);
}

/**
 * Extension deactivation function
 * Called when extension is deactivated
 */
export function deactivate(): void {
    // Cleanup if needed
}

/**
 * Handle the copy with shield command
 * Separates command handling from service logic
 */
async function handleCopyWithShield(shieldService: ShieldService): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showWarningMessage(MESSAGES.NO_ACTIVE_EDITOR);
        return;
    }

    try {
        const text = shieldService.getTextFromEditor(editor);
        await shieldService.copyWithShield(text);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`SecretShield error: ${errorMessage}`);
    }
}

/**
 * Handle the copy without shield command
 * Allows bypassing protection when needed
 */
async function handleCopyWithoutShield(shieldService: ShieldService): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showWarningMessage(MESSAGES.NO_ACTIVE_EDITOR);
        return;
    }

    try {
        const text = shieldService.getTextFromEditor(editor);
        await shieldService.copyWithoutShield(text);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`SecretShield error: ${errorMessage}`);
    }
}
