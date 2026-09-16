import { useState } from 'react';
import { Copy, Download, RotateCcw, CheckCheck, FileText } from 'lucide-react';
import { Button } from './Button';
import { estimateTokens } from '../../engine/promptGenerator';

interface PromptPreviewProps {
  prompt: string;
  onReset?: () => void;
  editable?: boolean;
  onEdit?: (value: string) => void;
}

export function PromptPreview({ prompt, onReset, editable = false, onEdit }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mbti-ai-system-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tokens = estimateTokens(prompt);
  const chars = prompt.length;

  return (
    <div className="rounded-xl border border-white/8 bg-[#0d1421] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-white/2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-400">system-prompt.txt</span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-500 font-mono">{chars} chars</span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-500 font-mono">~{tokens} tokens</span>
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
          <Button variant={copied ? 'secondary' : 'primary'} size="sm" onClick={handleCopy}>
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {editable && onEdit ? (
        <textarea
          value={prompt}
          onChange={(e) => onEdit(e.target.value)}
          className="w-full bg-transparent font-mono text-sm text-slate-300 p-4 min-h-96 resize-y focus:outline-none leading-relaxed"
          spellCheck={false}
          aria-label="System prompt editor"
        />
      ) : (
        <pre className="p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
          {prompt || '// Configure a profile above to generate a system prompt.'}
        </pre>
      )}
    </div>
  );
}
