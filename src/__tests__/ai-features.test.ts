import { describe, it, expect, beforeEach } from '@jest/globals';
import { aiAssistant } from '../lib/ai-assistant';
import { aiContentGenerator } from '../lib/ai-content-generator';
import { smartSuggestions } from '../lib/ai-suggestions';
import { aiAutoFormatter } from '../lib/ai-auto-formatter';
import { aiWorkflows } from '../lib/ai-workflows';
import { GridElement } from '../types/slide-builder';

describe('AI Features Integration Tests', () => {
  let testSlide: GridElement[];

  beforeEach(() => {
    testSlide = [
      {
        id: 'test-title',
        type: 'title',
        x: 1,
        y: 1,
        w: 10,
        h: 1,
        props: { text: 'Sample Slide Title', level: 1 },
      },
      {
        id: 'test-content',
        type: 'paragraph',
        x: 1,
        y: 3,
        w: 10,
        h: 4,
        props: { 
          text: 'This is a sample paragraph with some content that might need improvement. It contains multiple sentences and could benefit from better formatting and structure.' 
        },
      },
    ];
  });

  describe('AI Assistant', () => {
    it('should process user messages and generate responses', async () => {
      const response = await aiAssistant.processMessage('Help me improve this slide');
      
      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.confidence).toBeGreaterThan(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
    });

    it('should maintain conversation context', async () => {
      // First message
      await aiAssistant.processMessage('Create a title for a business presentation');
      
      // Second message with context
      const response = await aiAssistant.processMessage('Make it more engaging');
      
      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
    });

    it('should generate content suggestions', async () => {
      const suggestions = await aiAssistant.generateContentSuggestions('title', {
        tone: 'formal',
        length: 'moderate',
        audience: 'general',
        purpose: 'inform',
      });

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should analyze slide content', async () => {
      const suggestions = await aiAssistant.analyzeSlideContent(testSlide);
      
      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('AI Content Generator', () => {
    it('should generate slide content', async () => {
      const result = await aiContentGenerator.generateContent({
        type: 'slide',
        context: { topic: 'AI in Education' },
        options: {
          tone: 'formal',
          length: 'moderate',
          audience: 'general',
          purpose: 'inform',
        },
      });

      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      expect(result.slides).toBeDefined();
    });

    it('should generate presentation content', async () => {
      const result = await aiContentGenerator.generateContent({
        type: 'presentation',
        context: { topic: 'Business Strategy' },
        options: {
          tone: 'formal',
          length: 'moderate',
          audience: 'executive',
          purpose: 'persuade',
        },
      });

      expect(result.success).toBe(true);
      expect(result.slides).toBeDefined();
      expect(Array.isArray(result.slides)).toBe(true);
    });

    it('should return available templates', () => {
      const templates = aiContentGenerator.getTemplates();
      
      expect(templates).toBeDefined();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
      
      // Check template structure
      const template = templates[0];
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
      expect(template.category).toBeDefined();
      expect(template.structure).toBeDefined();
    });
  });

  describe('Smart Suggestions', () => {
    it('should generate suggestions for slide content', () => {
      const context = {
        currentSlide: testSlide,
        allSlides: [testSlide],
      };

      const suggestions = smartSuggestions.generateSuggestions(context);
      
      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should analyze content metrics', () => {
      const analysis = smartSuggestions.analyzeContent(testSlide);
      
      expect(analysis).toBeDefined();
      expect(analysis.readabilityScore).toBeGreaterThanOrEqual(0);
      expect(analysis.readabilityScore).toBeLessThanOrEqual(1);
      expect(analysis.engagementScore).toBeGreaterThanOrEqual(0);
      expect(analysis.engagementScore).toBeLessThanOrEqual(1);
      expect(analysis.visualBalance).toBeGreaterThanOrEqual(0);
      expect(analysis.visualBalance).toBeLessThanOrEqual(1);
      expect(analysis.accessibility).toBeDefined();
      expect(Array.isArray(analysis.accessibility)).toBe(true);
    });

    it('should respect configuration settings', () => {
      const config = smartSuggestions.getConfig();
      
      expect(config).toBeDefined();
      expect(config.enableRealTime).toBeDefined();
      expect(config.categories).toBeDefined();
      expect(config.maxSuggestions).toBeDefined();
      expect(config.minConfidence).toBeDefined();
    });

    it('should allow configuration updates', () => {
      const originalConfig = smartSuggestions.getConfig();
      
      smartSuggestions.updateConfig({
        maxSuggestions: 3,
        minConfidence: 0.8,
      });
      
      const updatedConfig = smartSuggestions.getConfig();
      expect(updatedConfig.maxSuggestions).toBe(3);
      expect(updatedConfig.minConfidence).toBe(0.8);
      
      // Restore original config
      smartSuggestions.updateConfig(originalConfig);
    });
  });

  describe('Auto Formatter', () => {
    it('should format slide elements', () => {
      const result = aiAutoFormatter.formatSlide(testSlide);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.elementsModified).toBeGreaterThanOrEqual(0);
      expect(result.changes).toBeDefined();
      expect(Array.isArray(result.changes)).toBe(true);
    });

    it('should format multiple slides', () => {
      const slides = [testSlide, [...testSlide]];
      const result = aiAutoFormatter.formatPresentation(slides);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.elementsModified).toBeGreaterThanOrEqual(0);
    });

    it('should preview formatting changes', () => {
      const changes = aiAutoFormatter.previewFormatting(testSlide);
      
      expect(changes).toBeDefined();
      expect(Array.isArray(changes)).toBe(true);
    });

    it('should respect formatting options', () => {
      const originalOptions = aiAutoFormatter.getOptions();
      
      aiAutoFormatter.updateOptions({
        enableTypography: false,
        enableLayout: false,
      });
      
      const updatedOptions = aiAutoFormatter.getOptions();
      expect(updatedOptions.enableTypography).toBe(false);
      expect(updatedOptions.enableLayout).toBe(false);
      
      // Restore original options
      aiAutoFormatter.updateOptions(originalOptions);
    });

    it('should return formatting rules', () => {
      const rules = aiAutoFormatter.getRules();
      
      expect(rules).toBeDefined();
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
      
      // Check rule structure
      const rule = rules[0];
      expect(rule.id).toBeDefined();
      expect(rule.name).toBeDefined();
      expect(rule.description).toBeDefined();
      expect(rule.category).toBeDefined();
      expect(rule.priority).toBeDefined();
      expect(typeof rule.condition).toBe('function');
      expect(typeof rule.apply).toBe('function');
    });
  });

  describe('AI Workflows', () => {
    it('should return available workflows', () => {
      const workflows = aiWorkflows.getWorkflows();
      
      expect(workflows).toBeDefined();
      expect(Array.isArray(workflows)).toBe(true);
      expect(workflows.length).toBeGreaterThan(0);
      
      // Check workflow structure
      const workflow = workflows[0];
      expect(workflow.id).toBeDefined();
      expect(workflow.name).toBeDefined();
      expect(workflow.description).toBeDefined();
      expect(workflow.category).toBeDefined();
      expect(workflow.steps).toBeDefined();
      expect(Array.isArray(workflow.steps)).toBe(true);
    });

    it('should execute workflows', async () => {
      const workflows = aiWorkflows.getWorkflows();
      const workflow = workflows[0];
      
      const execution = await aiWorkflows.executeWorkflow(workflow.id, {
        slides: [testSlide],
        currentSlideIndex: 0,
        theme: 'professional',
        presentationGoal: 'Test presentation',
        targetAudience: 'General',
      });

      expect(execution).toBeDefined();
      expect(execution.id).toBeDefined();
      expect(execution.workflowId).toBe(workflow.id);
      expect(execution.status).toBeDefined();
      expect(execution.steps).toBeDefined();
      expect(Array.isArray(execution.steps)).toBe(true);
    });

    it('should get workflows by category', () => {
      const contentWorkflows = aiWorkflows.getWorkflowsByCategory('content_creation');
      
      expect(contentWorkflows).toBeDefined();
      expect(Array.isArray(contentWorkflows)).toBe(true);
      expect(contentWorkflows.every(w => w.category === 'content_creation')).toBe(true);
    });

    it('should search workflows', () => {
      const searchResults = aiWorkflows.searchWorkflows('presentation');
      
      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);
    });

    it('should track workflow executions', () => {
      const executions = aiWorkflows.getExecutions();
      
      expect(executions).toBeDefined();
      expect(Array.isArray(executions)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a complete workflow', async () => {
      // 1. Generate content
      const contentResult = await aiContentGenerator.generateContent({
        type: 'slide',
        context: { topic: 'AI Integration' },
        options: {
          tone: 'formal',
          length: 'moderate',
          audience: 'technical',
          purpose: 'inform',
        },
      });

      expect(contentResult.success).toBe(true);
      expect(contentResult.slides).toBeDefined();

      // 2. Get suggestions for the generated content
      if (contentResult.slides && contentResult.slides.length > 0) {
        const slide = contentResult.slides[0];
        const suggestions = smartSuggestions.generateSuggestions({
          currentSlide: slide,
          allSlides: contentResult.slides,
        });

        expect(suggestions).toBeDefined();
        expect(Array.isArray(suggestions)).toBe(true);
      }

      // 3. Format the content
      if (contentResult.slides && contentResult.slides.length > 0) {
        const formatResult = aiAutoFormatter.formatSlide(contentResult.slides[0]);
        
        expect(formatResult.success).toBe(true);
        expect(formatResult.elementsModified).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle AI assistant with context from other systems', async () => {
      // Create a slide with some content
      const slide = [
        {
          id: 'title',
          type: 'title',
          x: 1,
          y: 1,
          w: 10,
          h: 1,
          props: { text: 'AI Features Test', level: 1 },
        },
      ];

      // Get AI suggestions
      const suggestions = smartSuggestions.generateSuggestions({
        currentSlide: slide,
        allSlides: [slide],
      });

      // Ask AI assistant about the suggestions
      const response = await aiAssistant.processMessage(
        'What do you think about these suggestions?',
        {
          currentSlide: slide,
          allSlides: [slide],
        }
      );

      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid content generation requests', async () => {
      const result = await aiContentGenerator.generateContent({
        type: 'invalid' as any,
        context: { topic: 'Test' },
        options: {
          tone: 'formal',
          length: 'moderate',
          audience: 'general',
          purpose: 'inform',
        },
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty slides in suggestions', () => {
      const suggestions = smartSuggestions.generateSuggestions({
        currentSlide: [],
        allSlides: [],
      });

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should handle formatting with no rules', () => {
      // Temporarily remove all rules
      const originalRules = aiAutoFormatter.getRules();
      originalRules.forEach(rule => aiAutoFormatter.removeRule(rule.id));

      const result = aiAutoFormatter.formatSlide(testSlide);
      
      expect(result.success).toBe(true);
      expect(result.elementsModified).toBe(0);

      // Restore rules
      originalRules.forEach(rule => aiAutoFormatter.addRule(rule));
    });
  });

  describe('Performance Tests', () => {
    it('should handle large slide arrays efficiently', () => {
      const largeSlide = Array.from({ length: 50 }, (_, i) => ({
        id: `element-${i}`,
        type: 'text',
        x: 1,
        y: i + 1,
        w: 10,
        h: 1,
        props: { text: `Content ${i}` },
      }));

      const startTime = Date.now();
      const suggestions = smartSuggestions.generateSuggestions({
        currentSlide: largeSlide,
        allSlides: [largeSlide],
      });
      const endTime = Date.now();

      expect(suggestions).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle multiple workflow executions', async () => {
      const workflows = aiWorkflows.getWorkflows();
      const executions: any[] = [];

      const startTime = Date.now();
      
      for (let i = 0; i < Math.min(3, workflows.length); i++) {
        const execution = await aiWorkflows.executeWorkflow(workflows[i].id, {
          slides: [testSlide],
          currentSlideIndex: 0,
          theme: 'professional',
          presentationGoal: 'Test presentation',
          targetAudience: 'General',
        });
        executions.push(execution);
      }

      const endTime = Date.now();

      expect(executions.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});





