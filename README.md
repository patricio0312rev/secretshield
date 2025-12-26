# SecretShield 🛡️

Automatically detect and redact secrets before copying code to AI chats. Keep your API keys, tokens, and credentials safe when working with Claude, ChatGPT, and other LLMs.

> **⚠️ IMPORTANT: This extension overrides the default `Cmd+C` / `Ctrl+C` behavior in the editor**
>
> SecretShield intercepts copy operations to scan and redact secrets. You'll see a diff preview before copying. If you want to copy without protection, use the command "SecretShield: Copy Without Protection".

## Features

- **Automatic Secret Detection**: Detects 10+ types of secrets (API keys, JWTs, AWS credentials, etc.)
- **Smart Redaction**: Multiple redaction styles (partial masking, full replacement, placeholders)
- **Interactive Diff Preview**: See what will be redacted before copying
- **Configurable**: Customize sensitivity, allowlist/denylist, redaction style
- **Works Everywhere**: Intercepts all copy operations in the editor

## Usage

1. Select code (or place cursor to copy entire file)
2. Press `Cmd+C` (Mac) or `Ctrl+C` (Windows/Linux)
3. Review the diff showing what will be redacted
4. Approve and paste safely into your AI chat!

**Example:**

Before:

```typescript
const API_KEY = "sk-1234567890abcdefghijklmnop";
```

After (with partial masking):

```typescript
const API_KEY = "sk-****...****";
```

## Detected Secret Types

- OpenAI API Keys (`sk-...`)
- GitHub Tokens (`ghp_...`, `gho_...`)
- Stripe Keys (`sk_live_...`, `pk_live_...`)
- AWS Access Keys (`AKIA...`)
- JWT Tokens (`eyJ...`)
- Private Keys (RSA, SSH)
- Database URLs (postgres://, mongodb://, mysql://)
- Generic API Keys (long alphanumeric strings)

## Configuration

Open VSCode Settings (`Cmd+,`) and search for "SecretShield":

### Redaction Style

Choose how secrets are masked:

- **Partial** (default): `sk-****...****`
- **Full**: `[REDACTED]`
- **Placeholder**: `<YOUR_API_KEY_HERE>`
- **Labeled**: `[OPENAI_API_KEY]`

### Sensitivity Level

- **Strict**: Aggressive detection
- **Balanced** (default): Common secrets only
- **Lenient**: Only obvious secrets

### Allowlist / Denylist

Customize what should or shouldn't be redacted:

```json
{
  "secretshield.allowList": ["sk-test-*", "example.com"],
  "secretshield.denyList": ["*.internal.company.com"]
}
```

## Commands

- **SecretShield: Copy with Protection** (`Cmd+C`) - Copy with automatic redaction
- **SecretShield: Copy Without Protection** - Bypass shield for this copy

## Extension Settings

Coming soon in settings UI!

## Known Issues

None yet! Report issues on [GitHub](https://github.com/patricio0312rev/promptcopy).

## Release Notes

### 0.1.0

Initial release of SecretShield

## License

MIT

---

Enjoy! 💜

Made with love by [Patricio Marroquin](https://www.patriciomarroquin.dev)
