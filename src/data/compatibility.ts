import type { CompatibilityEntry } from '../types';

export const compatibilityEntries: CompatibilityEntry[] = [
  {
    id: 'claude-code',
    tool: 'Claude Code',
    category: 'CLI & Coding Agent',
    supportLevel: 'unverified',
    summary: 'Compatibility not verified for automatic SKILL.md discovery; manual Markdown usage is supported.',
    verified: false,
    details:
      'Claude Code supports Markdown-based project instructions and skill packages, but exact native skill directory paths and auto-discovery behavior depend on your installed version and configuration and are not verified here.',
    steps: [
      'Download or copy the exported SKILL.md or Cognitive Profile Markdown.',
      'Check your local Claude Code documentation for the exact skill or instruction file location.',
      'Alternatively, paste the Markdown body directly into your session prompt or project instruction file.',
    ],
    notes: 'Compatibility not verified for automated directory placement — verify paths in official Claude Code docs before placing files.',
  },
  {
    id: 'claude',
    tool: 'Claude (Web & Desktop)',
    category: 'Chat Assistant',
    supportLevel: 'manual',
    summary: 'Manual use of exported Markdown in Projects, Custom Instructions, or chat prompts.',
    verified: true,
    details:
      'Claude accepts plain Markdown instructions directly in Project knowledge/instructions, profile preferences, or at the beginning of a conversation.',
    steps: [
      'Export your Skill, Pack, or Cognitive Profile as Markdown or open SKILL.md from the ZIP.',
      'Open Claude Projects (or your chat/profile instructions) and paste the Markdown content.',
      'Start a new conversation so the cognitive directives apply from the first turn.',
    ],
  },
  {
    id: 'chatgpt',
    tool: 'ChatGPT',
    category: 'Chat Assistant',
    supportLevel: 'manual',
    summary: 'Manual use of exported Markdown in Custom Instructions, Custom GPTs, or prompts.',
    verified: true,
    details:
      'ChatGPT does not natively auto-discover local SKILL.md directories, but accepts exported Markdown instructions in Custom Instructions, Custom GPT system prompts, or conversation starters.',
    steps: [
      'Copy the exported Markdown (or the contents of SKILL.md).',
      'Paste it into ChatGPT Custom Instructions ("How would you like ChatGPT to respond?") or a Custom GPT Instructions field.',
      'For one-off sessions, paste the Markdown at the top of your first message.',
    ],
  },
  {
    id: 'gemini',
    tool: 'Gemini',
    category: 'Chat Assistant & AI Studio',
    supportLevel: 'manual',
    summary: 'Manual use of exported Markdown in Gems, Google AI Studio System Instructions, or prompts.',
    verified: true,
    details:
      'Gemini accepts Markdown-formatted behavioral directives in Gems instructions, Google AI Studio System Instructions, or directly in chat.',
    steps: [
      'Copy the exported Markdown or SKILL.md contents.',
      'Paste into a Gem’s instructions, Google AI Studio’s System Instructions panel, or the start of your chat.',
      'Adjust intensity or communication style in the Builder before exporting if you want a shorter prompt.',
    ],
  },
  {
    id: 'cursor',
    tool: 'Cursor',
    category: 'AI Code Editor',
    supportLevel: 'tool-specific',
    summary: 'Tool-specific rules/instructions supported; native SKILL.md auto-import not verified.',
    verified: false,
    details:
      'Cursor supports project-level Markdown rules and chat context, but native SKILL.md folder auto-discovery is not verified across versions.',
    steps: [
      'Export the Skill or Cognitive Profile as Markdown.',
      'Paste the Markdown into your Cursor rules or reference it in Cursor chat context according to your Cursor version.',
      'Verify the active rules directory in Cursor’s official documentation before relying on automatic loading.',
    ],
    notes: 'Compatibility not verified for native SKILL.md directory discovery.',
  },
  {
    id: 'vs-code',
    tool: 'VS Code',
    category: 'IDE & Extensions',
    supportLevel: 'tool-specific',
    summary: 'Tool-specific extension instructions supported; native SKILL.md auto-import not verified.',
    verified: false,
    details:
      'VS Code AI assistants (such as Copilot or third-party extensions) each define their own custom instruction formats. Native SKILL.md folder discovery is not verified.',
    steps: [
      'Export the Skill or Cognitive Profile as Markdown.',
      'Copy the Markdown body into your chosen AI extension’s custom instructions or chat prompt.',
      'Consult your extension’s documentation for any workspace instruction file conventions.',
    ],
    notes: 'Compatibility not verified across all VS Code AI extensions.',
  },
  {
    id: 'opencode',
    tool: 'OpenCode',
    category: 'CLI & Coding Agent',
    supportLevel: 'unverified',
    summary: 'Compatibility not verified for native skill directory import; manual Markdown usage works.',
    verified: false,
    details:
      'Exact native SKILL.md directory paths and automatic skill loading in OpenCode are not verified from official docs in this app.',
    steps: [
      'Export your Skill or Cognitive Profile as Markdown.',
      'Check OpenCode’s official documentation for supported instruction or skill paths.',
      'Paste or include the Markdown content manually in your session context.',
    ],
    notes: 'Compatibility not verified.',
  },
  {
    id: 'codex',
    tool: 'Codex',
    category: 'CLI & Coding Agent',
    supportLevel: 'unverified',
    summary: 'Compatibility not verified for native skill directory import; manual Markdown usage works.',
    verified: false,
    details:
      'Exact native SKILL.md directory paths and automatic skill loading in Codex are not verified from official docs in this app.',
    steps: [
      'Export your Skill or Cognitive Profile as Markdown.',
      'Check Codex’s official documentation for supported instruction files or system prompt flags.',
      'Supply the Markdown content manually as context or system instructions.',
    ],
    notes: 'Compatibility not verified.',
  },
  {
    id: 'generic-markdown',
    tool: 'Generic Markdown-Compatible AI Tools',
    category: 'Universal / API / Local LLMs',
    supportLevel: 'manual',
    summary: 'Universal portable Markdown compatible with any system prompt or LLM interface.',
    verified: true,
    details:
      'Every exported SKILL.md, Skill Pack, and Cognitive Profile is plain UTF-8 Markdown with optional YAML frontmatter. It works anywhere you can supply a system prompt, persona file, or context document.',
    steps: [
      'Download the .md file or extract SKILL.md from the exported .zip archive.',
      'Paste the Markdown into your API system message, local LLM UI (e.g., Ollama/LM Studio/Open WebUI), or prompt template.',
      'Treat all behavioral directives as experimental interaction patterns.',
    ],
  },
];
