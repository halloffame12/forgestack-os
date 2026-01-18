# Local AI Setup & Integration

Learn how to use local AI models with ForgeStack OS for code generation, API documentation, and project optimization—completely offline and free.

---

## Overview

ForgeStack integrates with local LLMs for:

- **Code generation assistance** - Generate boilerplate, tests, docs
- **API documentation** - Auto-generate OpenAPI specs, JSDoc comments
- **Code reviews** - Suggest improvements and security fixes
- **Project optimization** - Analyze and recommend improvements
- **Migrations** - Help upgrade and refactor code

**Supported Local Runtimes**:

- ✅ **Ollama** (macOS, Linux, Windows)
- ✅ **LM Studio** (macOS, Linux, Windows)
- ✅ **LocalAI** (Docker-based, any platform)
- ✅ **Text Generation WebUI** (Advanced users)

---

## Quick Start

### 1. Install Ollama (Recommended)

**macOS/Linux/Windows**:

```bash
# macOS/Linux
brew install ollama

# Windows: Download from https://ollama.ai
```

### 2. Download a Model

```bash
# Pull a fast model for code (4.7GB)
ollama pull mistral

# Or pull a specialized code model
ollama pull neural-chat     # 7.3B, fast, good for code
ollama pull codeup          # 13B, specialized for coding
ollama pull codellama       # 34B, state-of-the-art code model
```

### 3. Configure ForgeStack

```bash
# Auto-detect and configure
forgestack ai setup

# Or configure manually
forgestack ai config --model=mistral --endpoint=http://localhost:11434
```

### 4. Start Generating!

```bash
# Generate code with AI assistance
forgestack create my-app --ai

# Generate API documentation
forgestack generate:api-docs --ai

# Review and optimize existing code
forgestack analyze --ai
```

---

## Installation Options

### Option 1: Ollama (Recommended - Easiest)

```bash
# Install Ollama
brew install ollama  # macOS
# or visit https://ollama.ai for Linux/Windows

# Start Ollama server
ollama serve

# In another terminal, pull a model
ollama pull mistral
```

**Pros**:

- ✅ Simple installation
- ✅ One-click model updates
- ✅ Excellent performance
- ✅ Great community support

**Model Options**:

- `mistral` (7B) - Fast, good quality, 4.7GB
- `neural-chat` (7B) - Optimized for conversation, 4.7GB
- `codeup` (13B) - Faster than Llama 2 for code, 7.3GB
- `codellama` (34B) - State-of-the-art code generation, 20GB
- `orca-mini` (3B) - Tiny but capable, 1.9GB

### Option 2: LM Studio (Best GUI)

1. Download from https://lmstudio.ai
2. Open LM Studio
3. Search for and download a model (e.g., "Mistral 7B")
4. Start local server in LM Studio
5. ForgeStack auto-detects at `http://localhost:1234`

**Pros**:

- ✅ Beautiful UI
- ✅ Model management GUI
- ✅ Easy downloads
- ✅ Performance monitoring

### Option 3: LocalAI (Docker-based)

```bash
# Install Docker (if not already installed)
# https://docs.docker.com/get-docker/

# Run LocalAI with a model
docker run -p 8080:8080 \
  -e PRELOAD_MODELS=gpt4all-j \
  localai/localai:latest

# Configure ForgeStack
forgestack ai config --endpoint=http://localhost:8080
```

**Pros**:

- ✅ Works on any platform
- ✅ Containerized
- ✅ Multiple models supported
- ✅ Scalable

---

## Configuration

### Auto Setup

```bash
forgestack ai setup
```

This prompts you to:

1. Choose runtime (Ollama, LM Studio, LocalAI, etc.)
2. Confirm endpoint
3. Select/download model
4. Test connection

### Manual Configuration

```bash
# Create ~/.forgestack/ai-config.json
{
  "enabled": true,
  "runtime": "ollama",           # or "lm-studio", "localai"
  "endpoint": "http://localhost:11434",
  "model": "mistral",
  "settings": {
    "temperature": 0.7,
    "topP": 0.9,
    "maxTokens": 2048,
    "timeout": 30000
  },
  "features": {
    "codeGeneration": true,
    "apiDocumentation": true,
    "codeReview": true,
    "projectAnalysis": true
  }
}
```

### Environment Variables

```bash
# .env or .env.local
FORGESTACK_AI_ENABLED=true
FORGESTACK_AI_RUNTIME=ollama        # ollama, lm-studio, localai
FORGESTACK_AI_ENDPOINT=http://localhost:11434
FORGESTACK_AI_MODEL=mistral
FORGESTACK_AI_TEMPERATURE=0.7
FORGESTACK_AI_MAX_TOKENS=2048
```

---

## Usage

### Generate Code with AI

```bash
# Create project with AI-assisted generation
forgestack create my-app --ai

# Enhanced generation with custom prompt
forgestack create my-app --ai --ai-prompt="Use strict TypeScript with no 'any' types"

# Generate specific feature with AI
forgestack generate:feature --ai --name="user-authentication"

# Generate tests with AI
forgestack generate:tests --ai --coverage=80
```

### Auto-Generate API Documentation

```bash
# Generate OpenAPI spec from code
forgestack generate:api-docs --ai

# Generated file: openapi.json
# Includes:
# - All endpoints mapped
# - Request/response schemas
# - Parameter documentation
# - Example requests
```

### Code Analysis & Optimization

```bash
# Analyze project with AI
forgestack analyze --ai

# Shows suggestions:
# ✓ Performance improvements
# ✓ Security issues
# ✓ Code style recommendations
# ✓ Type safety improvements

# Generate fixes
forgestack analyze:fix --ai
```

### Interactive Code Review

```bash
# Review specific file
forgestack review src/api/users.ts --ai

# Detailed feedback:
# Security: ⚠️  SQL injection risk in query builder
# Performance: 💡 Consider adding database indexes
# Types: ⚠️  Type 'any' found, replace with specific type
# Best practices: 💡 Add error handling for async operations

# Generate fixes
forgestack review:fix src/api/users.ts --ai
```

### Generate Migration Helpers

```bash
# Create database migration with AI
forgestack generate:migration --ai --name="add_user_roles_table"

# AI generates:
# - Up migration (add new table/columns)
# - Down migration (rollback)
# - Seed data (if applicable)
# - Index creation (for performance)
```

---

## Prompting Best Practices

### System Prompts

ForgeStack provides context-aware system prompts:

```typescript
// Example system prompt for code generation
const systemPrompt = `You are a TypeScript code generator for ForgeStack OS.
Follow these rules:
- Use strict TypeScript with no 'any' types
- Add JSDoc comments for all functions
- Use const assertions for literal types
- Include error handling
- Follow the existing code style
- Generate production-ready code`;
```

### User Prompts

```bash
# ❌ Vague
forgestack generate:code --ai --prompt="make an API"

# ✅ Specific
forgestack generate:code --ai --prompt="Create a REST API endpoint for fetching users with pagination, sorting, and filtering. Use Express and TypeORM. Return 404 if user not found."

# ❌ Too complex for one prompt
forgestack generate:code --ai --prompt="Build a complete e-commerce system with cart, checkout, payments, and admin dashboard"

# ✅ Break into steps
forgestack generate:code --ai --prompt="Create shopping cart reducer with add, remove, and update actions"
forgestack generate:code --ai --prompt="Create checkout form with validation for shipping address"
forgestack generate:code --ai --prompt="Create payment processing endpoint with Stripe integration"
```

---

## Model Recommendations

### By Use Case

| Use Case          | Recommended   | Size | Speed  | Quality    |
| ----------------- | ------------- | ---- | ------ | ---------- |
| Quick tests       | `orca-mini`   | 3B   | ⚡⚡⚡ | ⭐⭐⭐     |
| General coding    | `mistral`     | 7B   | ⚡⚡   | ⭐⭐⭐⭐   |
| Chat-style coding | `neural-chat` | 7B   | ⚡⚡   | ⭐⭐⭐⭐   |
| Specialized code  | `codeup`      | 13B  | ⚡     | ⭐⭐⭐⭐⭐ |
| Best quality      | `codellama`   | 34B  | 🐢     | ⭐⭐⭐⭐⭐ |

### Popular Models

```bash
# Lightweight (3-7GB, fast)
ollama pull orca-mini        # 3B, small, capable
ollama pull mistral          # 7B, balanced
ollama pull neural-chat      # 7B, conversation-optimized

# Powerful (7-20GB, slower but better)
ollama pull codeup           # 13B, code specialist
ollama pull codeqwen         # 15B, code specialist (Chinese)
ollama pull wizardcoder      # 34B, state-of-the-art (slow)

# Experimental
ollama pull phind-codellama  # 34B, tuned for coding
ollama pull starcoder        # 15B, specialized for code
```

### Switching Models

```bash
# Use different model for specific task
forgestack generate:code --ai --model=codellama

# Update default
forgestack ai config --model=codellama

# List available models
forgestack ai models
# - mistral (current)
# - neural-chat
# - codeup
# - orca-mini
```

---

## Advanced Configuration

### Temperature & Sampling

```bash
# Creative output (higher temp)
forgestack generate --ai --temperature=0.9

# Deterministic output (lower temp)
forgestack generate --ai --temperature=0.3

# Balanced (default)
forgestack generate --ai --temperature=0.7
```

### Token Limits

```bash
# Short response
forgestack generate --ai --max-tokens=256

# Long-form documentation
forgestack generate:docs --ai --max-tokens=4096

# Use defaults
forgestack generate --ai  # Default: 2048 tokens
```

### Custom Endpoints

```bash
# Use custom local endpoint
forgestack ai config --endpoint=http://192.168.1.100:8080

# Use remote endpoint (not recommended for sensitive data)
forgestack ai config --endpoint=https://my-ai-server.com:8000
```

---

## Troubleshooting

### Model not connecting

```bash
# Check Ollama is running
brew services list | grep ollama

# If not running:
brew services start ollama

# Test endpoint
curl http://localhost:11434/api/tags

# Should see model list
```

### Slow responses

```bash
# Use smaller model
ollama pull orca-mini
forgestack ai config --model=orca-mini

# Reduce token limit
forgestack generate --ai --max-tokens=1024

# Check system resources
free -h  # Linux
vm_stat  # macOS
```

### Out of memory

```bash
# Use smaller model
forgestack ai config --model=mistral

# Or reduce context
export OLLAMA_KEEP_ALIVE=0m  # Unload model when not in use
```

### Poor quality output

```bash
# Try different model
forgestack ai config --model=codeup

# Improve prompt specificity
# Add more context to --ai-prompt

# Adjust temperature
forgestack generate --ai --temperature=0.5
```

---

## Privacy & Performance

### Data Privacy

✅ **Local models are completely private**:

- No data sent to external servers
- All processing happens on your machine
- Works completely offline
- No account or API key needed

### Performance Tips

```bash
# Pre-load model to avoid startup delay
ollama serve

# Or use "keep alive" setting
export OLLAMA_KEEP_ALIVE=24h

# Monitor model memory usage
ollama list

# Run on GPU (much faster)
# See https://github.com/ollama/ollama/blob/main/docs/gpu.md
```

---

## Fallback to Remote (Optional)

If local setup isn't possible, ForgeStack can optionally use:

```bash
# Configure OpenAI fallback (requires API key)
forgestack ai config --fallback=openai --api-key=$OPENAI_API_KEY

# Or Anthropic Claude
forgestack ai config --fallback=anthropic --api-key=$ANTHROPIC_API_KEY
```

⚠️ **Note**: Remote services require API keys and internet connection. Local setup is strongly recommended.

---

## Examples

### Generate REST API Endpoint

```bash
forgestack generate:code --ai \
  --prompt="Express GET endpoint at /users/:id that:
- Validates ID is a number
- Returns 404 if user not found
- Includes error handling
- Has JSDoc comments"

# Generated:
# GET /users/:id → Returns user with id
# Type-safe with validation
# Proper error handling
# Full JSDoc documentation
```

### Generate API Documentation

```bash
forgestack generate:api-docs --ai

# Generated: openapi.json
# - All endpoints listed
# - Request/response schemas
# - Example requests
# - Parameter documentation
# - Security schemes
```

### Generate Test Suite

```bash
forgestack generate:tests --ai \
  --file=src/services/user.ts \
  --coverage=80

# Generated:
# - Unit tests for all functions
# - Edge case coverage
# - Mock setup
# - Test utilities
```

---

## Resources

- [Ollama Models](https://ollama.ai/library)
- [LM Studio](https://lmstudio.ai)
- [LocalAI](https://localai.io)
- [Model Benchmarks](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)

---

**Next**: [Contributing to ForgeStack](../CONTRIBUTING.md)
