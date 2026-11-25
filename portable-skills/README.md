# MBTI AI Skills — Portable Skills Library

A collection of 12 portable, framework-agnostic `SKILL.md` modules inspired by cognitive problem-solving modes. Each skill is self-contained with YAML frontmatter and structured behavioral instructions that can be used in any AI coding assistant or chat interface.

## Available Skills

| Skill | Description | File |
| :--- | :--- | :--- |
| **Analytical** | Decompose problems, identify assumptions, build logical explanations. | [analytical/SKILL.md](./analytical/SKILL.md) |
| **Tactical** | Focus on immediate practical problems with actionable steps. | [tactical/SKILL.md](./tactical/SKILL.md) |
| **Strategic** | Think long-term, define objectives, plan multiple stages. | [strategic/SKILL.md](./strategic/SKILL.md) |
| **Brainstorming** | Generate many possibilities and explore unconventional ideas. | [brainstorming/SKILL.md](./brainstorming/SKILL.md) |
| **Troubleshooting** | Diagnose problems systematically, identify root causes, fix. | [troubleshooting/SKILL.md](./troubleshooting/SKILL.md) |
| **Creative** | Generate original concepts using divergent thinking. | [creative/SKILL.md](./creative/SKILL.md) |
| **Empathy** | Consider emotional context and adapt communication. | [empathy/SKILL.md](./empathy/SKILL.md) |
| **Structured** | Organize information, follow procedures, maintain consistency. | [structured/SKILL.md](./structured/SKILL.md) |
| **Experimental** | Form hypotheses, design small experiments, learn from results. | [experimental/SKILL.md](./experimental/SKILL.md) |
| **Debate** | Challenge assumptions, present counterarguments, identify weaknesses. | [debate/SKILL.md](./debate/SKILL.md) |
| **Optimization** | Compare alternatives, identify bottlenecks, reduce complexity. | [optimization/SKILL.md](./optimization/SKILL.md) |
| **Research** | Separate facts from assumptions, build evidence-based conclusions. | [research/SKILL.md](./research/SKILL.md) |

---

## Installation & Usage

### Method 1: Native Skill Support
If your AI tool or agent platform supports `SKILL.md` skill directories natively:
1. Copy one or more skill folders (e.g., `portable-skills/analytical/`) into your tool's configured skills directory (check your tool's documentation for its exact skills path).
2. Restart or reload your tool if required, then invoke or reference the skill by its `name` (e.g., `analytical`).

### Method 2: Manual Copy / Paste
For any AI chat interface, IDE assistant, or custom prompt setup:
1. Open the desired `<skill>/SKILL.md` file.
2. Copy the markdown content (or just the body below the `---` YAML frontmatter).
3. Paste it into your system prompt, custom instructions, project rules file, or directly at the start of a conversation before your task prompt.
