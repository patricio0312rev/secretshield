# SecretShield 🛡️

> **Privacy First:** SecretShield runs entirely locally in your VSCode environment. It does not use AI, does not send data to any external services, and does not store or log your secrets. All detection happens on your machine using regex patterns.

Automatically detect and redact secrets before copying code to AI chats. Keep your API keys, tokens, and credentials safe when working with Claude, ChatGPT, and other LLMs.

> **⚠️ IMPORTANT: This extension overrides the default `Cmd+C` / `Ctrl+C` behavior in the editor**
>
> SecretShield intercepts copy operations to scan and redact secrets. By default, it works silently. You can enable diff preview or confirmation dialogs in settings if you prefer. To copy without protection, use the command "SecretShield: Copy Without Protection".

## Features

- **Automatic Secret Detection**: Detects 10+ types of secrets (API keys, JWTs, AWS credentials, etc.)
- **Smart Redaction**: Multiple redaction styles (partial masking, full replacement, placeholders)
- **Silent Operation**: Works quietly by default, with optional diff preview and confirmation
- **Configurable**: Customize sensitivity, allowlist/denylist, redaction style
- **Privacy Focused**: All processing happens locally - no data leaves your machine

## Usage

1. Select code (or place cursor to copy entire file)
2. Press `Cmd+C` (Mac) or `Ctrl+C` (Windows/Linux)
3. Paste safely into your AI chat - secrets are automatically redacted!

**Example:**

Before:

```typescript
const API_KEY = "sk-1234567890abcdefghijklmnop";
```

After (with partial masking):

```typescript
const API_KEY = "sk-1****...****";
```

## Detected Secret Types

- OpenAI API Keys (`sk-...`, `sk-proj-...`)
- GitHub Tokens (`ghp_...`, `gho_...`, `ghs_...`)
- Stripe Keys (`sk_live_...`, `pk_live_...`)
- AWS Access Keys (`AKIA...`)
- AWS Secret Keys
- JWT Tokens (`eyJ...`)
- Private Keys (RSA, EC, SSH)
- Database URLs (postgres://, mongodb://, mysql://)
- Environment Variables ending in `_KEY`
- Generic API Keys and Secrets

## Configuration

Open VSCode Settings (`Cmd+,`) and search for "SecretShield":

### Redaction Style

Choose how secrets are masked:

- **Partial** (default): `sk-****...****`
- **Full**: `[REDACTED]`
- **Placeholder**: `<YOUR_API_KEY_HERE>`
- **Labeled**: `[OPENAI_API_KEY]`

### Sensitivity Level

Choose how aggressively SecretShield detects secrets:

| Level           | Description                                       | What It Detects                                                                                        | Best For                                                                              |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| **Lenient**     | Only catches obvious, high-confidence secrets     | Well-known API key formats (OpenAI, GitHub, Stripe, AWS), JWT tokens, private keys                     | When you have many test keys or example values and want minimal false positives       |
| **Balanced** ⭐ | Detects common secret patterns with high accuracy | Everything in Lenient + database URLs, common API key patterns, environment variables ending in `_KEY` | Most users - good balance between security and usability                              |
| **Strict**      | Aggressive detection of potential secrets         | Everything in Balanced + generic passwords, any long alphanumeric strings that might be secrets        | Maximum security - when working with production code or highly sensitive environments |

**Confidence Thresholds:**

- Lenient: ≥90% confidence
- Balanced: ≥80% confidence (default)
- Strict: All patterns (≥60% confidence)

### Preview & Confirmation

- **Show Diff**: Toggle diff preview before copying (default: off)
- **Show Confirmation**: Show confirmation dialog before copying (default: off)

### Allowlist / Denylist

Customize what should or shouldn't be redacted:

```json
{
  "secretshield.allowList": ["sk-test-*", "example.com", "localhost"],
  "secretshield.denyList": ["*.internal.company.com", "CUSTOM_SECRET_*"]
}
```

**Pattern Matching:**

- Supports wildcards: `*` matches any characters
- Examples:
  - `sk-test-*` - allows all test OpenAI keys
  - `*.internal.*` - denies all internal domains
  - `example_*_key` - allows example keys

## Commands

- **SecretShield: Copy with Protection** (`Cmd+C` / `Ctrl+C`) - Copy with automatic redaction
- **SecretShield: Copy Without Protection** - Bypass shield for this copy

## How It Works

1. **Intercept**: When you copy code, SecretShield intercepts the clipboard operation
2. **Detect**: Scans text using regex patterns for known secret formats
3. **Filter**: Applies your allowlist/denylist rules
4. **Redact**: Replaces secrets with your chosen redaction style
5. **Copy**: Safely copies the scrubbed text to clipboard

All processing happens locally on your machine - nothing is sent to external services.

## Extension Settings

| Setting                         | Type    | Default    | Description                      |
| ------------------------------- | ------- | ---------- | -------------------------------- |
| `secretshield.redactionStyle`   | enum    | `partial`  | How secrets should be redacted   |
| `secretshield.sensitivity`      | enum    | `balanced` | Detection sensitivity level      |
| `secretshield.showDiff`         | boolean | `false`    | Show diff preview before copying |
| `secretshield.showConfirmation` | boolean | `false`    | Show confirmation dialog         |
| `secretshield.allowList`        | array   | `[]`       | Patterns to never redact         |
| `secretshield.denyList`         | array   | `[]`       | Custom patterns to always redact |
| `secretshield.interceptAllCopy` | boolean | `true`     | Intercept all copy operations    |

## Privacy & Security

✅ **Local Processing Only**: All secret detection runs locally in VSCode  
✅ **No AI/ML Models**: Uses only regex patterns - fast and private  
✅ **No Data Collection**: Nothing is logged, stored, or transmitted  
✅ **No External Services**: No network calls, no telemetry  
✅ **Open Source**: Fully transparent - audit the code yourself

## Known Issues

None yet! Report issues on [GitHub](https://github.com/patricio0312rev/secretshield).

## Release Notes

### 0.1.0

Initial release of SecretShield

- Automatic secret detection for 10+ secret types
- 4 redaction styles (partial, full, placeholder, labeled)
- 3 sensitivity levels (strict, balanced, lenient)
- Configurable allowlist/denylist with wildcard support
- Optional diff preview and confirmation dialogs
- Silent operation by default

## License

MIT

---

**Stay safe when working with AI! 🛡️**

Enjoy! 💜

Made with love by [Patricio Marroquin](https://www.patriciomarroquin.dev)
