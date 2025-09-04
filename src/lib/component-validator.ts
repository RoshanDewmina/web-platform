import { ComponentValidationResult, CustomComponent } from '@/types/custom-components';

// Restricted APIs and patterns that are not allowed in custom components
const RESTRICTED_APIS = [
  'eval',
  'Function',
  'setTimeout',
  'setInterval',
  'fetch',
  'XMLHttpRequest',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'navigator',
  'window',
  'document',
  'history',
  'location',
  'console.log',
  'console.error',
  'console.warn',
  'console.info',
  'alert',
  'confirm',
  'prompt',
];

const RESTRICTED_PATTERNS = [
  /eval\s*\(/,
  /Function\s*\(/,
  /new\s+Function/,
  /setTimeout\s*\(/,
  /setInterval\s*\(/,
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /localStorage/,
  /sessionStorage/,
  /indexedDB/,
  /navigator/,
  /window\./,
  /document\./,
  /history\./,
  /location\./,
  /alert\s*\(/,
  /confirm\s*\(/,
  /prompt\s*\(/,
  /import\s+.*from/,
  /require\s*\(/,
  /process\./,
  /__dirname/,
  /__filename/,
  /global/,
  /Buffer/,
  /module\./,
  /exports/,
];

// Allowed React APIs and patterns
const ALLOWED_REACT_APIS = [
  'useState',
  'useEffect',
  'useCallback',
  'useMemo',
  'useRef',
  'useContext',
  'useReducer',
  'useLayoutEffect',
  'useImperativeHandle',
  'useDebugValue',
  'useId',
  'useTransition',
  'useDeferredValue',
  'useSyncExternalStore',
  'useInsertionEffect',
  'React.useState',
  'React.useEffect',
  'React.useCallback',
  'React.useMemo',
  'React.useRef',
  'React.useContext',
  'React.useReducer',
  'React.useLayoutEffect',
  'React.useImperativeHandle',
  'React.useDebugValue',
  'React.useId',
  'React.useTransition',
  'React.useDeferredValue',
  'React.useSyncExternalStore',
  'React.useInsertionEffect',
];

// Allowed UI component libraries
const ALLOWED_UI_LIBRARIES = [
  '@radix-ui/',
  'lucide-react',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'cn',
];

export class ComponentValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * Validate a custom component's code for security and correctness
   */
  async validateComponent(component: CustomComponent): Promise<ComponentValidationResult> {
    this.errors = [];
    this.warnings = [];

    // Basic validation
    this.validateBasicStructure(component);
    this.validateSecurity(component);
    this.validateReactPatterns(component);
    this.validateDependencies(component);
    this.validateProps(component);

    // Advanced validation
    await this.validateCompilation(component);
    this.validatePerformance(component);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      dependencies: this.extractDependencies(component.code),
      propSchema: this.extractPropSchema(component.code),
    };
  }

  /**
   * Validate basic component structure
   */
  private validateBasicStructure(component: CustomComponent): void {
    if (!component.code.includes('export default')) {
      this.errors.push('Component must have a default export');
    }

    if (!component.code.includes('function') && !component.code.includes('const') && !component.code.includes('class')) {
      this.errors.push('Component must be a function or class component');
    }

    if (component.code.length > 10000) {
      this.errors.push('Component code is too large (max 10KB)');
    }

    if (component.code.split('\n').length > 200) {
      this.errors.push('Component has too many lines (max 200)');
    }
  }

  /**
   * Validate security by checking for restricted APIs and patterns
   */
  private validateSecurity(component: CustomComponent): void {
    const code = component.code.toLowerCase();

    // Check for restricted APIs
    for (const api of RESTRICTED_APIS) {
      if (code.includes(api.toLowerCase())) {
        this.errors.push(`Restricted API detected: ${api}`);
      }
    }

    // Check for restricted patterns
    for (const pattern of RESTRICTED_PATTERNS) {
      if (pattern.test(component.code)) {
        this.errors.push(`Restricted pattern detected: ${pattern.source}`);
      }
    }

    // Check for potential XSS vulnerabilities
    if (code.includes('dangerouslysetinnerhtml') || code.includes('innerhtml')) {
      this.warnings.push('Potential XSS vulnerability: innerHTML usage detected');
    }

    // Check for eval-like patterns
    if (code.includes('new function') || code.includes('function(')) {
      this.errors.push('Dynamic code execution detected');
    }
  }

  /**
   * Validate React patterns and best practices
   */
  private validateReactPatterns(component: CustomComponent): void {
    const code = component.code;

    // Check for proper React import
    if (!code.includes('import React') && !code.includes('from "react"') && !code.includes('from \'react\'')) {
      this.warnings.push('React import not detected - consider adding explicit React import');
    }

    // Check for proper component naming
    const componentNameMatch = code.match(/export\s+default\s+(?:function\s+)?([A-Z][a-zA-Z0-9]*)/);
    if (componentNameMatch) {
      const componentName = componentNameMatch[1];
      if (!/^[A-Z]/.test(componentName)) {
        this.errors.push('Component name must start with a capital letter');
      }
    }

    // Check for proper prop destructuring
    if (code.includes('props.') && !code.includes('{') && !code.includes('props')) {
      this.warnings.push('Consider using prop destructuring for better readability');
    }

    // Check for proper return statement
    if (!code.includes('return') && !code.includes('render()')) {
      this.errors.push('Component must return JSX');
    }
  }

  /**
   * Validate dependencies
   */
  private validateDependencies(component: CustomComponent): void {
    const extractedDeps = this.extractDependencies(component.code);
    
    for (const dep of extractedDeps) {
      // Check if dependency is allowed
      const isAllowed = ALLOWED_UI_LIBRARIES.some(lib => dep.includes(lib)) ||
                       ALLOWED_REACT_APIS.some(api => dep.includes(api)) ||
                       dep.startsWith('react') ||
                       dep.startsWith('@types/');

      if (!isAllowed) {
        this.warnings.push(`Dependency may not be available: ${dep}`);
      }
    }

    // Check for circular dependencies
    if (extractedDeps.length > 10) {
      this.warnings.push('Component has many dependencies - consider simplifying');
    }
  }

  /**
   * Validate props structure
   */
  private validateProps(component: CustomComponent): void {
    const propSchema = this.extractPropSchema(component.code);
    
    // Check for required props
    if (Object.keys(propSchema).length > 20) {
      this.warnings.push('Component has many props - consider grouping related props');
    }

    // Check for prop types
    for (const [propName, propType] of Object.entries(propSchema)) {
      if (propName.includes(' ') || propName.includes('-')) {
        this.errors.push(`Invalid prop name: ${propName} (use camelCase)`);
      }
    }
  }

  /**
   * Validate component compilation
   */
  private async validateCompilation(component: CustomComponent): Promise<void> {
    try {
      // This would be implemented with a proper TypeScript compiler
      // For now, we'll do basic syntax checking
      const hasValidSyntax = this.checkBasicSyntax(component.code);
      if (!hasValidSyntax) {
        this.errors.push('Component has syntax errors');
      }
    } catch (error) {
      this.errors.push(`Compilation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate performance considerations
   */
  private validatePerformance(component: CustomComponent): void {
    const code = component.code;

    // Check for expensive operations
    if (code.includes('JSON.parse') || code.includes('JSON.stringify')) {
      this.warnings.push('Consider memoizing JSON operations for better performance');
    }

    if (code.includes('Array.map') && code.includes('Array.map')) {
      this.warnings.push('Multiple array operations detected - consider optimization');
    }

    // Check for potential infinite loops
    if (code.includes('while(true)') || code.includes('for(;;)')) {
      this.errors.push('Potential infinite loop detected');
    }
  }

  /**
   * Extract dependencies from component code
   */
  private extractDependencies(code: string): string[] {
    const dependencies: string[] = [];
    const importRegex = /import\s+(?:.*\s+from\s+)?['"]([^'"]+)['"]/g;
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    let match;
    while ((match = importRegex.exec(code)) !== null) {
      dependencies.push(match[1]);
    }

    while ((match = requireRegex.exec(code)) !== null) {
      dependencies.push(match[1]);
    }

    return [...new Set(dependencies)];
  }

  /**
   * Extract prop schema from component code
   */
  private extractPropSchema(code: string): Record<string, any> {
    const propSchema: Record<string, any> = {};
    
    // Look for prop destructuring patterns
    const destructuringRegex = /{\s*([^}]+)\s*}\s*=\s*props/g;
    let match;
    
    while ((match = destructuringRegex.exec(code)) !== null) {
      const props = match[1].split(',').map(p => p.trim());
      for (const prop of props) {
        const propName = prop.split('=')[0].trim();
        if (propName && !propName.startsWith('//')) {
          propSchema[propName] = 'any';
        }
      }
    }

    // Look for props. usage
    const propsUsageRegex = /props\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = propsUsageRegex.exec(code)) !== null) {
      const propName = match[1];
      if (!propSchema[propName]) {
        propSchema[propName] = 'any';
      }
    }

    return propSchema;
  }

  /**
   * Check basic syntax validity
   */
  private checkBasicSyntax(code: string): boolean {
    try {
      // Basic bracket matching
      const brackets = { '(': 0, ')': 0, '{': 0, '}': 0, '[': 0, ']': 0 };
      
      for (const char of code) {
        if (brackets.hasOwnProperty(char)) {
          brackets[char as keyof typeof brackets]++;
        }
      }

      if (brackets['('] !== brackets[')'] || 
          brackets['{'] !== brackets['}'] || 
          brackets['['] !== brackets[']']) {
        return false;
      }

      // Check for basic JSX structure
      if (code.includes('<') && !code.includes('>')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize component code
   */
  static sanitizeCode(code: string): string {
    // Remove comments
    let sanitized = code.replace(/\/\*[\s\S]*?\*\//g, '');
    sanitized = sanitized.replace(/\/\/.*$/gm, '');

    // Remove extra whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return sanitized;
  }

  /**
   * Generate safe component wrapper
   */
  static generateSafeWrapper(componentCode: string, componentName: string): string {
    return `
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const ${componentName} = (props) => {
  try {
    ${componentCode}
  } catch (error) {
    console.error('Component error:', error);
    return <div style={{ color: 'red', padding: '1rem' }}>
      Component Error: {error.message}
    </div>;
  }
};

export default ${componentName};
`;
  }
}





