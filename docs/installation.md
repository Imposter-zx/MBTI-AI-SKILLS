# Installing & Using Portable AI Skills

Every skill, MBTI skill pack, and custom Cognitive Profile in this project can be exported as portable `SKILL.md` Markdown files or `.zip` packages. Because different AI tools handle instructions differently, there are two ways to use them.

> **Important**: Method 2 (Manual Usage) applies the skill's behavioral instructions via your system prompt, custom instructions, or chat context. It is **not** equivalent to native `SKILL.md` auto-discovery or tool-level skill registration.

---

## Method 1: Native Skill Support

Use this method if your AI tool or agent platform natively discovers and loads `SKILL.md` directories.

1. **Download the ZIP package**
   Export an individual skill, an MBTI Skill Pack, or your Cognitive Profile as a `.zip` archive from the app (or use a folder from [`portable-skills/`](../portable-skills/README.md)).
2. **Extract the archive**
   Unzip the downloaded file. Each skill lives in its own directory containing a `SKILL.md` file (e.g., `analytical/SKILL.md`), along with any accompanying `README.md` or `examples/`.
3. **Place in your tool's skill directory**
   Move the extracted skill folder(s) into the skills directory configured by your AI tool. Consult your tool's official documentation for its exact skills directory path, as paths vary by tool and version.
4. **Restart or refresh**
   Reload your editor, CLI, or agent session so it indexes the newly added `SKILL.md` files.
5. **Verify**
   Confirm the skill appears in your tool's skill list or invoke it by its `name` (defined in the YAML frontmatter of `SKILL.md`).

---

## Method 2: Manual Usage (Copy & Paste)

Use this method for chat assistants, APIs, local LLMs, or any tool where native `SKILL.md` discovery is unavailable or unverified.

1. **Open `SKILL.md`**
   Open the exported `.md` file (or extract `SKILL.md` from the `.zip` archive) in any text editor.
2. **Copy the instructions**
   Copy the Markdown body (you may include or omit the `---` YAML frontmatter at the top, depending on whether your tool expects plain instructions).
3. **Paste into system prompt or custom instructions**
   - **System / Custom Instructions**: Paste into your tool's persistent system prompt, project instructions, or persona settings.
   - **Per-Conversation**: Paste the instructions at the top of your first message before your task prompt.

> **Note**: Manual copy/paste relies on the model following prompt instructions in context; it does not register tool commands, lifecycle hooks, or native skill triggers.

---

## Examples by Export Type

### 1. Individual Skill (e.g., `analytical`)
- **ZIP structure**:
  ```text
  analytical/
  ├── SKILL.md
  ├── README.md
  └── examples/
      └── example-1.md
  ```
- **Native**: Place `analytical/` into your tool's skills directory and reference `analytical`.
- **Manual**: Copy the body of `analytical/SKILL.md` into your system prompt before asking the model to audit an architecture or compare hypotheses.

### 2. MBTI Skill Pack (e.g., `INTJ` or `ENFP` Pack)
MBTI Skill Packs are experimental cognitive configurations bundling a profile's recommended skills.
- **ZIP structure**:
  ```text
  README.md
  pack.json
  skills/
  ├── strategic/SKILL.md
  ├── analytical/SKILL.md
  └── ...
  ```
- **Native**: Copy the individual folders inside `skills/` into your tool's skills directory.
- **Manual**: Download the combined pack Markdown (or concatenate the `SKILL.md` files you want) and paste it into a Project or Custom Instructions field.

### 3. Cognitive Profile Export
A Cognitive Profile combines a base MBTI-inspired profile, active skills with custom intensities, communication preferences, and custom instructions into one portable bundle.
- **ZIP structure**:
  ```text
  <profile-slug>/
  ├── SKILL.md
  ├── profile.json
  └── README.md
  ```
- **Native**: Place `<profile-slug>/` in your tool's skills directory, or keep `profile.json` to re-import into the Cognitive Profile Builder later.
- **Manual**: Paste `<profile-slug>/SKILL.md` directly into your AI assistant's system instructions to apply the full cognitive persona.
