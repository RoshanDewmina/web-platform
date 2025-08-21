'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface CodeEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'html',
  'css',
  'sql',
  'bash',
  'json',
  'markdown',
];

export function CodeEditor({ content, onChange }: CodeEditorProps) {
  const [code, setCode] = useState(content?.code || '');
  const [language, setLanguage] = useState(content?.language || 'javascript');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange({ ...content, code: newCode });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    onChange({ ...content, language: newLanguage });
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='code-language'>Language</Label>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger id='code-language'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='code-content'>Code</Label>
        <Textarea
          id='code-content'
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder='Enter your code here...'
          className='font-mono text-sm min-h-[200px]'
        />
      </div>
    </div>
  );
}
