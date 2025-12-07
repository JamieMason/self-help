# Information Architecture: For the Web and Beyond — Key Learnings

Sources: O'Reilly book overview, Nielsen Norman Group articles, Peter Morville's blog
(intertwingled.org), Semantic Studios Authors: Louis Rosenfeld, Peter Morville, Jorge Arango

## Summary

Information architecture (IA) is the structural design of shared information environments—the art
and science of organising and labelling content to support usability and findability. The book
establishes IA as a discipline built on three pillars: context (business goals, culture), content
(what exists, its structure), and users (their needs, behaviours, mental models). IA creates the
invisible skeleton that makes visible navigation possible.

---

## Principles for Self-Help

### 1. The Three Circles: Context, Content, Users

Every IA decision balances three factors:

- **Context:** Business goals, politics, culture, technology constraints
- **Content:** Volume, structure, ownership, dynamism
- **Users:** Audience, tasks, needs, information-seeking behaviours

**Application to decision trees:**

- Context = why does this wiki exist? What problem does it solve?
- Content = what answers exist? How are they structured?
- Users = who is asking? What do they actually need to do?
- A branch that serves content but ignores users will fail

### 2. Information Scent: Users Follow Their Noses

Users estimate the value of a path before taking it, based on:

- The label (most important)
- Context/content surrounding the label
- Prior knowledge and experience

Strong scent = high confidence the path leads to the goal. Weak scent = users abandon or backtrack.

**Application to decision trees:**

- Branch labels ARE the scent—they must clearly predict what's below
- Vague labels ("Learn more", "Resources", "Information") emit no scent
- Users won't click a path unless they believe it leads to their answer
- Context matters: same label can have different scent in different trees
- Don't rely on users reading surrounding text—the label must stand alone

### 3. Flat vs Deep Hierarchies

**Flat hierarchy:** Many options at each level, fewer levels deep

- Pros: Content more discoverable, fewer clicks
- Cons: Can overwhelm, harder to scan long lists

**Deep hierarchy:** Few options at each level, more levels deep

- Pros: Manageable chunks, clearer categories
- Cons: Harder to find buried content, more clicks, easier to get lost

**Application to decision trees:**

- Decision trees naturally favour depth (one question at a time)
- But excessive depth frustrates: "How many more questions?"
- Sweet spot: 3-5 children per branch, 3-4 levels deep
- Provide shortcuts (breadcrumbs, "start over") for orientation
- If a branch needs 10+ children, consider restructuring

### 4. Organisation Schemes: Exact vs Ambiguous

**Exact schemes:** Alphabetical, chronological, geographical

- Objective, unambiguous
- Work when users know what they're looking for

**Ambiguous schemes:** Topic, task, audience, metaphor

- Subjective, require thought
- Work for browsing and exploring

**Application to decision trees:**

- Most wikis need ambiguous (topic/task) organisation
- Task-based schemes align with user goals: "I need to..."
- Audience-based schemes often fail (users don't self-identify correctly)
- Avoid mixing schemes at the same level—confuses mental models

### 5. Labelling: The Single Most Important Element

Labels are the face of your IA. Bad labels hide good content.

**Principles:**

- Use language users recognise (not internal jargon)
- Be specific—"Applications" beats "Stuff"
- Be consistent in tone, grammatical structure, terminology
- Front-load with keywords
- Test labels with users (card sorting, tree testing)

**Application to decision trees:**

- Every branch label is a promise to the user
- Broken promises (misleading labels) destroy trust
- Parallel structure helps scanning: all verbs, all nouns, all questions
- Labels should make sense without their parent context
- If you need to explain a label, the label is wrong

### 6. Navigation: Embedded vs Supplemental

**Embedded navigation:** Global nav, local nav, contextual links—built into pages

**Supplemental navigation:** Sitemaps, indexes, guides—exist outside the content

**Application to decision trees:**

- The tree IS the navigation—there's no separate nav layer
- This makes structure even more critical
- Consider supplemental aids: "How to use this guide", topic index
- Breadcrumbs essential for orientation in deep trees

### 7. Polyhierarchy: Items with Multiple Parents

Digital content can exist in multiple locations (unlike physical books on shelves).

**Benefits:**

- Supports different mental models
- Improves findability for ambiguous items

**Risks:**

- Overuse bloats navigation, increases cognitive load
- Conflicts with breadcrumbs (which path to show?)

**Application to decision trees:**

- Generally avoid in decision trees—one path to each answer
- If same answer applies to multiple paths, use links rather than duplication
- Exception: "quick links" to common destinations from multiple branches

### 8. Findability vs Discoverability

**Findability:** Can users locate what they're looking for? **Discoverability:** Can users stumble
upon useful things they didn't know existed?

**Application to decision trees:**

- Primary goal: findability (user has a question, finds the answer)
- Secondary: discoverability (user learns related options exist)
- Decision trees optimise for findability by design
- Consider "related answers" or "you might also need" for discoverability

---

## The LATCH Framework

Richard Saul Wurman's five ways to organise any information:

| Method        | Description                    | Example                 |
| ------------- | ------------------------------ | ----------------------- |
| **L**ocation  | By geography or physical space | Map of offices          |
| **A**lphabet  | A-Z ordering                   | Glossary, directory     |
| **T**ime      | Chronological sequence         | Timeline, process steps |
| **C**ategory  | By similarity or type          | Topics, departments     |
| **H**ierarchy | By magnitude or importance     | Rankings, priorities    |

**Application to decision trees:**

- Most wikis use **Category** (topic-based)
- **Time** works for sequential processes ("Step 1, Step 2...")
- **Hierarchy** can prioritise: "Most common issues" first
- **Alphabet** rarely useful in decision trees (users don't know terms)
- **Location** only if geography is genuinely relevant

---

## IA Research Methods

### Card Sorting

Users group content into categories that make sense to them.

- **Open sort:** Users create and name their own categories
- **Closed sort:** Users sort into predefined categories

**Use for:** Understanding mental models, validating proposed structures

### Tree Testing

Users attempt to find items in a proposed hierarchy (no visual design).

- Measures: Success rate, directness, time
- Reveals: Where users get lost, which labels confuse

**Use for:** Evaluating draft structures before building

**Application to decision trees:**

- Card sort your potential answers: how do users group them?
- Tree test your proposed structure: can users find answers?
- Iterate based on results before finalising

---

## Patterns to Adopt

### Category Landing Pages

Create intermediate pages that:

- Summarise what's in the section
- Help users confirm they're on the right path
- Provide context before drilling deeper

### Breadcrumbs for Deep Trees

Show: Home > Parent > Current

- Helps orientation ("where am I?")
- Enables quick navigation up
- Essential when depth exceeds 2 levels

### Consistent Labelling System

Choose a structure and stick to it:

- All verbs: "Apply", "Check", "Find"
- All questions: "What is...?", "How do I...?"
- All noun phrases: "Application process", "Eligibility criteria"

### Search + Structure Integration

Search results should:

- Show where items live in the hierarchy
- Allow navigation to related items
- Not exist as the only way to find things

---

## Anti-Patterns to Avoid

### No Structure (The Swamp)

❌ Flat list of unconnected items ✅ Organised hierarchy with clear relationships

### Invisible Navigation

❌ Options hidden until hover/click ✅ All navigation permanently visible

### Inconsistent Navigation

❌ Nav options change as users move around ✅ Consistent global nav throughout

### Made-Up Terminology

❌ Branded/invented terms users don't know ✅ Plain language users actually search for

### Extreme Polyhierarchy

❌ Same item in 5+ categories ✅ Items in 1-2 logical locations, with cross-links

### Audience-Based Primary Navigation

❌ "For Students | For Staff | For Parents" ✅ Task-based: "Apply | Pay | Get Help"

### Missing Intermediate Pages

❌ Jump straight from top level to leaf content ✅ Category pages that provide context and overview

---

## Key Quotes

> "Information architecture is the practice of deciding how to arrange the parts of something to be
> understandable."

> "If you can't find it, you can't use it." — Peter Morville

> "The information scent of a source represents the user's imperfect estimate of the value that
> source will deliver."

> "Structure and navigation must support each other and integrate with search."

> "Old words are better. When users understand their choices, they're more likely to pick the right
> one."

> "Navigation exists to help users, not to be a puzzle in its own right."

---

## Key Concepts from Nielsen Norman Group

### Top 10 IA Mistakes (Jakob Nielsen)

1. No structure (content swamp)
2. Search and structure not integrated
3. Missing category landing pages
4. Extreme polyhierarchy
5. Subsites poorly integrated with main site
6. Invisible navigation options
7. Uncontrollable navigation elements
8. Inconsistent navigation
9. Too many navigation techniques
10. Made-up menu options

### Information Foraging Theory

Users behave like animals foraging for food:

- They sniff for "scent" (clues that lead to their goal)
- They satisfice (stop when they find "good enough")
- They have limited attention/patience
- Strong scent = they follow the path
- Weak scent = they abandon or backtrack

---

## Application to Self-Help Decision Trees

### Structure Principles

1. **Maximum depth:** 4-5 levels (beyond this, users lose orientation)
2. **Children per branch:** 3-7 options (beyond this, hard to scan)
3. **One answer per leaf:** Avoid cramming multiple topics
4. **Clear paths:** Each question narrows the options meaningfully
5. **No dead ends:** Every path leads somewhere useful

### Label Principles

1. **Front-load:** Put distinguishing words first
2. **Be specific:** "Tax refund status" not "Status"
3. **Match user language:** What would they search for?
4. **Parallel structure:** Consistent grammatical form
5. **Self-sufficient:** Makes sense without parent context

### Navigation Principles

1. **Breadcrumbs:** Always show current location
2. **Back option:** Easy to return to previous question
3. **Start over:** Quick reset to beginning
4. **Progress indicator:** How deep am I? How much left?

---

## Action Items

- [ ] Audit current tree depth—flag any paths exceeding 4 levels
- [ ] Review branch labels for information scent (would users click?)
- [ ] Check for consistent labelling structure at each level
- [ ] Ensure no branch has more than 7 children
- [ ] Add breadcrumbs/progress indicators to interface
- [ ] Consider tree testing with target users
- [ ] Review for audience-based navigation (convert to task-based)
- [ ] Check all labels against "made-up terminology" anti-pattern
