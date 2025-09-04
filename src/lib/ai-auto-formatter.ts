import { GridElement } from '@/types/slide-builder';
import { ContentAnalysis } from './ai-suggestions';

// Auto-formatting types
export interface FormattingRule {
  id: string;
  name: string;
  description: string;
  category: 'typography' | 'layout' | 'color' | 'spacing' | 'alignment';
  priority: number;
  condition: (element: GridElement, context: FormattingContext) => boolean;
  apply: (element: GridElement, context: FormattingContext) => GridElement;
}

export interface FormattingContext {
  slide: GridElement[];
  slideIndex?: number;
  totalSlides?: number;
  theme?: string;
  contentType?: 'title' | 'content' | 'conclusion';
  userPreferences?: FormattingPreferences;
}

export interface FormattingPreferences {
  fontFamily: string;
  colorScheme: 'light' | 'dark' | 'auto';
  spacing: 'compact' | 'comfortable' | 'spacious';
  alignment: 'left' | 'center' | 'justified';
  emphasis: 'subtle' | 'moderate' | 'bold';
}

export interface AutoFormatOptions {
  enableTypography: boolean;
  enableLayout: boolean;
  enableColors: boolean;
  enableSpacing: boolean;
  enableAlignment: boolean;
  preserveUserChanges: boolean;
  applyToNewElements: boolean;
}

export interface FormattingResult {
  success: boolean;
  elementsModified: number;
  changes: FormattingChange[];
  warnings?: string[];
  errors?: string[];
}

export interface FormattingChange {
  elementId: string;
  property: string;
  oldValue: any;
  newValue: any;
  reason: string;
}

export class AIAutoFormatter {
  private rules: Map<string, FormattingRule> = new Map();
  private options: AutoFormatOptions = {
    enableTypography: true,
    enableLayout: true,
    enableColors: true,
    enableSpacing: true,
    enableAlignment: true,
    preserveUserChanges: true,
    applyToNewElements: true,
  };

  constructor() {
    this.initializeRules();
  }

  /**
   * Initialize formatting rules
   */
  private initializeRules(): void {
    const rules: FormattingRule[] = [
      // Typography rules
      {
        id: 'title-font-size',
        name: 'Title Font Size',
        description: 'Ensure titles have appropriate font size',
        category: 'typography',
        priority: 8,
        condition: (element) => element.type === 'title' && (!element.props.fontSize || element.props.fontSize < 24),
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            fontSize: this.getTitleFontSize(element.props.level || 1, context),
          },
        }),
      },

      {
        id: 'body-text-size',
        name: 'Body Text Size',
        description: 'Set readable font size for body text',
        category: 'typography',
        priority: 7,
        condition: (element) => 
          (element.type === 'paragraph' || element.type === 'text') && 
          (!element.props.fontSize || element.props.fontSize < 16),
        apply: (element) => ({
          ...element,
          props: {
            ...element.props,
            fontSize: 18,
          },
        }),
      },

      {
        id: 'font-family-consistency',
        name: 'Font Family Consistency',
        description: 'Apply consistent font family across elements',
        category: 'typography',
        priority: 6,
        condition: (element, context) => 
          !element.props.fontFamily && !!context.userPreferences?.fontFamily,
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            fontFamily: context.userPreferences?.fontFamily || 'Inter, sans-serif',
          },
        }),
      },

      // Layout rules
      {
        id: 'title-positioning',
        name: 'Title Positioning',
        description: 'Position titles at the top of slides',
        category: 'layout',
        priority: 9,
        condition: (element) => element.type === 'title' && element.y > 2,
        apply: (element) => ({
          ...element,
          y: 1,
        }),
      },

      {
        id: 'content-spacing',
        name: 'Content Spacing',
        description: 'Add appropriate spacing between content elements',
        category: 'spacing',
        priority: 7,
        condition: (element, context) => {
          const elementIndex = context.slide.findIndex(el => el.id === element.id);
          if (elementIndex === 0) return false;
          
          const prevElement = context.slide[elementIndex - 1];
          return (element.y - (prevElement.y + prevElement.h)) < 1;
        },
        apply: (element, context) => {
          const elementIndex = context.slide.findIndex(el => el.id === element.id);
          const prevElement = context.slide[elementIndex - 1];
          const spacing = this.getSpacing(context.userPreferences?.spacing || 'comfortable');
          
          return {
            ...element,
            y: prevElement.y + prevElement.h + spacing,
          };
        },
      },

      // Color rules
      {
        id: 'color-contrast',
        name: 'Color Contrast',
        description: 'Ensure sufficient color contrast for readability',
        category: 'color',
        priority: 8,
        condition: (element) => 
          element.props.color && element.props.backgroundColor &&
          this.calculateContrast(element.props.color, element.props.backgroundColor) < 4.5,
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            color: this.getContrastingColor(element.props.backgroundColor, context),
          },
        }),
      },

      {
        id: 'theme-colors',
        name: 'Theme Colors',
        description: 'Apply theme-appropriate colors',
        category: 'color',
        priority: 6,
        condition: (element, context) => 
          !element.props.color && !!context.theme,
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            color: this.getThemeColor(element.type, context.theme || 'default'),
          },
        }),
      },

      // Alignment rules
      {
        id: 'title-alignment',
        name: 'Title Alignment',
        description: 'Center align titles for better visual impact',
        category: 'alignment',
        priority: 7,
        condition: (element) => 
          element.type === 'title' && element.props.textAlign !== 'center',
        apply: (element) => ({
          ...element,
          props: {
            ...element.props,
            textAlign: 'center',
          },
        }),
      },

      {
        id: 'content-alignment',
        name: 'Content Alignment',
        description: 'Apply consistent alignment to content',
        category: 'alignment',
        priority: 5,
        condition: (element, context) => 
          (element.type === 'paragraph' || element.type === 'text') &&
          !element.props.textAlign &&
          !!context.userPreferences?.alignment,
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            textAlign: context.userPreferences?.alignment || 'left',
          },
        }),
      },

      // Spacing rules
      {
        id: 'margin-consistency',
        name: 'Margin Consistency',
        description: 'Apply consistent margins to elements',
        category: 'spacing',
        priority: 6,
        condition: (element) => !element.props.margin,
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            margin: this.getElementMargin(element.type, context),
          },
        }),
      },

      {
        id: 'padding-optimization',
        name: 'Padding Optimization',
        description: 'Optimize padding for better readability',
        category: 'spacing',
        priority: 5,
        condition: (element) => 
          (element.type === 'paragraph' || element.type === 'text') && 
          !element.props.padding,
        apply: (element, context) => ({
          ...element,
          props: {
            ...element.props,
            padding: this.getElementPadding(element.type, context),
          },
        }),
      },

      // Layout optimization
      {
        id: 'element-sizing',
        name: 'Element Sizing',
        description: 'Optimize element sizes for content',
        category: 'layout',
        priority: 6,
        condition: (element) => {
          const text = element.props.text || '';
          const estimatedHeight = Math.ceil(text.length / 80); // Rough estimate
          return element.h < estimatedHeight;
        },
        apply: (element) => {
          const text = element.props.text || '';
          const estimatedHeight = Math.max(1, Math.ceil(text.length / 80));
          return {
            ...element,
            h: Math.min(estimatedHeight, 6), // Cap at 6 units
          };
        },
      },

      // Visual hierarchy
      {
        id: 'visual-hierarchy',
        name: 'Visual Hierarchy',
        description: 'Establish clear visual hierarchy',
        category: 'typography',
        priority: 8,
        condition: (element) => 
          element.type === 'title' && !element.props.fontWeight,
        apply: (element) => ({
          ...element,
          props: {
            ...element.props,
            fontWeight: this.getTitleWeight(element.props.level || 1),
          },
        }),
      },
    ];

    rules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  /**
   * Auto-format a slide
   */
  formatSlide(
    slide: GridElement[],
    context: Partial<FormattingContext> = {}
  ): FormattingResult {
    const fullContext: FormattingContext = {
      slide,
      ...context,
    };

    const changes: FormattingChange[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    let elementsModified = 0;

    // Sort rules by priority (highest first)
    const sortedRules = Array.from(this.rules.values())
      .sort((a, b) => b.priority - a.priority);

    // Apply rules to each element
    const formattedSlide = slide.map(element => {
      let modifiedElement = { ...element };
      let elementModified = false;

      for (const rule of sortedRules) {
        // Check if rule category is enabled
        if (!this.isRuleCategoryEnabled(rule.category)) {
          continue;
        }

        // Check if rule condition is met
        if (rule.condition(modifiedElement, fullContext)) {
          try {
            const originalElement = { ...modifiedElement };
            modifiedElement = rule.apply(modifiedElement, fullContext);

            // Track changes
            const elementChanges = this.detectChanges(originalElement, modifiedElement, rule);
            changes.push(...elementChanges);

            if (elementChanges.length > 0) {
              elementModified = true;
            }
          } catch (error) {
            errors.push(`Failed to apply rule ${rule.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      if (elementModified) {
        elementsModified++;
      }

      return modifiedElement;
    });

    // Update the slide in context for subsequent rules
    fullContext.slide = formattedSlide;

    return {
      success: errors.length === 0,
      elementsModified,
      changes,
      warnings,
      errors,
    };
  }

  /**
   * Auto-format multiple slides
   */
  formatPresentation(
    slides: GridElement[][],
    context: Partial<FormattingContext> = {}
  ): FormattingResult {
    const allChanges: FormattingChange[] = [];
    const allWarnings: string[] = [];
    const allErrors: string[] = [];
    let totalElementsModified = 0;

    slides.forEach((slide, index) => {
      const slideContext = {
        ...context,
        slideIndex: index,
        totalSlides: slides.length,
        contentType: this.determineSlideType(slide, index, slides.length),
      };

      const result = this.formatSlide(slide, slideContext);
      
      allChanges.push(...result.changes);
      allWarnings.push(...(result.warnings || []));
      allErrors.push(...(result.errors || []));
      totalElementsModified += result.elementsModified;
    });

    return {
      success: allErrors.length === 0,
      elementsModified: totalElementsModified,
      changes: allChanges,
      warnings: allWarnings,
      errors: allErrors,
    };
  }

  /**
   * Get title font size based on level
   */
  private getTitleFontSize(level: number, context: FormattingContext): number {
    const baseSizes = {
      1: 32, // Main title
      2: 28, // Section title
      3: 24, // Subsection
      4: 20, // Minor heading
      5: 18, // Small heading
      6: 16, // Smallest heading
    };

    let size = baseSizes[level as keyof typeof baseSizes] || 24;

    // Adjust based on slide type
    if (context.contentType === 'title') {
      size += 4; // Larger for title slides
    }

    return size;
  }

  /**
   * Get spacing based on preference
   */
  private getSpacing(preference: string): number {
    const spacings = {
      compact: 0.5,
      comfortable: 1,
      spacious: 1.5,
    };

    return spacings[preference as keyof typeof spacings] || 1;
  }

  /**
   * Calculate color contrast ratio
   */
  private calculateContrast(color1: string, color2: string): number {
    // Simplified implementation - in reality, you'd convert to RGB and calculate proper contrast
    // For now, return a mock value
    return 4.5;
  }

  /**
   * Get contrasting color
   */
  private getContrastingColor(backgroundColor: string, context: FormattingContext): string {
    // Simplified implementation
    const isDark = backgroundColor.includes('dark') || backgroundColor.includes('#000');
    return isDark ? '#ffffff' : '#000000';
  }

  /**
   * Get theme color for element type
   */
  private getThemeColor(elementType: string, theme: string): string {
    const themeColors = {
      default: {
        title: '#1a1a1a',
        text: '#333333',
        paragraph: '#444444',
      },
      professional: {
        title: '#2c3e50',
        text: '#34495e',
        paragraph: '#5d6d7e',
      },
      creative: {
        title: '#8e44ad',
        text: '#2c3e50',
        paragraph: '#34495e',
      },
    };

    const colors = themeColors[theme as keyof typeof themeColors] || themeColors.default;
    return colors[elementType as keyof typeof colors] || colors.text;
  }

  /**
   * Get title font weight based on level
   */
  private getTitleWeight(level: number): string {
    const weights = {
      1: '700', // Bold for main titles
      2: '600', // Semi-bold for sections
      3: '500', // Medium for subsections
      4: '400', // Normal for minor headings
      5: '400',
      6: '400',
    };

    return weights[level as keyof typeof weights] || '600';
  }

  /**
   * Get element margin
   */
  private getElementMargin(elementType: string, context: FormattingContext): string {
    const margins = {
      title: '0 0 16px 0',
      paragraph: '0 0 12px 0',
      text: '0 0 8px 0',
      image: '16px 0',
      chart: '16px 0',
    };

    return margins[elementType as keyof typeof margins] || '0 0 8px 0';
  }

  /**
   * Get element padding
   */
  private getElementPadding(elementType: string, context: FormattingContext): string {
    const spacingMultiplier = this.getSpacing(context.userPreferences?.spacing || 'comfortable');
    
    const basePaddings = {
      paragraph: 12,
      text: 8,
      title: 4,
    };

    const basePadding = basePaddings[elementType as keyof typeof basePaddings] || 8;
    const adjustedPadding = Math.round(basePadding * spacingMultiplier);

    return `${adjustedPadding}px`;
  }

  /**
   * Determine slide type based on position and content
   */
  private determineSlideType(slide: GridElement[], index: number, total: number): 'title' | 'content' | 'conclusion' {
    if (index === 0) return 'title';
    if (index === total - 1) return 'conclusion';
    return 'content';
  }

  /**
   * Check if rule category is enabled
   */
  private isRuleCategoryEnabled(category: string): boolean {
    const categoryMap = {
      typography: this.options.enableTypography,
      layout: this.options.enableLayout,
      color: this.options.enableColors,
      spacing: this.options.enableSpacing,
      alignment: this.options.enableAlignment,
    };

    return categoryMap[category as keyof typeof categoryMap] ?? true;
  }

  /**
   * Detect changes between elements
   */
  private detectChanges(
    original: GridElement,
    modified: GridElement,
    rule: FormattingRule
  ): FormattingChange[] {
    const changes: FormattingChange[] = [];

    // Check position changes
    if (original.x !== modified.x || original.y !== modified.y) {
      changes.push({
        elementId: original.id,
        property: 'position',
        oldValue: { x: original.x, y: original.y },
        newValue: { x: modified.x, y: modified.y },
        reason: rule.description,
      });
    }

    // Check size changes
    if (original.w !== modified.w || original.h !== modified.h) {
      changes.push({
        elementId: original.id,
        property: 'size',
        oldValue: { w: original.w, h: original.h },
        newValue: { w: modified.w, h: modified.h },
        reason: rule.description,
      });
    }

    // Check props changes
    for (const [key, value] of Object.entries(modified.props)) {
      if (original.props[key] !== value) {
        changes.push({
          elementId: original.id,
          property: key,
          oldValue: original.props[key],
          newValue: value,
          reason: rule.description,
        });
      }
    }

    return changes;
  }

  /**
   * Update formatting options
   */
  updateOptions(options: Partial<AutoFormatOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get current options
   */
  getOptions(): AutoFormatOptions {
    return { ...this.options };
  }

  /**
   * Add custom formatting rule
   */
  addRule(rule: FormattingRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove formatting rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get all formatting rules
   */
  getRules(): FormattingRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Preview formatting changes without applying them
   */
  previewFormatting(
    slide: GridElement[],
    context: Partial<FormattingContext> = {}
  ): FormattingChange[] {
    const result = this.formatSlide(slide, context);
    return result.changes;
  }
}

// Export singleton instance
export const aiAutoFormatter = new AIAutoFormatter();
