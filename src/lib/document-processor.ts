import { GridElement } from '@/types/slide-builder';

// Document processing types
export interface DocumentContent {
  title: string;
  content: string;
  metadata: {
    pages?: number;
    wordCount: number;
    language?: string;
    author?: string;
    createdAt?: Date;
    modifiedAt?: Date;
  };
  sections: DocumentSection[];
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  level: number; // Heading level (1-6)
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'image' | 'code';
  metadata?: Record<string, any>;
}

export interface ProcessingOptions {
  extractImages?: boolean;
  preserveFormatting?: boolean;
  generateSlides?: boolean;
  slideTemplate?: string;
  maxSlidesPerSection?: number;
}

export interface ProcessingResult {
  document: DocumentContent;
  slides?: GridElement[][];
  assets?: ExtractedAsset[];
  errors?: string[];
  warnings?: string[];
}

export interface ExtractedAsset {
  id: string;
  type: 'image' | 'table' | 'chart';
  name: string;
  data: string; // Base64 or URL
  metadata: Record<string, any>;
}

export class DocumentProcessor {
  private supportedFormats = ['.pdf', '.docx', '.md', '.txt'];

  /**
   * Check if file format is supported
   */
  isSupportedFormat(filename: string): boolean {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return this.supportedFormats.includes(extension);
  }

  /**
   * Process document from file
   */
  async processDocument(
    file: File,
    options: ProcessingOptions = {}
  ): Promise<ProcessingResult> {
    try {
      const filename = file.name.toLowerCase();
      let content: DocumentContent;

      if (filename.endsWith('.pdf')) {
        content = await this.processPDF(file);
      } else if (filename.endsWith('.docx')) {
        content = await this.processDOCX(file);
      } else if (filename.endsWith('.md')) {
        content = await this.processMarkdown(file);
      } else if (filename.endsWith('.txt')) {
        content = await this.processText(file);
      } else {
        throw new Error(`Unsupported file format: ${filename}`);
      }

      const result: ProcessingResult = {
        document: content,
        errors: [],
        warnings: [],
      };

      // Generate slides if requested
      if (options.generateSlides) {
        result.slides = await this.generateSlides(content, options);
      }

      // Extract assets if requested
      if (options.extractImages) {
        result.assets = await this.extractAssets(content);
      }

      return result;
    } catch (error) {
      return {
        document: {
          title: file.name,
          content: '',
          metadata: { wordCount: 0 },
          sections: [],
        },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Process PDF file (mock implementation)
   */
  private async processPDF(file: File): Promise<DocumentContent> {
    // In a real implementation, you would use a library like pdf-parse or PDF.js
    const text = await this.readFileAsText(file);
    
    return {
      title: file.name.replace('.pdf', ''),
      content: text,
      metadata: {
        pages: 1, // Mock
        wordCount: text.split(/\s+/).length,
        author: 'Unknown',
        createdAt: new Date(file.lastModified),
      },
      sections: this.parseTextIntoSections(text),
    };
  }

  /**
   * Process DOCX file (mock implementation)
   */
  private async processDOCX(file: File): Promise<DocumentContent> {
    // In a real implementation, you would use a library like mammoth.js
    const text = await this.readFileAsText(file);
    
    return {
      title: file.name.replace('.docx', ''),
      content: text,
      metadata: {
        wordCount: text.split(/\s+/).length,
        author: 'Unknown',
        createdAt: new Date(file.lastModified),
      },
      sections: this.parseTextIntoSections(text),
    };
  }

  /**
   * Process Markdown file
   */
  private async processMarkdown(file: File): Promise<DocumentContent> {
    const text = await this.readFileAsText(file);
    
    return {
      title: file.name.replace('.md', ''),
      content: text,
      metadata: {
        wordCount: text.split(/\s+/).length,
        language: 'markdown',
        createdAt: new Date(file.lastModified),
      },
      sections: this.parseMarkdownSections(text),
    };
  }

  /**
   * Process plain text file
   */
  private async processText(file: File): Promise<DocumentContent> {
    const text = await this.readFileAsText(file);
    
    return {
      title: file.name.replace('.txt', ''),
      content: text,
      metadata: {
        wordCount: text.split(/\s+/).length,
        createdAt: new Date(file.lastModified),
      },
      sections: this.parseTextIntoSections(text),
    };
  }

  /**
   * Read file as text
   */
  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse text into sections
   */
  private parseTextIntoSections(text: string): DocumentSection[] {
    const lines = text.split('\n');
    const sections: DocumentSection[] = [];
    let currentSection: DocumentSection | null = null;
    let sectionId = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) continue;

      // Simple heuristic for detecting headings
      if (this.isHeading(trimmedLine)) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          id: `section-${++sectionId}`,
          title: trimmedLine,
          content: '',
          level: this.getHeadingLevel(trimmedLine),
          type: 'heading',
        };
      } else if (currentSection) {
        // Add content to current section
        currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
      } else {
        // Create first section if no heading found
        currentSection = {
          id: `section-${++sectionId}`,
          title: 'Introduction',
          content: trimmedLine,
          level: 1,
          type: 'paragraph',
        };
      }
    }

    // Add final section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Parse Markdown sections
   */
  private parseMarkdownSections(text: string): DocumentSection[] {
    const lines = text.split('\n');
    const sections: DocumentSection[] = [];
    let currentSection: DocumentSection | null = null;
    let sectionId = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) continue;

      // Markdown heading detection
      if (trimmedLine.startsWith('#')) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }

        const level = (trimmedLine.match(/^#+/) || [''])[0].length;
        const title = trimmedLine.replace(/^#+\s*/, '');

        // Start new section
        currentSection = {
          id: `section-${++sectionId}`,
          title,
          content: '',
          level,
          type: 'heading',
        };
      } else if (currentSection) {
        // Add content to current section
        currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
      } else {
        // Create first section if no heading found
        currentSection = {
          id: `section-${++sectionId}`,
          title: 'Content',
          content: trimmedLine,
          level: 1,
          type: 'paragraph',
        };
      }
    }

    // Add final section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Simple heading detection heuristic
   */
  private isHeading(line: string): boolean {
    // Check for common heading patterns
    return (
      line.length < 100 && // Headings are usually short
      (line.endsWith(':') || // Ends with colon
        !!line.match(/^[A-Z][^.!?]*$/) || // All caps or title case without punctuation
        !!line.match(/^\d+\.?\s+[A-Z]/)) // Numbered heading
    );
  }

  /**
   * Get heading level
   */
  private getHeadingLevel(line: string): number {
    if (line.startsWith('#')) {
      return (line.match(/^#+/) || [''])[0].length;
    }
    
    // Simple heuristic based on line characteristics
    if (line.match(/^\d+\.?\s+/)) return 2; // Numbered
    if (line.endsWith(':')) return 3; // Colon ending
    return 1; // Default
  }

  /**
   * Generate slides from document content
   */
  private async generateSlides(
    document: DocumentContent,
    options: ProcessingOptions
  ): Promise<GridElement[][]> {
    const slides: GridElement[][] = [];
    const maxSlidesPerSection = options.maxSlidesPerSection || 3;

    // Title slide
    slides.push([
      {
        id: 'title-element',
        type: 'title',
        x: 1,
        y: 2,
        w: 10,
        h: 2,
        props: {
          text: document.title,
          level: 1,
        },
      },
      {
        id: 'subtitle-element',
        type: 'text',
        x: 1,
        y: 4,
        w: 10,
        h: 1,
        props: {
          text: `${document.metadata.wordCount} words • ${document.sections.length} sections`,
        },
      },
    ]);

    // Content slides
    for (const section of document.sections) {
      if (section.type === 'heading' && section.content.trim()) {
        const contentChunks = this.chunkContent(section.content, 300); // ~300 words per slide
        
        for (let i = 0; i < Math.min(contentChunks.length, maxSlidesPerSection); i++) {
          const slideElements: GridElement[] = [
            {
              id: `${section.id}-title-${i}`,
              type: 'title',
              x: 1,
              y: 1,
              w: 10,
              h: 1,
              props: {
                text: section.title,
                level: Math.min(section.level + 1, 6),
              },
            },
            {
              id: `${section.id}-content-${i}`,
              type: 'paragraph',
              x: 1,
              y: 3,
              w: 10,
              h: 8,
              props: {
                text: contentChunks[i],
              },
            },
          ];

          slides.push(slideElements);
        }
      }
    }

    return slides;
  }

  /**
   * Chunk content into smaller pieces
   */
  private chunkContent(content: string, maxWords: number): string[] {
    const words = content.split(/\s+/);
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += maxWords) {
      chunks.push(words.slice(i, i + maxWords).join(' '));
    }
    
    return chunks;
  }

  /**
   * Extract assets from document
   */
  private async extractAssets(document: DocumentContent): Promise<ExtractedAsset[]> {
    const assets: ExtractedAsset[] = [];
    
    // Mock asset extraction
    // In a real implementation, you would extract images, tables, etc.
    
    return assets;
  }

  /**
   * Get supported file formats
   */
  getSupportedFormats(): string[] {
    return [...this.supportedFormats];
  }

  /**
   * Validate file before processing
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 50MB limit' };
    }
    
    if (!this.isSupportedFormat(file.name)) {
      return { 
        isValid: false, 
        error: `Unsupported format. Supported: ${this.supportedFormats.join(', ')}` 
      };
    }
    
    return { isValid: true };
  }
}

// Export singleton instance
export const documentProcessor = new DocumentProcessor();
