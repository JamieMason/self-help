# Self-Help Wiki Authoring Guidelines

Synthesised from research into information architecture, content design, usability, cognitive
psychology, and conversational interaction.

---

## Design Philosophy

### The User Is Not You

Users arrive stressed, distracted, and time-poor. They scan, don't read. They satisfice — clicking
the first "good enough" option, not evaluating all choices. Design for System 1 (fast, intuitive)
processing; reserve System 2 (slow, analytical) engagement for genuinely complex decisions.

### Labels Are the Interface

Branch labels aren't descriptions — they're the entire user experience. Users construct meaning from
labels alone. A brilliant answer behind a confusing label might as well not exist.

### Structure Shapes Understanding

How you organise information changes how people find, understand, and use it. Every branch point
shapes the user's journey. Poor structure hides good content.

### The Tree Is a Conversation

Decision trees are turn-based conversations toward a shared goal. Each branch is a question, each
selection an answer. Design for the rhythm of natural dialogue.

---

## Branch Labels

### Core Principles

**Front-load with key words.** Users scan the first 2-3 words. Put distinguishing information first,
not last.

| ❌ Bad                                  | ✅ Good                |
| --------------------------------------- | ---------------------- |
| Information about tax refunds           | Tax refund status      |
| How to apply for a new passport         | Apply for a passport   |
| What you need to know about eligibility | Check your eligibility |

**Use user language.** Write what users would search for, not your internal terminology.

| ❌ Bad                          | ✅ Good              |
| ------------------------------- | -------------------- |
| Initiate credential recovery    | Reset your password  |
| Navigate to configuration panel | Change your settings |
| Utilise self-service options    | Help yourself        |

**Be specific.** Vague labels emit no "information scent" — users can't predict where they lead.

| ❌ Bad      | ✅ Good                     |
| ----------- | --------------------------- |
| Resources   | Guides and templates        |
| Information | How it works                |
| Learn more  | See pricing details         |
| Other       | (restructure to avoid this) |

**Make labels self-sufficient.** Each label should make sense without seeing its parent. Users
encounter labels out of context (search results, breadcrumbs, shared links).

**Keep labels scannable.** Aim for 3-6 words. Long labels force users into System 2 processing.

### Label Structure

**Parallel structure.** Consistent grammatical form at each level helps scanning:

All verbs:

- Apply for benefits
- Check your eligibility
- Report a change

All nouns:

- Application process
- Eligibility criteria
- Required documents

All questions:

- What do I need?
- How long will it take?
- Who can apply?

**Don't mix structures** at the same level:

- ❌ "How do I apply?" / "Eligibility" / "Check status"
- ✅ "How do I apply?" / "Am I eligible?" / "What's my status?"

### Action-Oriented Labels

**Prefer verbs over nouns** for task-based content:

| ❌ Passive       | ✅ Active           |
| ---------------- | ------------------- |
| Password reset   | Reset your password |
| Account creation | Create an account   |
| Refund policy    | Get a refund        |

**Good starting verbs:** Apply, Check, Find, Get, Report, Request, Update, View

**Avoid:** Understand, Know, Be aware of, Learn (unless compliance requires comprehension)

### Testing Labels

Ask: "If I click this, I'll find \_\_\_?"

If users can't complete that sentence confidently, the label needs work. Test labels out of context
— show them without parent branches and ask what users expect to find.

---

## Structure

### Depth and Breadth

**Maximum depth:** 3-4 levels. Beyond this, users lose orientation and patience.

**Children per branch:** 3-7 options. Fewer than 3 suggests unnecessary nesting; more than 7
overwhelms scanning.

**Three mindless clicks beat one thoughtful click.** Prefer more shallow decisions over fewer
complex ones. Each click should be effortless.

### Organisation Schemes

**Task-based (recommended):** Organised around what users need to do.

- "Apply for...", "Check if...", "Report..."

**Topic-based:** Organised around subjects.

- "Payments", "Accounts", "Security"

**Chronological:** Organised by sequence.

- "Before you start", "During the process", "After completion"

**Avoid audience-based** primary organisation ("For students | For staff | For parents"). Users
often don't self-identify correctly, and it forces them to think about what they are rather than
what they need.

### Mutual Exclusivity

Each branch should represent a clearly distinct path. Users shouldn't wonder "it could be either."

**Test:** Can users confidently choose one option? If overlap exists, either:

- Merge the branches
- Add differentiating criteria to labels
- Restructure

### Consistency

If branches at one level are questions, all should be questions. If they're topics, all should be
topics. Mixing schemes breaks the mental model users build as they navigate.

---

## Navigation & Wayfinding

### Always Answer Three Questions

At any point in the tree, users should immediately know:

1. **Where am I?** (Current position, breadcrumbs)
2. **Where can I go?** (Available options)
3. **How do I get back?** (Back button, restart option)

### Required Elements

**Breadcrumbs:** Show the path from root to current position. Essential beyond 2 levels deep.

**Back option:** Easy return to previous branch. Never trap users.

**Start over:** Quick reset to beginning. Users shouldn't have to click back through every level.

**Progress indication:** Show depth or remaining steps for multi-stage flows.

### Recovery

Users will make wrong turns. Design for recovery:

- Make backtracking effortless
- Don't lose context when users navigate
- Consider "none of these fit" escape hatches
- Acknowledge dead ends gracefully

Loss aversion: One frustrating experience undoes multiple positive ones. Every dead end or confusing
branch drains trust disproportionately.

---

## Leaf Content

### Structure

**Inverted pyramid:** Most important information first, tapering to detail.

**Front-load answers:** Don't make users scroll to find what they came for.

**Short sentences:** Aim for 25 words maximum. Reading age 9 for fastest comprehension.

**Scannable:** Use headings, bullets, and whitespace. Users won't read paragraphs.

### Content Principles

**Task completion:** Leaf content should enable action, not just inform. Answer "What do I do?" not
"What should I know?"

**Plain English:** Use "buy" not "purchase", "help" not "assist", "about" not "approximately". 80%
of users prefer plain English; 97% prefer it for complex topics.

**No duplication:** Each leaf should cover one topic once. Link to related content rather than
repeating.

**Deliver on the promise:** The leaf must match what the branch label promised. Broken promises
destroy trust.

### What to Exclude

**Happy talk:** Introductory text that sounds welcoming but says nothing useful.

**Instructions users won't read:** "Please read carefully before continuing..."

**FAQs:** They duplicate content, can't be front-loaded, and dump information. Answer questions in
context instead.

---

## Cognitive Load

### Reduce Choices

Present only options relevant to the current decision. Every additional option competes for
attention.

**Hick's Law:** Decision time increases with the number of choices. 5 options are processed faster
than 10.

### Create Cognitive Ease

**Familiar patterns:** Use conventions users know from other systems.

**Clean visual design:** High contrast, readable fonts, minimal clutter.

**Consistent terminology:** Use controlled vocabulary throughout.

**Priming:** Provide context before presenting choices.

### Order Matters

**First option bias:** The first option has disproportionate influence (anchoring effect). Users
satisfice — they click the first "good enough" option.

**Order by likelihood:** Put the most common need first.

**Or alphabetically:** When no clear priority exists, alphabetical order is neutral.

---

## Testing & Validation

### Tree Testing

Test your structure before building. Show users the hierarchy (labels only, no design) and ask them
to find specific answers.

**Measure:**

- Success rate (did they find it?)
- Directness (did they go straight there?)
- Time (how long did it take?)

### Card Sorting

Understand how users group information:

- **Open sort:** Users create and name categories
- **Closed sort:** Users sort into your proposed categories

### Usability Testing

Test with 3-5 users. Watch for:

- **Hesitation:** Thinking = friction
- **Wrong clicks:** Expectation mismatch
- **Backtracking:** Wrong turn recovery
- **Abandonment:** Where users give up

**Test early, test often.** One user early beats 50 users late.

### Analytics

Track:

- Where users go back (confusion points)
- Where users restart (failure points)
- Where users abandon (frustration points)
- Path to successful completion (happy path)

**Combine with qualitative.** Numbers show where problems are; user observation shows why.

---

## Common Mistakes

### Structure Anti-Patterns

| Anti-Pattern                   | Problem                                    | Solution                      |
| ------------------------------ | ------------------------------------------ | ----------------------------- |
| Organisation-centred structure | Built around how you think, not user needs | Start with user tasks         |
| Too deep                       | Users lose orientation                     | Maximum 4 levels              |
| Too broad                      | Overwhelming choices                       | Maximum 7 children per branch |
| Inconsistent organisation      | Mixed schemes confuse                      | One scheme per level          |
| Ambiguous categories           | Users can't choose confidently             | Mutually exclusive options    |

### Label Anti-Patterns

| Anti-Pattern              | Problem                     | Solution                    |
| ------------------------- | --------------------------- | --------------------------- |
| Jargon                    | Users don't know your terms | Plain language              |
| Vague labels              | No information scent        | Specific, predictive labels |
| Clever over clear         | Requires interpretation     | Descriptive labels          |
| Buried keywords           | Users miss while scanning   | Front-load key words        |
| Title Case for Every Word | Harder to read              | Sentence case               |

### Content Anti-Patterns

| Anti-Pattern               | Problem                      | Solution                  |
| -------------------------- | ---------------------------- | ------------------------- |
| Happy talk                 | Wastes user time             | Get to the point          |
| Wall of text               | Users won't read             | Scannable structure       |
| Information without action | Doesn't help task completion | Enable action             |
| Duplicate content          | Confuses and fragments       | Single source, link to it |

### Navigation Anti-Patterns

| Anti-Pattern   | Problem                           | Solution                          |
| -------------- | --------------------------------- | --------------------------------- |
| No breadcrumbs | Users lose orientation            | Always show position              |
| No back option | Users feel trapped                | Easy return path                  |
| Hidden options | Users don't know what's available | Visible navigation                |
| Dead ends      | Users hit walls                   | Every path leads somewhere useful |

---

## Checklists

### Before Writing

- [ ] List all user tasks/questions this wiki answers
- [ ] Identify gaps: what can't be answered?
- [ ] Define organising principle (task, topic, chronological)
- [ ] State intent: "Users should describe this wiki as \_\_\_"
- [ ] Create controlled vocabulary (preferred terms, terms to avoid)

### Branch Review

- [ ] Label makes sense without parent context
- [ ] Label uses user language, not jargon
- [ ] Key words front-loaded
- [ ] 3-7 children per branch
- [ ] Parallel grammatical structure with siblings
- [ ] Clearly differentiated from siblings
- [ ] Users can confidently choose one option

### Leaf Review

- [ ] Content delivers on label's promise
- [ ] Most important information first
- [ ] Enables action, not just information
- [ ] Plain English throughout
- [ ] Scannable (headings, bullets, whitespace)
- [ ] No duplicate content (link instead)

### Navigation Review

- [ ] Current position always visible
- [ ] Back option at every level
- [ ] Start over option accessible
- [ ] Maximum 4 levels deep
- [ ] No dead ends

### Pre-Publication

- [ ] Tree tested with users
- [ ] Labels tested out of context
- [ ] All paths lead to useful content
- [ ] Analytics instrumented
- [ ] Plan for iteration based on feedback

---

## Quick Reference

### The Golden Rules

1. **Users scan, don't read.** Front-load everything.
2. **Users satisfice.** Put the most likely answer first.
3. **Labels are promises.** Deliver on them.
4. **Structure is the experience.** Get it right.
5. **Recovery matters more than prevention.** Make backtracking effortless.
6. **Test with users.** Your intuition is wrong.

### The Numbers

| Metric              | Target       |
| ------------------- | ------------ |
| Maximum depth       | 3-4 levels   |
| Children per branch | 3-7          |
| Label length        | 3-6 words    |
| Sentence length     | 25 words max |
| Reading age         | 9 years      |
| Test users          | 3-5 minimum  |

### The Questions

Before each branch: "Can users select in 2-3 seconds?"

Before each label: "If I click this, I'll find \_\_\_?"

Before each leaf: "What can users DO with this?"

At every point: "Where am I? Where can I go? How do I get back?"

---

## Sources

These guidelines synthesise research from:

- **Content Design** — Sarah Winters (GOV.UK)
- **How to Make Sense of Any Mess** — Abby Covert
- **Conversational Design** — Erika Hall
- **Forms that Work** — Caroline Jarrett & Gerry Gaffney
- **Don't Make Me Think** — Steve Krug
- **The Design of Everyday Things** — Don Norman
- **Information Architecture** — Rosenfeld, Morville & Arango
- **Everyday Information Architecture** — Lisa Maria Marquis
- **Thinking, Fast and Slow** — Daniel Kahneman

Full research notes: `.plans/research/*.md`
