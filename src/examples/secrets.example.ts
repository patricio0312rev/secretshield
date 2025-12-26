// Example file with various secrets for testing SecretShield
// This file intentionally contains fake secrets to demonstrate the extension

// OpenAI API Key (fake)
const OPENAI_API_KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJK";

// GitHub Token (fake)
const GITHUB_TOKEN = "ghp_1234567890abcdefghijklmnopqrstuv";

// Stripe Keys (fake)
const STRIPE_SECRET_KEY = "sk_live_1234567890abcdefghijklmnop";
const STRIPE_PUBLIC_KEY = "pk_live_1234567890abcdefghijklmnop";

// AWS Credentials (fake)
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Database URL (fake)
const DATABASE_URL = "postgresql://user:secretpassword123@localhost:5432/mydb";

// JWT Token (fake)
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Generic API Key (fake)
const API_KEY = "api_key_1234567890abcdefghijklmnopqrstuvwxyz";

// Configuration object with secrets
const config = {
  openai: OPENAI_API_KEY,
  github: GITHUB_TOKEN,
  stripe: {
    secret: STRIPE_SECRET_KEY,
    public: STRIPE_PUBLIC_KEY,
  },
  aws: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  database: DATABASE_URL,
  jwt: JWT_TOKEN,
  generic: API_KEY,
};

// Function that uses secrets
async function fetchData() {
  const response = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'X-API-Key': API_KEY,
    },
  });
  return response.json();
}

// Private key (fake)
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL
MNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN
-----END RSA PRIVATE KEY-----`;

export { config, fetchData, PRIVATE_KEY };