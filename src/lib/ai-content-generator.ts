import { GridElement } from '@/types/slide-builder';
import { ContentGenerationOptions } from './ai-assistant';

// Content generation types
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'education' | 'marketing' | 'technical' | 'creative';
  structure: ContentStructure[];
  variables: TemplateVariable[];
}

export interface ContentStructure {
  type: 'title' | 'subtitle' | 'paragraph' | 'bullet_points' | 'call_to_action';
  required: boolean;
  maxLength?: number;
  suggestions?: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface GenerationRequest {
  type: 'slide' | 'presentation' | 'section' | 'element';
  template?: string;
  context: GenerationContext;
  options: ContentGenerationOptions;
  variables?: Record<string, any>;
}

export interface GenerationContext {
  topic?: string;
  keywords?: string[];
  existingContent?: string;
  slidePosition?: number;
  totalSlides?: number;
  targetAudience?: string;
  presentationGoal?: string;
}

export interface GenerationResult {
  success: boolean;
  content?: GeneratedContent;
  slides?: GridElement[][];
  error?: string;
  suggestions?: string[];
  metadata?: {
    wordsGenerated: number;
    slidesCreated: number;
    processingTime: number;
  };
}

export interface GeneratedContent {
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
  callToAction?: string;
  speakerNotes?: string;
}

export class AIContentGenerator {
  private openaiApiKey: string;
  private templates: Map<string, ContentTemplate> = new Map();

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.initializeTemplates();
  }

  /**
   * Initialize predefined content templates
   */
  private initializeTemplates(): void {
    const templates: ContentTemplate[] = [
      {
        id: 'business-pitch',
        name: 'Business Pitch',
        description: 'Professional business pitch presentation',
        category: 'business',
        structure: [
          { type: 'title', required: true },
          { type: 'subtitle', required: false },
          { type: 'paragraph', required: true, maxLength: 200 },
          { type: 'bullet_points', required: true },
          { type: 'call_to_action', required: true },
        ],
        variables: [
          { name: 'companyName', type: 'text', required: true },
          { name: 'industry', type: 'text', required: true },
          { name: 'targetMarket', type: 'text', required: false },
        ],
      },
      {
        id: 'educational-lesson',
        name: 'Educational Lesson',
        description: 'Structured educational content',
        category: 'education',
        structure: [
          { type: 'title', required: true },
          { type: 'paragraph', required: true, maxLength: 150 },
          { type: 'bullet_points', required: true },
          { type: 'paragraph', required: false, maxLength: 100 },
        ],
        variables: [
          { name: 'subject', type: 'text', required: true },
          { name: 'gradeLevel', type: 'select', required: true, options: ['Elementary', 'Middle School', 'High School', 'College', 'Adult'] },
          { name: 'duration', type: 'number', required: false, defaultValue: 30 },
        ],
      },
      {
        id: 'product-showcase',
        name: 'Product Showcase',
        description: 'Product or service presentation',
        category: 'marketing',
        structure: [
          { type: 'title', required: true },
          { type: 'subtitle', required: false },
          { type: 'paragraph', required: true, maxLength: 180 },
          { type: 'bullet_points', required: true },
          { type: 'call_to_action', required: true },
        ],
        variables: [
          { name: 'productName', type: 'text', required: true },
          { name: 'keyBenefits', type: 'text', required: true },
          { name: 'targetCustomer', type: 'text', required: false },
        ],
      },
      {
        id: 'technical-overview',
        name: 'Technical Overview',
        description: 'Technical documentation or explanation',
        category: 'technical',
        structure: [
          { type: 'title', required: true },
          { type: 'paragraph', required: true, maxLength: 200 },
          { type: 'bullet_points', required: true },
          { type: 'paragraph', required: false, maxLength: 150 },
        ],
        variables: [
          { name: 'technology', type: 'text', required: true },
          { name: 'complexity', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
          { name: 'includeCode', type: 'boolean', required: false, defaultValue: false },
        ],
      },
      {
        id: 'creative-story',
        name: 'Creative Story',
        description: 'Narrative or storytelling presentation',
        category: 'creative',
        structure: [
          { type: 'title', required: true },
          { type: 'paragraph', required: true, maxLength: 250 },
          { type: 'paragraph', required: true, maxLength: 250 },
          { type: 'paragraph', required: false, maxLength: 200 },
        ],
        variables: [
          { name: 'theme', type: 'text', required: true },
          { name: 'mood', type: 'select', required: false, options: ['Inspiring', 'Dramatic', 'Humorous', 'Mysterious', 'Uplifting'] },
          { name: 'includeImages', type: 'boolean', required: false, defaultValue: true },
        ],
      },
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Generate content based on request
   */
  async generateContent(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      switch (request.type) {
        case 'slide':
          return await this.generateSlideContent(request);
        case 'presentation':
          return await this.generatePresentationContent(request);
        case 'section':
          return await this.generateSectionContent(request);
        case 'element':
          return await this.generateElementContent(request);
        default:
          throw new Error(`Unsupported generation type: ${request.type}`);
      }
    } catch (error) {
      console.error('Content generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          wordsGenerated: 0,
          slidesCreated: 0,
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Generate content for a single slide
   */
  private async generateSlideContent(request: GenerationRequest): Promise<GenerationResult> {
    const template = request.template ? this.templates.get(request.template) : null;
    const prompt = this.buildSlidePrompt(request, template);
    
    const generatedText = await this.callOpenAI(prompt);
    const content = this.parseGeneratedContent(generatedText, template);
    const slide = this.createSlideFromContent(content, request.options);

    return {
      success: true,
      content,
      slides: [slide],
      metadata: {
        wordsGenerated: this.countWords(generatedText),
        slidesCreated: 1,
        processingTime: 0,
      },
    };
  }

  /**
   * Generate content for an entire presentation
   */
  private async generatePresentationContent(request: GenerationRequest): Promise<GenerationResult> {
    const slideCount = request.context.totalSlides || 5;
    const slides: GridElement[][] = [];
    let totalWords = 0;

    // Generate title slide
    const titleSlide = await this.generateTitleSlide(request);
    slides.push(titleSlide);

    // Generate content slides
    for (let i = 1; i < slideCount - 1; i++) {
      const slideRequest = {
        ...request,
        context: {
          ...request.context,
          slidePosition: i,
          totalSlides: slideCount,
        },
      };
      
      const slideResult = await this.generateSlideContent(slideRequest);
      if (slideResult.slides) {
        slides.push(...slideResult.slides);
        totalWords += slideResult.metadata?.wordsGenerated || 0;
      }
    }

    // Generate conclusion slide
    const conclusionSlide = await this.generateConclusionSlide(request);
    slides.push(conclusionSlide);

    return {
      success: true,
      slides,
      metadata: {
        wordsGenerated: totalWords,
        slidesCreated: slides.length,
        processingTime: 0,
      },
    };
  }

  /**
   * Generate content for a section
   */
  private async generateSectionContent(request: GenerationRequest): Promise<GenerationResult> {
    // Similar to presentation but for a specific section
    return await this.generatePresentationContent({
      ...request,
      context: {
        ...request.context,
        totalSlides: 3, // Smaller section
      },
    });
  }

  /**
   * Generate content for a specific element
   */
  private async generateElementContent(request: GenerationRequest): Promise<GenerationResult> {
    const prompt = this.buildElementPrompt(request);
    const generatedText = await this.callOpenAI(prompt);
    
    return {
      success: true,
      content: { paragraphs: [generatedText] },
      metadata: {
        wordsGenerated: this.countWords(generatedText),
        slidesCreated: 0,
        processingTime: 0,
      },
    };
  }

  /**
   * Build prompt for slide generation
   */
  private buildSlidePrompt(request: GenerationRequest, template?: ContentTemplate | null): string {
    let prompt = `Generate content for a presentation slide with the following specifications:

Topic: ${request.context.topic || 'General presentation'}
Audience: ${request.options.audience}
Tone: ${request.options.tone}
Length: ${request.options.length}
Purpose: ${request.options.purpose}`;

    if (template) {
      prompt += `\n\nTemplate: ${template.name} - ${template.description}`;
      prompt += `\nRequired structure: ${template.structure.map(s => s.type).join(', ')}`;
    }

    if (request.context.keywords?.length) {
      prompt += `\nKeywords to include: ${request.context.keywords.join(', ')}`;
    }

    if (request.variables) {
      prompt += `\nTemplate variables: ${JSON.stringify(request.variables)}`;
    }

    prompt += `\n\nPlease generate appropriate content following the specified structure and requirements.`;

    return prompt;
  }

  /**
   * Build prompt for element generation
   */
  private buildElementPrompt(request: GenerationRequest): string {
    return `Generate ${request.options.length} content for a presentation element:

Context: ${request.context.topic || 'General topic'}
Tone: ${request.options.tone}
Audience: ${request.options.audience}
Existing content: ${request.context.existingContent || 'None'}

Generate engaging, relevant content that fits the context and requirements.`;
  }

  /**
   * Call OpenAI API or return mock content
   */
  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.openaiApiKey || typeof fetch === 'undefined') {
      return this.generateMockContent(prompt);
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
            {
              role: 'system',
              content: 'You are an expert content creator for presentations. Generate clear, engaging, and well-structured content.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      // Fallback to mock content if fetch fails
      return this.generateMockContent(prompt);
    }
  }

  /**
   * Generate mock content for testing
   */
  private generateMockContent(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('business') || lowerPrompt.includes('pitch')) {
      return `**Transforming Business Through Innovation**

Our revolutionary approach combines cutting-edge technology with proven business strategies to deliver exceptional results.

• Increase efficiency by 40% through automated workflows
• Reduce costs while improving quality and customer satisfaction  
• Scale operations seamlessly with our cloud-based platform
• Access real-time analytics and insights for better decision making

**Ready to transform your business? Let's discuss how we can help you achieve your goals.**`;
    }
    
    if (lowerPrompt.includes('education') || lowerPrompt.includes('lesson')) {
      return `**Understanding Data Visualization**

Data visualization transforms complex information into clear, actionable insights that drive better decision-making.

• Charts and graphs make patterns immediately visible
• Interactive dashboards enable real-time monitoring
• Visual storytelling engages audiences more effectively
• Proper design principles ensure clarity and accuracy

Effective visualization bridges the gap between raw data and meaningful understanding.`;
    }
    
    if (lowerPrompt.includes('technical') || lowerPrompt.includes('overview')) {
      return `**API Integration Best Practices**

Modern applications rely on seamless API integration to deliver rich, connected experiences.

• RESTful design principles ensure scalability and maintainability
• Proper authentication and security protocols protect sensitive data
• Error handling and retry logic improve reliability
• Comprehensive documentation accelerates development

Following these practices results in robust, efficient integrations that stand the test of time.`;
    }
    
    return `**Engaging Presentation Content**

Creating compelling presentations requires balancing information with visual appeal and audience engagement.

• Clear structure guides viewers through your message
• Visual elements support and enhance key points
• Concise language keeps attention focused
• Interactive elements encourage participation

**The result is memorable, impactful communication that achieves your objectives.**`;
  }

  /**
   * Parse generated content into structured format
   */
  private parseGeneratedContent(text: string, template?: ContentTemplate | null): GeneratedContent {
    const content: GeneratedContent = {};
    
    // Extract title (usually the first bold text or line)
    const titleMatch = text.match(/\*\*(.*?)\*\*/);
    if (titleMatch) {
      content.title = titleMatch[1];
    }
    
    // Extract bullet points
    const bulletMatches = text.match(/^[•\-\*]\s+(.+)$/gm);
    if (bulletMatches) {
      content.bulletPoints = bulletMatches.map(match => 
        match.replace(/^[•\-\*]\s+/, '').trim()
      );
    }
    
    // Extract paragraphs (non-bullet, non-title text)
    const paragraphs = text
      .split('\n')
      .filter(line => 
        line.trim() && 
        !line.match(/^\*\*.*\*\*$/) && 
        !line.match(/^[•\-\*]\s+/)
      )
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (paragraphs.length > 0) {
      content.paragraphs = paragraphs;
    }
    
    // Extract call to action (usually the last bold text)
    const ctaMatches = text.match(/\*\*(.*?)\*\*/g);
    if (ctaMatches && ctaMatches.length > 1) {
      content.callToAction = ctaMatches[ctaMatches.length - 1].replace(/\*\*/g, '');
    }
    
    return content;
  }

  /**
   * Create slide elements from generated content
   */
  private createSlideFromContent(content: GeneratedContent, options: ContentGenerationOptions): GridElement[] {
    const elements: GridElement[] = [];
    let yPosition = 1;

    // Add title
    if (content.title) {
      elements.push({
        id: `title-${Date.now()}`,
        type: 'title',
        x: 1,
        y: yPosition,
        w: 10,
        h: 1,
        props: {
          text: content.title,
          level: 1,
        },
      });
      yPosition += 2;
    }

    // Add subtitle
    if (content.subtitle) {
      elements.push({
        id: `subtitle-${Date.now()}`,
        type: 'text',
        x: 1,
        y: yPosition,
        w: 10,
        h: 1,
        props: {
          text: content.subtitle,
        },
      });
      yPosition += 1;
    }

    // Add paragraphs
    if (content.paragraphs) {
      content.paragraphs.forEach((paragraph, index) => {
        elements.push({
          id: `paragraph-${Date.now()}-${index}`,
          type: 'paragraph',
          x: 1,
          y: yPosition,
          w: 10,
          h: 2,
          props: {
            text: paragraph,
          },
        });
        yPosition += 2;
      });
    }

    // Add bullet points
    if (content.bulletPoints) {
      const bulletText = content.bulletPoints.map(point => `• ${point}`).join('\n');
      elements.push({
        id: `bullets-${Date.now()}`,
        type: 'paragraph',
        x: 1,
        y: yPosition,
        w: 10,
        h: Math.min(content.bulletPoints.length, 4),
        props: {
          text: bulletText,
        },
      });
      yPosition += Math.min(content.bulletPoints.length, 4);
    }

    // Add call to action
    if (content.callToAction) {
      elements.push({
        id: `cta-${Date.now()}`,
        type: 'text',
        x: 1,
        y: Math.min(yPosition, 10),
        w: 10,
        h: 1,
        props: {
          text: content.callToAction,
        },
      });
    }

    return elements;
  }

  /**
   * Generate title slide
   */
  private async generateTitleSlide(request: GenerationRequest): Promise<GridElement[]> {
    const titlePrompt = `Generate a compelling title and subtitle for a presentation about: ${request.context.topic}
    
Audience: ${request.options.audience}
Tone: ${request.options.tone}
Purpose: ${request.options.purpose}

Format as:
**Title**
Subtitle`;

    const content = await this.callOpenAI(titlePrompt);
    const parsed = this.parseGeneratedContent(content);
    
    return [
      {
        id: 'title-slide-title',
        type: 'title',
        x: 1,
        y: 4,
        w: 10,
        h: 2,
        props: {
          text: parsed.title || request.context.topic || 'Presentation Title',
          level: 1,
        },
      },
      {
        id: 'title-slide-subtitle',
        type: 'text',
        x: 1,
        y: 6,
        w: 10,
        h: 1,
        props: {
          text: parsed.paragraphs?.[0] || 'Subtitle',
        },
      },
    ];
  }

  /**
   * Generate conclusion slide
   */
  private async generateConclusionSlide(request: GenerationRequest): Promise<GridElement[]> {
    const conclusionPrompt = `Generate a strong conclusion for a presentation about: ${request.context.topic}
    
Include:
- Key takeaways
- Call to action
- Next steps

Tone: ${request.options.tone}
Purpose: ${request.options.purpose}`;

    const content = await this.callOpenAI(conclusionPrompt);
    const parsed = this.parseGeneratedContent(content);
    
    return this.createSlideFromContent(parsed, request.options);
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Get available templates
   */
  getTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): ContentTemplate | undefined {
    return this.templates.get(id);
  }
}

// Export singleton instance
export const aiContentGenerator = new AIContentGenerator();
