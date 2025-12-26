/**
 * Service for managing extension configuration
 * Follows Single Responsibility Principle - only handles configuration
 */

import * as vscode from 'vscode';
import { SecretShieldConfig, RedactionStyle, SensitivityLevel } from '../types';
import { EXTENSION_CONFIG_KEY } from '../constants';

/**
 * Service class for managing SecretShield configuration
 */
export class ConfigurationService {
    /**
     * Get the current extension configuration
     * 
     * @returns Current configuration object
     */
    public getConfig(): SecretShieldConfig {
        const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY);
    
        return {
            redactionStyle: this.getRedactionStyle(config),
            sensitivity: this.getSensitivity(config),
            showDiff: config.get<boolean>('showDiff', false),  // Changed to false
            showConfirmation: config.get<boolean>('showConfirmation', false),  // New setting
            allowList: config.get<string[]>('allowList', []),
            denyList: config.get<string[]>('denyList', []),
            interceptAllCopy: config.get<boolean>('interceptAllCopy', true),
        };
    }

    /**
     * Get the redaction style setting
     * 
     * @param config - VSCode workspace configuration
     * @returns RedactionStyle enum value
     */
    private getRedactionStyle(config: vscode.WorkspaceConfiguration): RedactionStyle {
        const style = config.get<string>('redactionStyle', RedactionStyle.PARTIAL);
        return this.isValidRedactionStyle(style) ? style : RedactionStyle.PARTIAL;
    }

    /**
     * Get the sensitivity level setting
     * 
     * @param config - VSCode workspace configuration
     * @returns SensitivityLevel enum value
     */
    private getSensitivity(config: vscode.WorkspaceConfiguration): SensitivityLevel {
        const sensitivity = config.get<string>('sensitivity', SensitivityLevel.BALANCED);
        return this.isValidSensitivity(sensitivity) ? sensitivity : SensitivityLevel.BALANCED;
    }

    /**
     * Type guard for RedactionStyle
     */
    private isValidRedactionStyle(value: string): value is RedactionStyle {
        return Object.values(RedactionStyle).includes(value as RedactionStyle);
    }

    /**
     * Type guard for SensitivityLevel
     */
    private isValidSensitivity(value: string): value is SensitivityLevel {
        return Object.values(SensitivityLevel).includes(value as SensitivityLevel);
    }
}
