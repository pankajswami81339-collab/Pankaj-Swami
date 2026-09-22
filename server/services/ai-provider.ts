import { GoogleGenAI } from '@google/genai';

export interface AILeadQualificationResult {
  score: number; // 0 to 100
  intent: 'HIGH_PURCHASE_INTENT' | 'CONSIDERING' | 'GENERAL_INQUIRY' | 'SPAM';
  reasoning: string;
  recommendedNextStep: 'ASSIGN_AGENT' | 'SEND_PRICING' | 'SCHEDULE_DEMO' | 'FOLLOW_UP_LATER';
}

export interface AIProvider {
  name: string;
  generateReply(params: {
    systemPrompt: string;
    userMessage: string;
    conversationHistory?: { sender: 'user' | 'assistant'; text: string }[];
    context?: Record<string, any>;
  }): Promise<string>;

  qualifyLead(params: {
    customerPhone: string;
    recentMessages: string[];
    customFields?: Record<string, any>;
  }): Promise<AILeadQualificationResult>;

  classifyIntent(params: {
    messageText: string;
    candidateIntents: string[];
  }): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.warn('⚠️ [GeminiProvider] Initialization warning:', err);
      }
    }
  }

  async generateReply(params: {
    systemPrompt: string;
    userMessage: string;
    conversationHistory?: { sender: 'user' | 'assistant'; text: string }[];
    context?: Record<string, any>;
  }): Promise<string> {
    if (!this.ai) {
      return this.fallbackReply(params.userMessage);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${params.systemPrompt}\n\nCustomer Message: ${params.userMessage}` }] },
        ],
      });
      return response.text || 'Thank you for reaching out to ADSCALE ZEN. How can we assist your business today?';
    } catch (err) {
      console.warn('⚠️ [GeminiProvider] API call failed, using graceful fallback:', err);
      return this.fallbackReply(params.userMessage);
    }
  }

  async qualifyLead(params: {
    customerPhone: string;
    recentMessages: string[];
    customFields?: Record<string, any>;
  }): Promise<AILeadQualificationResult> {
    const textHistory = params.recentMessages.join('\n');
    const isHighIntent =
      /pricing|price|demo|cost|buy|quote|enterprise|order/i.test(textHistory) ||
      (params.customFields && params.customFields.lifetime_value);

    return {
      score: isHighIntent ? 85 : 45,
      intent: isHighIntent ? 'HIGH_PURCHASE_INTENT' : 'GENERAL_INQUIRY',
      reasoning: isHighIntent
        ? 'Customer actively requested commercial pricing or product demonstrations.'
        : 'General exploratory conversation with standard customer inquiry.',
      recommendedNextStep: isHighIntent ? 'ASSIGN_AGENT' : 'SEND_PRICING',
    };
  }

  async classifyIntent(params: {
    messageText: string;
    candidateIntents: string[];
  }): Promise<string> {
    const lower = params.messageText.toLowerCase();
    for (const intent of params.candidateIntents) {
      if (lower.includes(intent.toLowerCase())) {
        return intent;
      }
    }
    return params.candidateIntents[0] || 'GENERAL';
  }

  private fallbackReply(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('pricing') || lower.includes('cost')) {
      return 'Hello! ADSCALE ZEN plans start from $29/mo with unlimited WhatsApp automation. Check our plans at https://adscalezen.online/pricing.';
    }
    if (lower.includes('demo') || lower.includes('call')) {
      return 'We would love to demonstrate ADSCALE ZEN live! Our team is available today at https://adscalezen.online/demo.';
    }
    return 'Thank you for contacting ADSCALE ZEN! An automation specialist will be in touch shortly.';
  }
}

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async generateReply(params: {
    systemPrompt: string;
    userMessage: string;
    conversationHistory?: { sender: 'user' | 'assistant'; text: string }[];
    context?: Record<string, any>;
  }): Promise<string> {
    // If OpenAI key is present, can call standard endpoint, or fallback to Gemini
    if (!this.apiKey) {
      const gemini = new GeminiProvider();
      return gemini.generateReply(params);
    }
    // OpenAI implementation abstraction
    return `[OpenAI Assistant]: Thank you for contacting ADSCALE ZEN. Regarding: "${params.userMessage}", our representative will follow up immediately.`;
  }

  async qualifyLead(params: {
    customerPhone: string;
    recentMessages: string[];
    customFields?: Record<string, any>;
  }): Promise<AILeadQualificationResult> {
    const gemini = new GeminiProvider();
    return gemini.qualifyLead(params);
  }

  async classifyIntent(params: {
    messageText: string;
    candidateIntents: string[];
  }): Promise<string> {
    const gemini = new GeminiProvider();
    return gemini.classifyIntent(params);
  }
}

export function getAIProvider(preferredProvider?: string): AIProvider {
  if (preferredProvider === 'openai') {
    return new OpenAIProvider();
  }
  return new GeminiProvider();
}
