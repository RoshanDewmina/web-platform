import { GridElement } from '@/types/slide-builder';
import { AISuggestion, AIAction } from './ai-assistant';

// Smart suggestions types
export interface SuggestionContext {
  currentSlide: GridElement[];
  allSlides?: GridElement[][];
  selectedElements?: string[];
  userActivity?: UserActivity[];
  contentAnalysis?: ContentAnalysis;
}

export interface UserActivity {
  action: 'create' | 'edit' | 'delete' | 'move' | 'resize';
  elementType: string;
  timestamp: Date;
  duration?: number;
}

export interface ContentAnalysis {
  readabilityScore: number;
  engagementScore: number;
  visualBalance: number;
  accessibility: AccessibilityCheck[];
  seoScore?: number;
}

export interface AccessibilityCheck {
  type: 'color_contrast' | 'font_size' | 'alt_text' | 'heading_structure';
  status: 'pass' | 'warning' | 'fail';
  message: string;
  suggestion?: string;
}

export interface SuggestionRule {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'design' | 'accessibility' | 'engagement' | 'structure';
  priority: 'low' | 'medium' | 'high' | 'critical';
  condition: (context: SuggestionContext) => boolean;
  generateSuggestion: (context: SuggestionContext) => AISuggestion;
}

export interface SmartSuggestionsConfig {
  enableRealTime: boolean;
  categories: string[];
  maxSuggestions: number;
  minConfidence: number;
  autoApply: boolean;
}

export class SmartSuggestions {
  private rules: Map<string, SuggestionRule> = new Map();
  private config: SmartSuggestionsConfig = {
    enableRealTime: true,
    categories: ['content', 'design', 'accessibility', 'engagement', 'structure'],
    maxSuggestions: 5,
    minConfidence: 0.6,
    autoApply: false,
  };

  constructor() {
    this.initializeRules();
  }

  /**
   * Initialize suggestion rules
   */
  private initializeRules(): void {
    const rules: SuggestionRule[] = [
      // Content suggestions
      {
        id: 'title-missing',
        name: 'Add Title',
        description: 'Slide should have a clear title',
        category: 'content',
        priority: 'high',
        condition: (context) => !context.currentSlide.some(el => el.type === 'title'),
        generateSuggestion: (context) => ({
          id: 'add-title',
          type: 'content',
          title: 'Add a Title',
          description: 'Every slide should have a clear, descriptive title to help guide your audience.',
          action: {
            type: 'create_slide',
            parameters: {
              elementType: 'title',
              position: { x: 1, y: 1 },
              size: { w: 10, h: 1 },
              props: { text: 'Slide Title', level: 2 },
            },
            description: 'Add title element',
          },
          confidence: 0.9,
        }),
      },
      
      // Design suggestions
      {
        id: 'too-much-text',
        name: 'Reduce Text Density',
        description: 'Slide has too much text for optimal readability',
        category: 'design',
        priority: 'medium',
        condition: (context) => {
          const textElements = context.currentSlide.filter(el => 
            el.type === 'paragraph' || el.type === 'text'
          );
          const totalText = textElements.reduce((sum, el) => 
            sum + (el.props.text?.length || 0), 0
          );
          return totalText > 500; // More than 500 characters
        },
        generateSuggestion: (context) => ({
          id: 'reduce-text',
          type: 'content',
          title: 'Reduce Text Density',
          description: 'Consider breaking this content into multiple slides or using bullet points for better readability.',
          action: {
            type: 'suggest_content',
            parameters: { action: 'split_content' },
            description: 'Split content across multiple slides',
          },
          confidence: 0.8,
        }),
      },

      // Visual balance
      {
        id: 'unbalanced-layout',
        name: 'Improve Visual Balance',
        description: 'Elements are clustered in one area',
        category: 'design',
        priority: 'medium',
        condition: (context) => {
          // Simple check: if all elements are in the same quadrant
          const leftSide = context.currentSlide.filter(el => el.x < 6);
          const rightSide = context.currentSlide.filter(el => el.x >= 6);
          return Math.abs(leftSide.length - rightSide.length) > 2;
        },
        generateSuggestion: (context) => ({
          id: 'balance-layout',
          type: 'layout',
          title: 'Balance Your Layout',
          description: 'Distribute elements more evenly across the slide for better visual balance.',
          action: {
            type: 'generate_layout',
            parameters: { layout: 'balanced' },
            description: 'Redistribute elements for better balance',
          },
          confidence: 0.7,
        }),
      },

      // Accessibility
      {
        id: 'missing-alt-text',
        name: 'Add Alt Text',
        description: 'Images should have descriptive alt text',
        category: 'accessibility',
        priority: 'high',
        condition: (context) => {
          return context.currentSlide.some(el => 
            el.type === 'image' && !el.props.alt
          );
        },
        generateSuggestion: (context) => ({
          id: 'add-alt-text',
          type: 'content',
          title: 'Add Alt Text to Images',
          description: 'Provide descriptive alt text for images to improve accessibility for screen readers.',
          action: {
            type: 'modify_element',
            parameters: { property: 'alt', action: 'add_alt_text' },
            description: 'Add alt text to images',
          },
          confidence: 0.95,
        }),
      },

      // Engagement
      {
        id: 'static-content',
        name: 'Add Interactive Elements',
        description: 'Consider adding interactive elements to increase engagement',
        category: 'engagement',
        priority: 'low',
        condition: (context) => {
          const hasInteractive = context.currentSlide.some(el => 
            ['quiz', 'poll', 'interactive'].includes(el.type)
          );
          return !hasInteractive && context.currentSlide.length > 2;
        },
        generateSuggestion: (context) => ({
          id: 'add-interactive',
          type: 'content',
          title: 'Add Interactive Elements',
          description: 'Consider adding a quiz, poll, or interactive component to increase audience engagement.',
          action: {
            type: 'suggest_content',
            parameters: { elementType: 'interactive' },
            description: 'Add interactive element',
          },
          confidence: 0.6,
        }),
      },

      // Structure
      {
        id: 'heading-hierarchy',
        name: 'Fix Heading Hierarchy',
        description: 'Heading levels should follow logical order',
        category: 'structure',
        priority: 'medium',
        condition: (context) => {
          const headings = context.currentSlide
            .filter(el => el.type === 'title')
            .map(el => el.props.level || 1)
            .sort((a, b) => a - b);
          
          // Check if there are gaps in heading levels
          for (let i = 1; i < headings.length; i++) {
            if (headings[i] - headings[i-1] > 1) {
              return true;
            }
          }
          return false;
        },
        generateSuggestion: (context) => ({
          id: 'fix-headings',
          type: 'structure',
          title: 'Fix Heading Hierarchy',
          description: 'Ensure heading levels follow a logical order (H1, H2, H3) without skipping levels.',
          action: {
            type: 'modify_element',
            parameters: { action: 'fix_heading_levels' },
            description: 'Adjust heading levels',
          },
          confidence: 0.8,
        }),
      },

      // Color contrast
      {
        id: 'poor-contrast',
        name: 'Improve Color Contrast',
        description: 'Text may be difficult to read due to poor color contrast',
        category: 'accessibility',
        priority: 'high',
        condition: (context) => {
          // Simplified check - in real implementation, you'd analyze actual colors
          return context.currentSlide.some(el => 
            el.props.color && el.props.backgroundColor &&
            this.calculateContrast(el.props.color, el.props.backgroundColor) < 4.5
          );
        },
        generateSuggestion: (context) => ({
          id: 'improve-contrast',
          type: 'style',
          title: 'Improve Color Contrast',
          description: 'Increase color contrast between text and background for better readability.',
          action: {
            type: 'apply_style',
            parameters: { action: 'improve_contrast' },
            description: 'Adjust colors for better contrast',
          },
          confidence: 0.85,
        }),
      },

      // Content flow
      {
        id: 'logical-flow',
        name: 'Improve Content Flow',
        description: 'Content order could be more logical',
        category: 'structure',
        priority: 'medium',
        condition: (context) => {
          // Check if title comes after content
          const titleIndex = context.currentSlide.findIndex(el => el.type === 'title');
          const contentIndex = context.currentSlide.findIndex(el => 
            el.type === 'paragraph' || el.type === 'text'
          );
          return titleIndex > contentIndex && titleIndex !== -1 && contentIndex !== -1;
        },
        generateSuggestion: (context) => ({
          id: 'improve-flow',
          type: 'structure',
          title: 'Improve Content Flow',
          description: 'Consider reordering elements so the title appears before the main content.',
          action: {
            type: 'generate_layout',
            parameters: { action: 'reorder_elements' },
            description: 'Reorder elements for better flow',
          },
          confidence: 0.75,
        }),
      },
    ];

    rules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  /**
   * Generate suggestions for the current context
   */
  generateSuggestions(context: SuggestionContext): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    for (const rule of this.rules.values()) {
      // Check if rule category is enabled
      if (!this.config.categories.includes(rule.category)) {
        continue;
      }

      // Check if rule condition is met
      if (rule.condition(context)) {
        const suggestion = rule.generateSuggestion(context);
        
        // Filter by minimum confidence
        if (suggestion.confidence >= this.config.minConfidence) {
          suggestions.push(suggestion);
        }
      }
    }

    // Sort by priority and confidence
    suggestions.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = this.getPriorityForSuggestion(a.id);
      const bPriority = this.getPriorityForSuggestion(b.id);
      
      if (aPriority !== bPriority) {
        return priorityOrder[bPriority] - priorityOrder[aPriority];
      }
      
      return b.confidence - a.confidence;
    });

    // Limit number of suggestions
    return suggestions.slice(0, this.config.maxSuggestions);
  }

  /**
   * Analyze slide content for various metrics
   */
  analyzeContent(slide: GridElement[]): ContentAnalysis {
    const analysis: ContentAnalysis = {
      readabilityScore: this.calculateReadabilityScore(slide),
      engagementScore: this.calculateEngagementScore(slide),
      visualBalance: this.calculateVisualBalance(slide),
      accessibility: this.checkAccessibility(slide),
    };

    return analysis;
  }

  /**
   * Calculate readability score
   */
  private calculateReadabilityScore(slide: GridElement[]): number {
    const textElements = slide.filter(el => 
      el.type === 'paragraph' || el.type === 'text' || el.type === 'title'
    );

    if (textElements.length === 0) return 1.0;

    let score = 1.0;
    let totalText = 0;

    textElements.forEach(el => {
      const text = el.props.text || '';
      totalText += text.length;
      
      // Penalize very long sentences
      const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim());
      const avgSentenceLength = text.length / Math.max(sentences.length, 1);
      if (avgSentenceLength > 100) {
        score -= 0.1;
      }
      
      // Penalize complex words (simplified check)
      const words = text.split(/\s+/);
      const complexWords = words.filter((word: string) => word.length > 8).length;
      const complexityRatio = complexWords / Math.max(words.length, 1);
      if (complexityRatio > 0.3) {
        score -= 0.1;
      }
    });

    // Penalize slides with too much text
    if (totalText > 500) {
      score -= 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(slide: GridElement[]): number {
    let score = 0.5; // Base score

    // Bonus for visual elements
    const hasImages = slide.some(el => el.type === 'image');
    const hasCharts = slide.some(el => el.type === 'chart');
    const hasInteractive = slide.some(el => ['quiz', 'poll'].includes(el.type));

    if (hasImages) score += 0.2;
    if (hasCharts) score += 0.2;
    if (hasInteractive) score += 0.3;

    // Bonus for good structure
    const hasTitle = slide.some(el => el.type === 'title');
    const hasBullets = slide.some(el => 
      el.props.text?.includes('•') || el.props.text?.includes('-')
    );

    if (hasTitle) score += 0.1;
    if (hasBullets) score += 0.1;

    // Penalty for too many elements
    if (slide.length > 8) {
      score -= 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate visual balance score
   */
  private calculateVisualBalance(slide: GridElement[]): number {
    if (slide.length === 0) return 1.0;

    // Calculate center of mass
    let totalX = 0, totalY = 0, totalArea = 0;

    slide.forEach(el => {
      const area = el.w * el.h;
      totalX += (el.x + el.w / 2) * area;
      totalY += (el.y + el.h / 2) * area;
      totalArea += area;
    });

    const centerX = totalX / totalArea;
    const centerY = totalY / totalArea;

    // Ideal center is around (6, 6) for a 12x12 grid
    const idealX = 6, idealY = 6;
    const distance = Math.sqrt(
      Math.pow(centerX - idealX, 2) + Math.pow(centerY - idealY, 2)
    );

    // Convert distance to score (0-1, where 1 is perfectly balanced)
    const maxDistance = Math.sqrt(Math.pow(6, 2) + Math.pow(6, 2));
    return Math.max(0, 1 - (distance / maxDistance));
  }

  /**
   * Check accessibility issues
   */
  private checkAccessibility(slide: GridElement[]): AccessibilityCheck[] {
    const checks: AccessibilityCheck[] = [];

    // Check for missing alt text on images
    slide.forEach(el => {
      if (el.type === 'image' && !el.props.alt) {
        checks.push({
          type: 'alt_text',
          status: 'fail',
          message: 'Image missing alt text',
          suggestion: 'Add descriptive alt text for screen readers',
        });
      }
    });

    // Check heading structure
    const headings = slide
      .filter(el => el.type === 'title')
      .map(el => el.props.level || 1)
      .sort((a, b) => a - b);

    if (headings.length > 1) {
      for (let i = 1; i < headings.length; i++) {
        if (headings[i] - headings[i-1] > 1) {
          checks.push({
            type: 'heading_structure',
            status: 'warning',
            message: 'Heading levels skip numbers',
            suggestion: 'Use consecutive heading levels (H1, H2, H3)',
          });
          break;
        }
      }
    }

    // Check font size (simplified)
    slide.forEach(el => {
      if ((el.type === 'text' || el.type === 'paragraph') && el.props.fontSize && el.props.fontSize < 14) {
        checks.push({
          type: 'font_size',
          status: 'warning',
          message: 'Text may be too small',
          suggestion: 'Use at least 14px font size for better readability',
        });
      }
    });

    return checks;
  }

  /**
   * Calculate color contrast ratio
   */
  private calculateContrast(color1: string, color2: string): number {
    // Simplified contrast calculation
    // In a real implementation, you'd convert colors to RGB and calculate proper contrast
    return 4.5; // Mock value
  }

  /**
   * Get priority for suggestion by ID
   */
  private getPriorityForSuggestion(suggestionId: string): 'low' | 'medium' | 'high' | 'critical' {
    const rule = Array.from(this.rules.values()).find(r => 
      r.generateSuggestion({} as any).id === suggestionId
    );
    return rule?.priority || 'low';
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SmartSuggestionsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SmartSuggestionsConfig {
    return { ...this.config };
  }

  /**
   * Add custom rule
   */
  addRule(rule: SuggestionRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get all rules
   */
  getRules(): SuggestionRule[] {
    return Array.from(this.rules.values());
  }
}

// Export singleton instance
export const smartSuggestions = new SmartSuggestions();
