import type { AIProvider, AIProviderType } from '../types';

// ─── Mock AI Provider ─────────────────────────────────────────────────────────
// Returns a canned response indicating simulation mode.

class MockAIProvider implements AIProvider {
  type: AIProviderType = 'mock';
  name = 'Simulation Mode (No API Required)';

  async generate(systemPrompt: string, userMessage: string): Promise<string> {
    // Simulate a small delay for realism
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

    return `[SIMULATION MODE — no external API connected]\n\nSystem prompt active (${systemPrompt.length} chars). In a real deployment, this prompt would be sent to an LLM provider with your message:\n\n"${userMessage.slice(0, 200)}${userMessage.length > 200 ? '...' : ''}"`;
  }
}

// ─── Provider Registry ────────────────────────────────────────────────────────

const providers: Record<AIProviderType, AIProvider> = {
  mock: new MockAIProvider(),
  // Future providers — add here without changing the engine
  openai: createPlaceholderProvider('openai', 'OpenAI GPT'),
  anthropic: createPlaceholderProvider('anthropic', 'Anthropic Claude'),
  gemini: createPlaceholderProvider('gemini', 'Google Gemini'),
  openrouter: createPlaceholderProvider('openrouter', 'OpenRouter'),
  local: createPlaceholderProvider('local', 'Local LLM'),
};

function createPlaceholderProvider(type: AIProviderType, name: string): AIProvider {
  return {
    type,
    name,
    async generate(_systemPrompt: string, _userMessage: string): Promise<string> {
      return `[${name} integration not yet configured. Add your API key and implementation in src/engine/aiProvider.ts]`;
    },
  };
}

export function getProvider(type: AIProviderType = 'mock'): AIProvider {
  return providers[type] ?? providers.mock;
}

export const availableProviders: Array<{ type: AIProviderType; name: string }> = [
  { type: 'mock', name: 'Simulation Mode' },
  { type: 'openai', name: 'OpenAI GPT' },
  { type: 'anthropic', name: 'Anthropic Claude' },
  { type: 'gemini', name: 'Google Gemini' },
  { type: 'openrouter', name: 'OpenRouter' },
  { type: 'local', name: 'Local LLM' },
];
