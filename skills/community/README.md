# Community Skills Directory

Welcome to the **MBTI AI Skills** community repository!

This directory allows anyone to propose and contribute custom cognitive Skills without altering the core framework engine.

---

## How to Create a New Skill

To contribute a new Skill, create a JSON file inside `skills/community/` named `<your-skill-id>.json`.

### Schema & Required Fields

```json
{
  "id": "critical-inquiry",
  "name": "Critical Inquiry",
  "icon": "Search",
  "shortDescription": "Interrogate foundational premises and identify logical oversights.",
  "description": "Examines premises through structured Socratic questioning, uncovering bias and evaluating argumentative soundness.",
  "behaviors": [
    "Identify unverified presuppositions in arguments",
    "Employ Socratic questioning to evaluate conceptual rigor",
    "Surface confirmation bias in hypothesis formation",
    "Map argument vulnerabilities and inferential leaps"
  ],
  "compatibleProfiles": ["INTP", "INTJ", "ENTP", "INFJ"],
  "tags": ["socratic", "critical-thinking", "logic", "rigor"],
  "examples": [
    {
      "context": "Evaluating a strategic decision under high uncertainty",
      "appliedBehavior": "Maps untested premises and poses 3 foundational stress-test questions."
    }
  ],
  "author": {
    "name": "Your Name / Handle",
    "github": "https://github.com/yourhandle"
  }
}
```

### Required Fields Specification

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique kebab-case identifier (e.g. `socratic-method`) |
| `name` | `string` | Human-readable title of the Skill |
| `icon` | `string` | Lucide icon identifier (e.g. `Brain`, `Compass`, `Search`) |
| `shortDescription` | `string` | Single-sentence summary for preview chips |
| `description` | `string` | In-depth description of cognitive function & focus |
| `behaviors` | `string[]` | 4–8 concrete behavioral directives included in generated system prompts |
| `compatibleProfiles`| `MBTITypeCode[]` | List of MBTI types this skill natively pairs with |
| `tags` | `string[]` | Searchable keywords and categorical tags |
| `examples` | `object[]` | Illustrative application situations and outcomes |

---

## Contribution Workflow

1. Fork this repository.
2. Create your skill file: `skills/community/<skill-id>.json`.
3. Open a Pull Request with the title `[Skill]: Add <Skill Name>`.
4. Our automated validation tests will verify your JSON schema.
