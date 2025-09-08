---
title: "I Read All Of Cloudflare's Claude-Generated Commits"
slug: "i-read-all-of-cloudflares-claude-generated-commits"
writingDate: "2025-06-06"
metadata: "ai, cloudflare, claude, anthropic, coding, swe, software, development"
type: "writing"
---

A few days ago, my CTO [Chris](https://www.linkedin.com/in/christopher-ingebrigtsen) shared Cloudflare's open-sourced [OAuth 2.1 library](https://github.com/cloudflare/workers-oauth-provider) that was almost entirely written by Claude. 

What caught my attention wasn't just the technical achievement, but that they'd documented their entire creative process. Every prompt, every iteration, every moment of human intervention was preserved in git commit messages—creating what felt like an archaeological record of human-AI collaboration. Reading through their development history was like watching a real-time conversation (and sometimes struggle) between human intuition and artificial intelligence.

The lead engineer, [@kentonv](https://github.com/kentonv), started as an AI skeptic. *"I was trying to validate my skepticism. I ended up proving myself wrong."* Two months later, Claude had generated nearly all of the code in what became a production-ready authentication library.

### Committing Prompts + Code

Kenton included the prompt used to generate code in every commit, which made this exploration possible. As we begin to lean more heavily on AI tools within development, this practice will become increasingly important. Sometimes, the original prompt is more valuable (and easier) to review than the resulting code—especially when an engineer declares an incorrect assumption that the model blindly follows.

This transparency transforms git history from a record of changes into a record of intent, creating a new form of documentation that bridges human reasoning and machine implementation.

### Patterns in Human-AI Collaboration

Reading through roughly 50 commits revealed some interesting patterns about how this collaboration actually unfolded:

**Prompt by example.** Their initial prompt was a substantial code block showing exactly how the library would be used by a worker implementing it. This approach eliminated ambiguity about method signatures while revealing practical considerations that abstract specifications often miss. It's the difference between describing a dance and demonstrating the choreography.

**"You did X, but we should do Y. pls fix."** The most effective prompts followed a consistent pattern: clear context about the current state, explanation of why change was needed, and specific direction forward. No elaborate instructions—just contextual feedback that felt remarkably like correcting a colleague.

*Personal note: In my own experience with Cursor, I've found it helpful to include direct links to documentation. I can easily reference `@<pasted_docs_link>` in prompts, though I haven't used Claude Code enough to know an equivalent workflow there.*

**Documentation becomes effortless.** A single sentence prompt generated comprehensive schema documentation. I've noticed models excel at these documentation generation tasks—transforming what used to be tedious housekeeping into natural byproducts of development.

### Where AI Struggled

About 20 commits in, I noticed Kenton had to step in manually. Claude couldn't properly move a class declaration and needed a follow-up commit just to fix the positioning. Later, Claude resorted to using `grep` and `sed` bash commands because its search-and-replace function couldn't handle duplicate code blocks.

One comment resonated with me: *"I really could have done this one faster by hand, oh well."*

Around the 40-commit mark, manual commits became frequent—styling, removing unused methods, the kind of housekeeping that coding models still struggle with. It's clear that AI generated >95% of the code, but human oversight was essential throughout.

### Practical Takeaways

If you're working with AI coding tools, a few observations from their approach:

- **Focus on the deliverable.** For a backend service, define the public endpoints and their expected behavior. For a CLI tool, show example usage. For a library, demonstrate the integration.
- **Treat prompts as version-controlled assets.** Including prompts in commit messages creates valuable context for future maintenance and debugging.
- **Expect multi-shot prompting.** Almost every feature required multiple iterations and refinements. This isn't a limitation—it's how the collaboration works.
- **Don't be afraid to get your hands dirty.** Some bugs and styling issues are faster to fix manually than to prompt through. Knowing when to intervene is part of the craft.

### Prompts as Source Code

Reading through these commits sparked an idea: what if we treated prompts as the actual source code? Imagine version control systems where you commit the prompts used to generate features rather than the resulting implementation. When models inevitably improve, you could connect the latest version and regenerate the entire codebase with enhanced capability.

This approach would make business logic inherently self-documenting—anyone who reads English could understand when features were added and why. The prompts would become like genetic instructions, containing the essential information needed to grow the application.

Of course, this assumes models can achieve strict prompt adherence and requires a **very** high level of trust in the models. In practice, generated code still needs deployment, testing, and maintenance. But it raises a fascinating question: if all business logic could be contained within self-documenting prompts, might we eventually reach a point where this history of prompt commits itself becomes the "application," running directly in a model? Could we eliminate the intermediary code generation step entirely?

Anyways, back to the the current state of reality.

### Personal Reflection

This OAuth library represents something larger than a technical milestone—it's evidence of a new creative dynamic emerging. One where artificial intelligence handles mechanical implementation while humans provide direction, context, and judgment.

It's clear there was substantial human involvement throughout this process. We're still far from AI independently implementing libraries of this scope. Almost every feature required multi-shot prompting, some bugs resisted all attempts at automated fixes, certain features would have been completed faster manually, and a human had to create every prompt and provide strategic direction.

Despite these limitations, AI generated the vast majority of functional code in this library. Claude Code was publicly launched just two weeks ago, and it's already enabling this level of collaboration.

For now, it's just another tool. But unlike a hammer, this tool is improving itself, learning from every interaction, becoming more capable with each iteration.