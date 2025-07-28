import { OpenAIProvider } from './openai-provider.js';
import {
  LLMProvider,
  ProviderCapabilities,
  AuthenticationError,
} from './types.js';

/**
 * OpenRouter Provider
 * Uses OpenAI-compatible API endpoints provided by OpenRouter
 */
export class OpenRouterProvider extends OpenAIProvider {
  readonly name: LLMProvider = 'openrouter';

  readonly capabilities: ProviderCapabilities = {
    supportedModels: [
      'qwen/qwen3-235b-a22b-thinking-2507',
      'qwen/qwen3-coder:free',
      'moonshotai/kimi-k2',
      'moonshotai/kimi-k2:free',
      'google/gemini-2.5-pro',
    ],
    maxContextLength: {
      'qwen/qwen3-235b-a22b-thinking-2507': 32768,
      'qwen/qwen3-coder:free': 32768,
      'moonshotai/kimi-k2': 32768,
      'moonshotai/kimi-k2:free': 32768,
      'google/gemini-2.5-pro': 32768,
    } as Record<string, number>,
    maxOutputTokens: {
      'qwen/qwen3-235b-a22b-thinking-2507': 4096,
      'qwen/qwen3-coder:free': 4096,
      'moonshotai/kimi-k2': 4096,
      'moonshotai/kimi-k2:free': 4096,
      'google/gemini-2.5-pro': 4096,
    } as Record<string, number>,
    supportsStreaming: true,
    supportsFunctionCalling: true,
    supportsSystemMessages: true,
    supportsVision: true,
    supportsAudio: false,
    supportsTools: true,
    supportsFineTuning: false,
    supportsEmbeddings: false,
    supportsLogprobs: false,
    supportsBatching: true,
  };

  // Override initialization to use OpenRouter base URL and headers
  protected async doInitialize(): Promise<void> {
    if (!this.config.apiKey) {
      throw new AuthenticationError('OpenRouter API key is required', 'openrouter');
    }

    (this as any).baseUrl = this.config.apiUrl || 'https://openrouter.ai/api/v1';
    (this as any).headers = {
      Authorization: `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    } as Record<string, string>;

    if (this.config.providerOptions?.referer) {
      (this as any).headers['HTTP-Referer'] = this.config.providerOptions.referer;
    }
    if (this.config.providerOptions?.title) {
      (this as any).headers['X-Title'] = this.config.providerOptions.title;
    }
  }
}
