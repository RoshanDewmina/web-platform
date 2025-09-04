import { GridElement } from '@/types/slide-builder';
import { aiContentGenerator, GenerationRequest } from './ai-content-generator';
import { aiAutoFormatter, FormattingContext } from './ai-auto-formatter';
import { smartSuggestions, SuggestionContext } from './ai-suggestions';

// Workflow types
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'generate' | 'format' | 'analyze' | 'transform' | 'validate';
  parameters: Record<string, any>;
  dependencies?: string[]; // IDs of steps that must complete first
  optional?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'content_creation' | 'design_optimization' | 'accessibility' | 'automation';
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger[];
  metadata?: {
    estimatedTime: number; // in seconds
    complexity: 'simple' | 'moderate' | 'complex';
    tags: string[];
  };
}

export interface WorkflowTrigger {
  type: 'manual' | 'auto' | 'scheduled' | 'event';
  condition?: string;
  parameters?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  steps: WorkflowStepExecution[];
  context: WorkflowContext;
  results?: WorkflowResults;
  error?: string;
}

export interface WorkflowStepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  result?: any;
  error?: string;
}

export interface WorkflowContext {
  slides: GridElement[][];
  currentSlideIndex?: number;
  userPreferences?: any;
  theme?: string;
  presentationGoal?: string;
  targetAudience?: string;
  customData?: Record<string, any>;
}

export interface WorkflowResults {
  slides?: GridElement[][];
  suggestions?: any[];
  analysis?: any;
  changes?: any[];
  metadata?: {
    elementsCreated: number;
    elementsModified: number;
    processingTime: number;
  };
}

export class AIWorkflows {
  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();

  constructor() {
    this.initializeWorkflows();
  }

  /**
   * Initialize predefined workflows
   */
  private initializeWorkflows(): void {
    const workflows: Workflow[] = [
      // Content Creation Workflows
      {
        id: 'quick-presentation',
        name: 'Quick Presentation Creator',
        description: 'Generate a complete presentation from a topic and key points',
        category: 'content_creation',
        steps: [
          {
            id: 'generate-outline',
            name: 'Generate Outline',
            description: 'Create presentation structure and outline',
            type: 'generate',
            parameters: {
              type: 'outline',
              includeIntro: true,
              includeConclusion: true,
            },
          },
          {
            id: 'create-title-slide',
            name: 'Create Title Slide',
            description: 'Generate engaging title slide',
            type: 'generate',
            parameters: {
              type: 'slide',
              template: 'title-slide',
            },
            dependencies: ['generate-outline'],
          },
          {
            id: 'generate-content-slides',
            name: 'Generate Content Slides',
            description: 'Create content slides based on outline',
            type: 'generate',
            parameters: {
              type: 'presentation',
              useOutline: true,
            },
            dependencies: ['generate-outline'],
          },
          {
            id: 'format-presentation',
            name: 'Format Presentation',
            description: 'Apply consistent formatting and styling',
            type: 'format',
            parameters: {
              applyTheme: true,
              optimizeLayout: true,
            },
            dependencies: ['create-title-slide', 'generate-content-slides'],
          },
          {
            id: 'final-review',
            name: 'Final Review',
            description: 'Analyze and suggest final improvements',
            type: 'analyze',
            parameters: {
              checkAccessibility: true,
              suggestImprovements: true,
            },
            dependencies: ['format-presentation'],
          },
        ],
        metadata: {
          estimatedTime: 120, // 2 minutes
          complexity: 'moderate',
          tags: ['content-creation', 'automation', 'presentation'],
        },
      },

      {
        id: 'slide-enhancement',
        name: 'Slide Enhancement',
        description: 'Improve existing slides with AI suggestions and formatting',
        category: 'design_optimization',
        steps: [
          {
            id: 'analyze-content',
            name: 'Analyze Content',
            description: 'Analyze slide content for improvements',
            type: 'analyze',
            parameters: {
              checkReadability: true,
              checkEngagement: true,
              checkVisualBalance: true,
            },
          },
          {
            id: 'generate-suggestions',
            name: 'Generate Suggestions',
            description: 'Create improvement suggestions',
            type: 'analyze',
            parameters: {
              includeContentSuggestions: true,
              includeDesignSuggestions: true,
            },
            dependencies: ['analyze-content'],
          },
          {
            id: 'auto-format',
            name: 'Auto Format',
            description: 'Apply automatic formatting improvements',
            type: 'format',
            parameters: {
              preserveUserChanges: true,
              optimizeSpacing: true,
            },
            dependencies: ['analyze-content'],
          },
          {
            id: 'optimize-layout',
            name: 'Optimize Layout',
            description: 'Improve visual hierarchy and element positioning',
            type: 'transform',
            parameters: {
              improveHierarchy: true,
              balanceElements: true,
            },
            dependencies: ['auto-format'],
          },
        ],
        metadata: {
          estimatedTime: 60, // 1 minute
          complexity: 'simple',
          tags: ['enhancement', 'formatting', 'optimization'],
        },
      },

      {
        id: 'accessibility-audit',
        name: 'Accessibility Audit & Fix',
        description: 'Comprehensive accessibility review and automatic fixes',
        category: 'accessibility',
        steps: [
          {
            id: 'accessibility-scan',
            name: 'Accessibility Scan',
            description: 'Scan for accessibility issues',
            type: 'analyze',
            parameters: {
              checkColorContrast: true,
              checkFontSizes: true,
              checkAltText: true,
              checkHeadingStructure: true,
            },
          },
          {
            id: 'fix-contrast-issues',
            name: 'Fix Contrast Issues',
            description: 'Automatically fix color contrast problems',
            type: 'transform',
            parameters: {
              minimumContrast: 4.5,
              preserveColors: false,
            },
            dependencies: ['accessibility-scan'],
          },
          {
            id: 'add-alt-text',
            name: 'Add Alt Text',
            description: 'Generate and add alt text for images',
            type: 'generate',
            parameters: {
              analyzeImages: true,
              generateDescriptions: true,
            },
            dependencies: ['accessibility-scan'],
          },
          {
            id: 'fix-heading-structure',
            name: 'Fix Heading Structure',
            description: 'Correct heading hierarchy',
            type: 'transform',
            parameters: {
              enforceHierarchy: true,
              startWithH1: true,
            },
            dependencies: ['accessibility-scan'],
          },
          {
            id: 'final-accessibility-check',
            name: 'Final Accessibility Check',
            description: 'Verify all accessibility improvements',
            type: 'validate',
            parameters: {
              generateReport: true,
            },
            dependencies: ['fix-contrast-issues', 'add-alt-text', 'fix-heading-structure'],
          },
        ],
        metadata: {
          estimatedTime: 90, // 1.5 minutes
          complexity: 'moderate',
          tags: ['accessibility', 'compliance', 'audit'],
        },
      },

      {
        id: 'content-optimization',
        name: 'Content Optimization',
        description: 'Optimize content for clarity, engagement, and impact',
        category: 'content_creation',
        steps: [
          {
            id: 'readability-analysis',
            name: 'Readability Analysis',
            description: 'Analyze text readability and complexity',
            type: 'analyze',
            parameters: {
              calculateReadabilityScore: true,
              identifyComplexSentences: true,
              suggestSimplifications: true,
            },
          },
          {
            id: 'engagement-analysis',
            name: 'Engagement Analysis',
            description: 'Assess content engagement potential',
            type: 'analyze',
            parameters: {
              checkVisualElements: true,
              analyzeContentFlow: true,
              suggestInteractivity: true,
            },
          },
          {
            id: 'content-refinement',
            name: 'Content Refinement',
            description: 'Refine content based on analysis',
            type: 'transform',
            parameters: {
              simplifyLanguage: true,
              improveFlow: true,
              addTransitions: true,
            },
            dependencies: ['readability-analysis', 'engagement-analysis'],
          },
          {
            id: 'visual-enhancement',
            name: 'Visual Enhancement',
            description: 'Add visual elements to support content',
            type: 'generate',
            parameters: {
              suggestImages: true,
              addIcons: true,
              createCharts: false,
            },
            dependencies: ['content-refinement'],
          },
        ],
        metadata: {
          estimatedTime: 75, // 1.25 minutes
          complexity: 'moderate',
          tags: ['content', 'optimization', 'engagement'],
        },
      },

      {
        id: 'brand-consistency',
        name: 'Brand Consistency Check',
        description: 'Ensure consistent branding across all slides',
        category: 'design_optimization',
        steps: [
          {
            id: 'brand-audit',
            name: 'Brand Audit',
            description: 'Audit current branding elements',
            type: 'analyze',
            parameters: {
              checkColors: true,
              checkFonts: true,
              checkSpacing: true,
              checkImageStyle: true,
            },
          },
          {
            id: 'apply-brand-colors',
            name: 'Apply Brand Colors',
            description: 'Ensure consistent color usage',
            type: 'transform',
            parameters: {
              enforceBrandPalette: true,
              updateAccentColors: true,
            },
            dependencies: ['brand-audit'],
          },
          {
            id: 'standardize-typography',
            name: 'Standardize Typography',
            description: 'Apply consistent typography',
            type: 'format',
            parameters: {
              enforceFontFamily: true,
              standardizeSizes: true,
              applyHierarchy: true,
            },
            dependencies: ['brand-audit'],
          },
          {
            id: 'layout-consistency',
            name: 'Layout Consistency',
            description: 'Ensure consistent layout patterns',
            type: 'transform',
            parameters: {
              standardizeSpacing: true,
              alignElements: true,
              applyGridSystem: true,
            },
            dependencies: ['apply-brand-colors', 'standardize-typography'],
          },
        ],
        metadata: {
          estimatedTime: 45, // 45 seconds
          complexity: 'simple',
          tags: ['branding', 'consistency', 'design'],
        },
      },
    ];

    workflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    context: WorkflowContext
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      status: 'running',
      startTime: new Date(),
      steps: workflow.steps.map(step => ({
        stepId: step.id,
        status: 'pending',
      })),
      context,
    };

    this.executions.set(execution.id, execution);

    try {
      const results = await this.executeSteps(workflow, execution);
      execution.status = 'completed';
      execution.endTime = new Date();
      execution.results = results;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return execution;
  }

  /**
   * Execute workflow steps
   */
  private async executeSteps(
    workflow: Workflow,
    execution: WorkflowExecution
  ): Promise<WorkflowResults> {
    const results: WorkflowResults = {
      slides: [...execution.context.slides],
      suggestions: [],
      analysis: {},
      changes: [],
      metadata: {
        elementsCreated: 0,
        elementsModified: 0,
        processingTime: 0,
      },
    };

    const stepResults: Map<string, any> = new Map();

    // Execute steps in dependency order
    const executionOrder = this.getExecutionOrder(workflow.steps);

    for (const step of executionOrder) {
      const stepExecution = execution.steps.find(s => s.stepId === step.id);
      if (!stepExecution) continue;

      stepExecution.status = 'running';
      stepExecution.startTime = new Date();

      try {
        const stepResult = await this.executeStep(step, execution.context, stepResults);
        stepExecution.result = stepResult;
        stepExecution.status = 'completed';
        stepExecution.endTime = new Date();
        stepResults.set(step.id, stepResult);

        // Update results based on step type
        this.updateResults(results, step, stepResult);
      } catch (error) {
        stepExecution.status = 'failed';
        stepExecution.endTime = new Date();
        stepExecution.error = error instanceof Error ? error.message : 'Unknown error';

        if (!step.optional) {
          throw error;
        }
      }
    }

    return results;
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Map<string, any>
  ): Promise<any> {
    switch (step.type) {
      case 'generate':
        return await this.executeGenerateStep(step, context, previousResults);
      case 'format':
        return await this.executeFormatStep(step, context, previousResults);
      case 'analyze':
        return await this.executeAnalyzeStep(step, context, previousResults);
      case 'transform':
        return await this.executeTransformStep(step, context, previousResults);
      case 'validate':
        return await this.executeValidateStep(step, context, previousResults);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  /**
   * Execute generate step
   */
  private async executeGenerateStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Map<string, any>
  ): Promise<any> {
    const request: GenerationRequest = {
      type: step.parameters.type || 'slide',
      template: step.parameters.template,
      context: {
        topic: context.presentationGoal,
        targetAudience: context.targetAudience,
        totalSlides: context.slides.length,
      },
      options: {
        tone: 'formal',
        length: 'moderate',
        audience: (context.targetAudience as any) || 'general',
        purpose: 'inform',
      },
    };

    return await aiContentGenerator.generateContent(request);
  }

  /**
   * Execute format step
   */
  private async executeFormatStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Map<string, any>
  ): Promise<any> {
    const formatContext: FormattingContext = {
      slide: context.slides[context.currentSlideIndex || 0] || [],
      theme: context.theme,
      userPreferences: context.userPreferences,
    };

    if (step.parameters.applyToAll) {
      return aiAutoFormatter.formatPresentation(context.slides, formatContext);
    } else {
      return aiAutoFormatter.formatSlide(formatContext.slide, formatContext);
    }
  }

  /**
   * Execute analyze step
   */
  private async executeAnalyzeStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Map<string, any>
  ): Promise<any> {
    const suggestionContext: SuggestionContext = {
      currentSlide: context.slides[context.currentSlideIndex || 0] || [],
      allSlides: context.slides,
    };

    const suggestions = smartSuggestions.generateSuggestions(suggestionContext);
    const analysis = smartSuggestions.analyzeContent(suggestionContext.currentSlide);

    return {
      suggestions,
      analysis,
      parameters: step.parameters,
    };
  }

  /**
   * Execute transform step
   */
  private async executeTransformStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Map<string, any>
  ): Promise<any> {
    // Mock transformation - in a real implementation, this would apply specific transformations
    const transformedSlides = context.slides.map(slide => 
      slide.map(element => ({ ...element }))
    );

    return {
      transformedSlides,
      changes: [`Applied ${step.name} transformation`],
    };
  }

  /**
   * Execute validate step
   */
  private async executeValidateStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Map<string, any>
  ): Promise<any> {
    // Mock validation - in a real implementation, this would perform actual validation
    return {
      isValid: true,
      issues: [],
      report: `Validation completed for ${step.name}`,
    };
  }

  /**
   * Get execution order based on dependencies
   */
  private getExecutionOrder(steps: WorkflowStep[]): WorkflowStep[] {
    const ordered: WorkflowStep[] = [];
    const remaining = [...steps];
    const completed = new Set<string>();

    while (remaining.length > 0) {
      const readySteps = remaining.filter(step => 
        !step.dependencies || step.dependencies.every(dep => completed.has(dep))
      );

      if (readySteps.length === 0) {
        throw new Error('Circular dependency detected in workflow steps');
      }

      readySteps.forEach(step => {
        ordered.push(step);
        completed.add(step.id);
        const index = remaining.indexOf(step);
        remaining.splice(index, 1);
      });
    }

    return ordered;
  }

  /**
   * Update results based on step execution
   */
  private updateResults(
    results: WorkflowResults,
    step: WorkflowStep,
    stepResult: any
  ): void {
    if (step.type === 'generate' && stepResult.slides) {
      results.slides = stepResult.slides;
      results.metadata!.elementsCreated += stepResult.metadata?.slidesCreated || 0;
    }

    if (step.type === 'format' && stepResult.changes) {
      results.changes!.push(...stepResult.changes);
      results.metadata!.elementsModified += stepResult.elementsModified || 0;
    }

    if (step.type === 'analyze' && stepResult.suggestions) {
      results.suggestions!.push(...stepResult.suggestions);
    }
  }

  /**
   * Get available workflows
   */
  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  /**
   * Get workflow execution
   */
  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  /**
   * Get all executions
   */
  getExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values());
  }

  /**
   * Cancel workflow execution
   */
  cancelExecution(id: string): boolean {
    const execution = this.executions.get(id);
    if (execution && execution.status === 'running') {
      execution.status = 'cancelled';
      execution.endTime = new Date();
      return true;
    }
    return false;
  }

  /**
   * Add custom workflow
   */
  addWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Remove workflow
   */
  removeWorkflow(id: string): void {
    this.workflows.delete(id);
  }

  /**
   * Get workflows by category
   */
  getWorkflowsByCategory(category: string): Workflow[] {
    return Array.from(this.workflows.values()).filter(w => w.category === category);
  }

  /**
   * Search workflows
   */
  searchWorkflows(query: string): Workflow[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.workflows.values()).filter(workflow =>
      workflow.name.toLowerCase().includes(lowerQuery) ||
      workflow.description.toLowerCase().includes(lowerQuery) ||
      workflow.metadata?.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

// Export singleton instance
export const aiWorkflows = new AIWorkflows();
