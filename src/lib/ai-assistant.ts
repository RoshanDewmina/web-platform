import { GridElement } from '@/types/slide-builder';
import { DocumentContent } from '@/lib/document-processor';

// AI Assistant types
export interface AIContext {
  currentSlide?: GridElement[];
  allSlides?: GridElement[][];
  selectedElements?: string[];
  documentContent?: DocumentContent;
  userPreferences?: UserPreferences;
  sessionHistory?: ConversationTurn[];
}

export interface UserPreferences {
  preferredStyle: 'professional' | 'creative' | 'minimal' | 'academic';
  colorScheme: 'light' | 'dark' | 'auto';
  fontPreference: 'serif' | 'sans-serif' | 'monospace';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  aiAssistanceLevel: 'minimal' | 'moderate' | 'extensive';
}

export interface ConversationTurn {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  context?: AIContext;
  actions?: AIAction[];
}

export interface AIAction {
  type: 'create_slide' | 'modify_element' | 'suggest_content' | 'apply_style' | 'generate_layout';
  target?: string;
  parameters: Record<string, any>;
  description: string;
}

export interface AIResponse {
  message: string;
  suggestions?: AISuggestion[];
  actions?: AIAction[];
  confidence: number;
  reasoning?: string;
}

export interface AISuggestion {
  id: string;
  type: 'content' | 'layout' | 'style' | 'structure';
  title: string;
  description: string;
  preview?: string;
  action: AIAction;
  confidence: number;
}

export interface ContentGenerationOptions {
  tone: 'formal' | 'casual' | 'persuasive' | 'educational' | 'technical';
  length: 'brief' | 'moderate' | 'detailed';
  audience: 'general' | 'technical' | 'executive' | 'academic' | 'students';
  purpose: 'inform' | 'persuade' | 'educate' | 'entertain' | 'sell';
}

export class AIAssistant {
  private openaiApiKey: string;
  private conversationHistory: ConversationTurn[] = [];
  private currentContext: AIContext = {};

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  /**
   * Update the current context for the AI assistant
   */
  updateContext(context: Partial<AIContext>): void {
    this.currentContext = { ...this.currentContext, ...context };
  }

  /**
   * Process a user message and generate an AI response
   */
  async processMessage(
    message: string,
    context?: Partial<AIContext>
  ): Promise<AIResponse> {
    // Update context if provided
    if (context) {
      this.updateContext(context);
    }

    try {
      // Prepare the conversation context
      const systemPrompt = this.buildSystemPrompt();
      const conversationContext = this.buildConversationContext();
      
      // Generate AI response
      const response = await this.generateResponse(message, systemPrompt, conversationContext);
      
      // Parse and structure the response
      const aiResponse = this.parseAIResponse(response);
      
      // Add to conversation history
      const turn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        timestamp: new Date(),
        userMessage: message,
        aiResponse: aiResponse.message,
        context: { ...this.currentContext },
        actions: aiResponse.actions,
      };
      
      this.conversationHistory.push(turn);
      
      return aiResponse;
    } catch (error) {
      console.error('AI Assistant error:', error);
      return {
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        confidence: 0,
        suggestions: [],
        actions: [],
      };
    }
  }

  /**
   * Generate content suggestions based on context
   */
  async generateContentSuggestions(
    type: 'title' | 'paragraph' | 'bullet_points' | 'conclusion',
    options: ContentGenerationOptions
  ): Promise<AISuggestion[]> {
    try {
      const prompt = this.buildContentGenerationPrompt(type, options);
      const response = await this.generateResponse(prompt, this.buildSystemPrompt(), '');
      
      return this.parseContentSuggestions(response, type);
    } catch (error) {
      console.error('Content generation error:', error);
      return [];
    }
  }

  /**
   * Analyze slide content and provide improvement suggestions
   */
  async analyzeSlideContent(slide: GridElement[]): Promise<AISuggestion[]> {
    try {
      const slideAnalysis = this.analyzeSlideStructure(slide);
      const prompt = this.buildAnalysisPrompt(slideAnalysis);
      const response = await this.generateResponse(prompt, this.buildSystemPrompt(), '');
      
      return this.parseAnalysisSuggestions(response);
    } catch (error) {
      console.error('Slide analysis error:', error);
      return [];
    }
  }

  /**
   * Generate layout suggestions based on content
   */
  async generateLayoutSuggestions(
    content: string,
    slideType: 'title' | 'content' | 'comparison' | 'data'
  ): Promise<AISuggestion[]> {
    try {
      const prompt = this.buildLayoutPrompt(content, slideType);
      const response = await this.generateResponse(prompt, this.buildSystemPrompt(), '');
      
      return this.parseLayoutSuggestions(response, slideType);
    } catch (error) {
      console.error('Layout generation error:', error);
      return [];
    }
  }

  /**
   * Build system prompt for the AI assistant
   */
  private buildSystemPrompt(): string {
    return `You are an expert AI assistant for a visual slide builder platform. Your role is to help users create, edit, and improve their presentations.

Key capabilities:
- Analyze slide content and structure
- Suggest improvements for clarity, engagement, and visual appeal
- Generate content for titles, paragraphs, bullet points, and conclusions
- Recommend layout changes and element positioning
- Provide styling and formatting suggestions
- Help with content organization and flow

Guidelines:
- Always consider the user's context (current slide, selected elements, preferences)
- Provide specific, actionable suggestions
- Explain your reasoning when making recommendations
- Adapt your tone and suggestions to the user's preferences and audience
- Focus on creating clear, engaging, and visually appealing presentations
- Consider accessibility and best practices in design

Current context: ${JSON.stringify(this.currentContext, null, 2)}`;
  }

  /**
   * Build conversation context from history
   */
  private buildConversationContext(): string {
    const recentTurns = this.conversationHistory.slice(-5); // Last 5 turns
    
    return recentTurns.map(turn => 
      `User: ${turn.userMessage}\nAssistant: ${turn.aiResponse}`
    ).join('\n\n');
  }

  /**
   * Generate AI response using OpenAI API
   */
  private async generateResponse(
    message: string,
    systemPrompt: string,
    conversationContext: string
  ): Promise<string> {
    if (!this.openaiApiKey || typeof fetch === 'undefined') {
      // Mock response for testing
      return this.generateMockResponse(message);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${conversationContext}\n\nUser: ${message}` },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      // Fallback to mock response if fetch fails
      return this.generateMockResponse(message);
    }
  }

  /**
   * Generate mock response for testing
   */
  private generateMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('title') || lowerMessage.includes('heading')) {
      return `I can help you create an engaging title! Based on your content, here are some suggestions:

1. **"Transforming Ideas into Action"** - A dynamic title that suggests progress and implementation
2. **"Key Insights & Strategic Directions"** - Professional and informative
3. **"Innovation Through Collaboration"** - Emphasizes teamwork and creativity

Would you like me to help you refine any of these or create variations based on your specific topic?`;
    }
    
    if (lowerMessage.includes('layout') || lowerMessage.includes('design')) {
      return `For your slide layout, I recommend:

**Current Analysis:**
- Your slide has good content but could benefit from better visual hierarchy
- Consider using a 2-column layout to balance text and visuals

**Suggestions:**
1. **Move your title to the top-left** for better reading flow
2. **Add visual elements** like icons or images to break up text
3. **Use consistent spacing** between elements for a cleaner look

Would you like me to apply any of these changes automatically?`;
    }
    
    if (lowerMessage.includes('content') || lowerMessage.includes('text')) {
      return `I can help improve your content! Here's what I notice:

**Strengths:**
- Clear main message
- Good information structure

**Suggestions for improvement:**
1. **Make your opening more engaging** - Start with a question or compelling statement
2. **Use bullet points** for better readability
3. **Add a clear call-to-action** at the end

Would you like me to rewrite any specific sections or generate new content for your slide?`;
    }
    
    return `I'm here to help you create amazing presentations! I can assist with:

• **Content creation** - Generate titles, paragraphs, and bullet points
• **Layout optimization** - Improve visual hierarchy and element positioning  
• **Style suggestions** - Enhance colors, fonts, and overall design
• **Content analysis** - Review and improve existing slides

What would you like to work on today?`;
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(response: string): AIResponse {
    // Simple parsing - in a real implementation, you might use more sophisticated NLP
    const suggestions: AISuggestion[] = [];
    const actions: AIAction[] = [];
    
    // Extract suggestions (look for numbered lists or bullet points)
    const suggestionMatches = response.match(/\d+\.\s*\*\*(.*?)\*\*(.*?)(?=\d+\.|$)/g);
    if (suggestionMatches) {
      suggestionMatches.forEach((match, index) => {
        const titleMatch = match.match(/\*\*(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1] : `Suggestion ${index + 1}`;
        const description = match.replace(/\d+\.\s*\*\*.*?\*\*/, '').trim();
        
        suggestions.push({
          id: `suggestion-${index}`,
          type: 'content',
          title,
          description,
          action: {
            type: 'suggest_content',
            parameters: { suggestion: description },
            description: title,
          },
          confidence: 0.8,
        });
      });
    }
    
    // If no suggestions found, create a default one
    if (suggestions.length === 0) {
      suggestions.push({
        id: 'default-suggestion',
        type: 'content',
        title: 'General Improvement',
        description: 'Consider reviewing and refining your content for better clarity and impact.',
        action: {
          type: 'suggest_content',
          parameters: { suggestion: 'Review content' },
          description: 'General improvement suggestion',
        },
        confidence: 0.7,
      });
    }
    
    return {
      message: response,
      suggestions,
      actions,
      confidence: 0.8,
    };
  }

  /**
   * Build content generation prompt
   */
  private buildContentGenerationPrompt(
    type: string,
    options: ContentGenerationOptions
  ): string {
    return `Generate ${type} content with the following specifications:
- Tone: ${options.tone}
- Length: ${options.length}
- Audience: ${options.audience}
- Purpose: ${options.purpose}

Context: ${JSON.stringify(this.currentContext.documentContent?.title || 'General presentation')}

Please provide 3-5 variations that would work well for this context.`;
  }

  /**
   * Parse content suggestions from AI response
   */
  private parseContentSuggestions(response: string, type: string): AISuggestion[] {
    // Mock implementation - parse the response into suggestions
    const suggestions: AISuggestion[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        suggestions.push({
          id: `content-${type}-${index}`,
          type: 'content',
          title: `${type} Option ${index + 1}`,
          description: line.trim(),
          action: {
            type: 'suggest_content',
            parameters: { content: line.trim(), type },
            description: `Apply ${type} suggestion`,
          },
          confidence: 0.8,
        });
      }
    });
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Analyze slide structure
   */
  private analyzeSlideStructure(slide: GridElement[]): any {
    return {
      elementCount: slide.length,
      hasTitle: slide.some(el => el.type === 'title'),
      hasText: slide.some(el => el.type === 'paragraph' || el.type === 'text'),
      hasMedia: slide.some(el => el.type === 'image' || el.type === 'video'),
      layout: 'mixed', // Could be more sophisticated
    };
  }

  /**
   * Build analysis prompt
   */
  private buildAnalysisPrompt(analysis: any): string {
    return `Analyze this slide structure and provide improvement suggestions:
${JSON.stringify(analysis, null, 2)}

Focus on:
- Visual hierarchy and layout
- Content balance and readability
- Engagement and clarity
- Accessibility considerations`;
  }

  /**
   * Parse analysis suggestions
   */
  private parseAnalysisSuggestions(response: string): AISuggestion[] {
    // Mock implementation
    return [
      {
        id: 'analysis-1',
        type: 'layout',
        title: 'Improve Visual Hierarchy',
        description: 'Consider making your title larger and adding more spacing between elements',
        action: {
          type: 'apply_style',
          parameters: { improvements: ['title-size', 'spacing'] },
          description: 'Apply visual hierarchy improvements',
        },
        confidence: 0.9,
      },
    ];
  }

  /**
   * Build layout prompt
   */
  private buildLayoutPrompt(content: string, slideType: string): string {
    return `Suggest optimal layouts for a ${slideType} slide with this content:
"${content.substring(0, 200)}..."

Consider:
- Content type and amount
- Visual balance and hierarchy
- User engagement
- Accessibility`;
  }

  /**
   * Parse layout suggestions
   */
  private parseLayoutSuggestions(response: string, slideType: string): AISuggestion[] {
    // Mock implementation
    return [
      {
        id: `layout-${slideType}-1`,
        type: 'layout',
        title: 'Two-Column Layout',
        description: 'Split content into two balanced columns for better readability',
        action: {
          type: 'generate_layout',
          parameters: { layout: 'two-column', slideType },
          description: 'Apply two-column layout',
        },
        confidence: 0.85,
      },
    ];
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ConversationTurn[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get current context
   */
  getCurrentContext(): AIContext {
    return { ...this.currentContext };
  }
}

// Export singleton instance
export const aiAssistant = new AIAssistant();
