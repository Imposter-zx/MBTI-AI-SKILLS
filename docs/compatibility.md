# Compatibility Guide

Portable `SKILL.md` files are plain UTF-8 Markdown documents with YAML frontmatter (`name`, `description`) and structured behavioral sections. Because AI tools differ widely in how they load instructions, **this project does not claim universal native compatibility**.

Instead, compatibility falls into three distinct categories:
1. **Native Skill Support** — The tool natively discovers `SKILL.md` directories and registers them as skills.
2. **Manual Use of Markdown Instructions** — You copy/paste the Markdown content into system prompts, custom instructions, projects, or chat context.
3. **Tool-Specific Installation / Import** — The tool supports its own rules, prompt files, or extension-specific instruction mechanisms rather than a universal `SKILL.md` standard.

> **Verification Policy**: Where exact native `SKILL.md` directory paths or auto-discovery behavior have not been verified against official documentation in this repository, they are explicitly marked **`Compatibility not verified`**. Always check your tool's official documentation before relying on automated directory placement.

---

## Tool Compatibility Matrix

| Tool | Category | Support Type | Native `SKILL.md` Status | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **Claude Code** | CLI & Coding Agent | Manual / Unverified Native | `Compatibility not verified` | Manual Markdown usage works; automatic `SKILL.md` directory discovery and exact paths depend on your version/config and are not verified here. |
| **Claude (Web & Desktop)** | Chat Assistant | Manual Markdown | Not native (Manual) | Paste exported Markdown into Claude Projects, profile preferences, or the start of a chat. |
| **ChatGPT** | Chat Assistant | Manual Markdown | Not native (Manual) | Paste exported Markdown into Custom Instructions, Custom GPT instructions, or a conversation starter. |
| **Gemini** | Chat Assistant & AI Studio | Manual Markdown | Not native (Manual) | Paste exported Markdown into Gems instructions, Google AI Studio System Instructions, or chat. |
| **Cursor** | AI Code Editor | Tool-Specific | `Compatibility not verified` | Supports project-level Markdown rules and chat context; native `SKILL.md` folder auto-discovery is not verified across versions. |
| **VS Code** | IDE & Extensions | Tool-Specific | `Compatibility not verified` | AI extensions (e.g., Copilot or third-party extensions) define their own custom instruction formats; native `SKILL.md` folder discovery is not verified. |
| **OpenCode** | CLI & Coding Agent | Manual / Unverified Native | `Compatibility not verified` | Manual Markdown usage in session context works; exact native `SKILL.md` directory paths and auto-loading are not verified. |
| **Codex** | CLI & Coding Agent | Manual / Unverified Native | `Compatibility not verified` | Manual Markdown usage as context or system instructions works; exact native `SKILL.md` directory paths and auto-loading are not verified. |
| **Generic Markdown-Compatible AI Tools** | Universal / API / Local LLMs | Manual Markdown | Verified (Manual) | Works anywhere you can supply a system message, persona file, or context document (APIs, Ollama, LM Studio, Open WebUI, etc.). |

---

## Details by Tool

### Claude Code
- **Support**: Manual Markdown supported; native directory auto-discovery **`Compatibility not verified`**.
- **How to use**: Consult your local Claude Code documentation for supported project instruction or skill paths, or paste the `SKILL.md` body directly into your session prompt.

### Claude (Web & Desktop)
- **Support**: Manual Markdown (`Verified`).
- **How to use**: Copy the `SKILL.md` or Cognitive Profile Markdown and paste it into a Claude Project's instructions or at the beginning of a new conversation.

### ChatGPT
- **Support**: Manual Markdown (`Verified`).
- **How to use**: Paste the Markdown into **Custom Instructions** ("How would you like ChatGPT to respond?"), a **Custom GPT** Instructions field, or your first chat message.

### Gemini
- **Support**: Manual Markdown (`Verified`).
- **How to use**: Paste the Markdown into a **Gem**'s instructions, **Google AI Studio**'s System Instructions panel, or directly into chat.

### Cursor
- **Support**: Tool-specific rules/context; native `SKILL.md` auto-discovery **`Compatibility not verified`**.
- **How to use**: Paste the Markdown into your Cursor rules or reference it in Cursor chat context according to your Cursor version. Check Cursor's official docs for active rules directory conventions.

### VS Code
- **Support**: Tool-specific extension instructions; native `SKILL.md` auto-discovery **`Compatibility not verified`**.
- **How to use**: Copy the Markdown body into your AI extension's custom instructions or chat prompt, and check the extension's documentation for workspace instruction file conventions.

### OpenCode
- **Support**: Manual Markdown supported; native skill directory import **`Compatibility not verified`**.
- **How to use**: Check OpenCode's official documentation for supported instruction or skill paths, or include the Markdown content manually in your session context.

### Codex
- **Support**: Manual Markdown supported; native skill directory import **`Compatibility not verified`**.
- **How to use**: Check Codex's official documentation for supported instruction files or system prompt flags, or supply the Markdown content manually as context/system instructions.

### Generic Markdown-Compatible AI Tools
- **Support**: Manual Markdown (`Verified`).
- **How to use**: Every exported `SKILL.md`, Skill Pack, and Cognitive Profile is standard UTF-8 Markdown. Paste it into any LLM API `system` message, local LLM UI, or prompt template.
