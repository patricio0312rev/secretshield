# SecretShield Development Guide

## How to Test the Extension

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Compile TypeScript

```bash
pnpm run compile
```

### 3. Run in VSCode

1. Open this folder in VSCode
2. Press `F5` to open a new VSCode window with the extension loaded
3. Open the example file: `examples/secrets-example.ts`
4. Select some code containing secrets (or place cursor anywhere)
5. Press `Cmd+C` (Mac) or `Ctrl+C` (Windows/Linux)
6. Review the diff preview showing detected secrets
7. Approve and paste to verify secrets are redacted!

## Expected Behavior

When you copy from `examples/secrets-example.ts`:

**Before (Original):**

```typescript
const OPENAI_API_KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJK";
```

**After (Redacted with default "partial" style):**

```typescript
const OPENAI_API_KEY = "sk-1****...****";
```

## Configuration

Open VSCode Settings (`Cmd+,`) and search for "SecretShield":

### Redaction Style

- **Partial** (default): `sk-****...****`
- **Full**: `[REDACTED]`
- **Placeholder**: `<YOUR_OPENAI_API_KEY>`
- **Labeled**: `[OPENAI_API_KEY]`

### Sensitivity Level

- **Strict**: Aggressive - detects more potential secrets
- **Balanced** (default): Common secrets only
- **Lenient**: Only obvious, high-confidence secrets

### Other Settings

- **Show Diff**: Toggle preview before copying
- **Allow List**: Patterns to never redact (e.g., `sk-test-*`)
- **Deny List**: Custom patterns to always redact
- **Intercept All Copy**: Enable/disable automatic interception

## Architecture

Clean, modular structure following SOLID principles:

```
src/
├── constants/          # Regex patterns, command IDs, messages
├── types/             # TypeScript interfaces and enums
├── utils/             # Pure utility functions
│   ├── pattern-matcher.util.ts    # Allowlist/denylist matching
│   └── redactor.util.ts            # Redaction styles
├── detectors/         # Secret detection logic
│   └── secret-detector.ts          # Pattern-based detection
├── services/          # Business logic services
│   ├── configuration.service.ts    # Settings management
│   ├── clipboard.service.ts        # Clipboard operations
│   ├── scrubber.service.ts         # Coordinates detection & redaction
│   ├── diff.service.ts             # Shows diff preview
│   └── shield.service.ts           # Main orchestrator
└── extension.ts       # Entry point with DI setup
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
- Generic API Keys
- Generic Secrets

## Development Workflow

1. Make changes to source files
2. Run `pnpm run compile` (or `pnpm run watch` for auto-compile)
3. Reload the extension window (`Cmd+R` in the extension development host)
4. Test your changes with the example file

## Testing Scenarios

### Test 1: Basic Secret Detection

1. Open `examples/secrets-example.ts`
2. Copy the entire file
3. Verify all secrets are detected

### Test 2: Partial Selection

1. Select only the OpenAI key line
2. Copy and verify single detection

### Test 3: Allowlist

1. Add `sk-test-*` to allowList in settings
2. Change example to `sk-test-abc123...`
3. Verify it's NOT redacted

### Test 4: Different Redaction Styles

1. Change redactionStyle in settings
2. Copy and observe different output formats

### Test 5: Copy Without Shield

1. Use command palette: "SecretShield: Copy Without Protection"
2. Verify secrets are NOT redacted

## Publishing

```bash
# Install vsce
pnpm install -g @vscode/vsce

# Package
vsce package

# Publish to VSCode Marketplace
vsce publish

# Publish to Open VSX
pnpm install -g ovsx
ovsx publish
```

## Troubleshooting

**Extension not activating?**

- Check the Output panel (View → Output → Select "Extension Host")
- Verify TypeScript compiled without errors

**Secrets not detected?**

- Check sensitivity level (try "strict")
- Verify patterns in `src/constants/patterns.ts`

**Diff not showing?**

- Check `showDiff` setting is enabled
- Ensure secrets were actually detected

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the modular architecture
4. Keep files under 150 lines
5. Write descriptive commit messages (conventional commits)
6. Submit a PR!

## Line Count Check

All files should be under 150 lines:

```bash
find src -name '*.ts' -exec wc -l {} \; | sort -n
```
