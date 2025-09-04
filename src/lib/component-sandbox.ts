import React from 'react';
import { ComponentExecutionContext, SandboxOptions, CustomComponent } from '@/types/custom-components';
import { ComponentValidator } from './component-validator';

// Default sandbox options
const DEFAULT_SANDBOX_OPTIONS: SandboxOptions = {
  timeout: 5000,
  maxMemory: 50 * 1024 * 1024, // 50MB
  allowedAPIs: ['React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'],
  restrictedAPIs: ['eval', 'Function', 'setTimeout', 'setInterval', 'fetch'],
  enableConsole: false,
  enableNetwork: false,
};

export class ComponentSandbox {
  private options: SandboxOptions;
  private validator: ComponentValidator;

  constructor(options: Partial<SandboxOptions> = {}) {
    this.options = { ...DEFAULT_SANDBOX_OPTIONS, ...options };
    this.validator = new ComponentValidator();
  }

  /**
   * Execute a custom component in a sandboxed environment
   */
  async executeComponent(
    component: CustomComponent,
    context: ComponentExecutionContext
  ): Promise<{ success: boolean; result?: React.ReactElement; error?: string }> {
    try {
      // Validate component first
      const validation = await this.validator.validateComponent(component);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Component validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Create sandboxed environment
      const sandboxedCode = this.createSandboxedCode(component.code, context);
      
      // Execute component with timeout
      const result = await this.executeWithTimeout(sandboxedCode, context);
      
      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create sandboxed code with restricted access
   */
  private createSandboxedCode(componentCode: string, context: ComponentExecutionContext): string {
    // Extract the component function/class from the code
    const componentBody = this.extractComponentBody(componentCode);
    
    // Create a safe wrapper with restricted globals
    return `
      (function() {
        'use strict';
        
        // Create restricted global scope
        const restrictedGlobals = {
          React: React,
          useState: React.useState,
          useEffect: React.useEffect,
          useCallback: React.useCallback,
          useMemo: React.useMemo,
          useRef: React.useRef,
          useContext: React.useContext,
          useReducer: React.useReducer,
          useLayoutEffect: React.useLayoutEffect,
          useImperativeHandle: React.useImperativeHandle,
          useDebugValue: React.useDebugValue,
          useId: React.useId,
          useTransition: React.useTransition,
          useDeferredValue: React.useDeferredValue,
          useSyncExternalStore: React.useSyncExternalStore,
          useInsertionEffect: React.useInsertionEffect,
        };

        // Override dangerous globals
        const originalGlobals = {};
        for (const [key, value] of Object.entries(restrictedGlobals)) {
          originalGlobals[key] = globalThis[key];
          globalThis[key] = value;
        }

        // Block dangerous APIs
        const blockedAPIs = ['eval', 'Function', 'setTimeout', 'setInterval', 'fetch', 'XMLHttpRequest'];
        for (const api of blockedAPIs) {
          if (globalThis[api]) {
            originalGlobals[api] = globalThis[api];
            globalThis[api] = undefined;
          }
        }

        // Create component context
        const props = ${JSON.stringify(context.props)};
        const theme = ${JSON.stringify(context.theme)};
        const slideId = '${context.slideId}';
        const elementId = '${context.elementId}';
        const isPreview = ${context.isPreview};
        const isEditing = ${context.isEditing};

        // Component code
        ${componentBody}

        // Restore original globals
        for (const [key, value] of Object.entries(originalGlobals)) {
          globalThis[key] = value;
        }
      })();
    `;
  }

  /**
   * Extract the main component body from the code
   */
  private extractComponentBody(code: string): string {
    // Remove imports and exports
    let body = code
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
      .replace(/export\s+default\s+/, '')
      .replace(/export\s+/, '');

    // Extract function/class component
    const functionMatch = body.match(/(?:function\s+)?([A-Z][a-zA-Z0-9]*)\s*\([^)]*\)\s*{([\s\S]*)}/);
    const arrowMatch = body.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*\([^)]*\)\s*=>\s*{([\s\S]*)}/);
    const classMatch = body.match(/class\s+([A-Z][a-zA-Z0-9]*)\s+extends\s+React\.Component\s*{([\s\S]*)}/);

    if (functionMatch) {
      return `const ${functionMatch[1]} = (props) => {${functionMatch[2]}}; return ${functionMatch[1]}(props);`;
    } else if (arrowMatch) {
      return `const ${arrowMatch[1]} = (props) => {${arrowMatch[2]}}; return ${arrowMatch[1]}(props);`;
    } else if (classMatch) {
      return `class ${classMatch[1]} extends React.Component {${classMatch[2]}}; return React.createElement(${classMatch[1]}, props);`;
    }

    // Fallback: assume it's a function component
    return `const Component = (props) => {${body}}; return Component(props);`;
  }

  /**
   * Execute component with timeout protection
   */
  private async executeWithTimeout(
    code: string,
    context: ComponentExecutionContext
  ): Promise<React.ReactElement> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Component execution timed out after ${this.options.timeout}ms`));
      }, this.options.timeout);

      try {
        // Create a safe execution environment
        const safeEval = new Function('React', 'props', 'theme', 'slideId', 'elementId', 'isPreview', 'isEditing', code);
        
        const result = safeEval(
          React,
          context.props,
          context.theme,
          context.slideId,
          context.elementId,
          context.isPreview,
          context.isEditing
        );

        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Create a component template
   */
  static createComponentTemplate(template: string, props: Record<string, any> = {}): string {
    const templates = {
      counter: `
import React, { useState } from 'react';

const Counter = ({ initialValue = 0, step = 1, label = 'Counter' }) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h3>{label}</h3>
      <div style={{ fontSize: '2rem', margin: '1rem 0' }}>{count}</div>
      <button onClick={() => setCount(count - step)}>-</button>
      <button onClick={() => setCount(count + step)}>+</button>
    </div>
  );
};

export default Counter;
      `,
      timer: `
import React, { useState, useEffect } from 'react';

const Timer = ({ duration = 60, label = 'Timer' }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h3>{label}</h3>
      <div style={{ fontSize: '2rem', margin: '1rem 0' }}>{formatTime(timeLeft)}</div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setTimeLeft(duration)}>Reset</button>
    </div>
  );
};

export default Timer;
      `,
      progress: `
import React from 'react';

const ProgressBar = ({ value = 50, max = 100, label = 'Progress', color = '#007bff' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: \`\${percentage}%\`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
      `,
      calculator: `
import React, { useState } from 'react';

const Calculator = ({ theme = 'light' }) => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);

  const handleNumber = (num) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op) => {
    setOperation(op);
    setPreviousValue(parseFloat(display));
    setDisplay('0');
  };

  const calculate = () => {
    const current = parseFloat(display);
    const previous = previousValue;
    let result;

    switch (operation) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '*': result = previous * current; break;
      case '/': result = previous / current; break;
      default: return;
    }

    setDisplay(result.toString());
    setOperation(null);
    setPreviousValue(null);
  };

  const clear = () => {
    setDisplay('0');
    setOperation(null);
    setPreviousValue(null);
  };

  const buttonStyle = {
    width: '50px',
    height: '50px',
    margin: '2px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer'
  };

  return (
    <div style={{
      width: '200px',
      padding: '1rem',
      backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa',
      borderRadius: '10px'
    }}>
      <div style={{
        width: '100%',
        height: '40px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        marginBottom: '10px',
        fontSize: '18px'
      }}>
        {display}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
        <button style={buttonStyle} onClick={clear}>C</button>
        <button style={buttonStyle} onClick={() => handleOperation('/')}>/</button>
        <button style={buttonStyle} onClick={() => handleOperation('*')}>×</button>
        <button style={buttonStyle} onClick={() => handleOperation('-')}>-</button>
        <button style={buttonStyle} onClick={() => handleNumber('7')}>7</button>
        <button style={buttonStyle} onClick={() => handleNumber('8')}>8</button>
        <button style={buttonStyle} onClick={() => handleNumber('9')}>9</button>
        <button style={buttonStyle} onClick={() => handleOperation('+')}>+</button>
        <button style={buttonStyle} onClick={() => handleNumber('4')}>4</button>
        <button style={buttonStyle} onClick={() => handleNumber('5')}>5</button>
        <button style={buttonStyle} onClick={() => handleNumber('6')}>6</button>
        <button style={buttonStyle} onClick={calculate}>=</button>
        <button style={buttonStyle} onClick={() => handleNumber('1')}>1</button>
        <button style={buttonStyle} onClick={() => handleNumber('2')}>2</button>
        <button style={buttonStyle} onClick={() => handleNumber('3')}>3</button>
        <button style={buttonStyle} onClick={() => handleNumber('0')}>0</button>
        <button style={buttonStyle} onClick={() => handleNumber('.')}>.</button>
      </div>
    </div>
  );
};

export default Calculator;
      `,
    };

    return templates[template as keyof typeof templates] || templates.counter;
  }

  /**
   * Get available component templates
   */
  static getAvailableTemplates(): string[] {
    return ['counter', 'timer', 'progress', 'calculator'];
  }

  /**
   * Validate sandbox options
   */
  static validateOptions(options: SandboxOptions): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (options.timeout && options.timeout < 1000) {
      errors.push('Timeout must be at least 1000ms');
    }

    if (options.maxMemory && options.maxMemory < 1024 * 1024) {
      errors.push('Max memory must be at least 1MB');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
