# Don't Make Me Think — Key Learnings

Source: Don't Make Me Think, Revisited (3rd edition, 2014) by Steve Krug Additional sources:
sensible.com, Nielsen Norman Group articles on usability

## Summary

The central thesis is that web pages should be self-evident — users should be able to "get it"
without having to think about it. Every question mark that appears over a user's head adds to their
cognitive workload and distracts from their task. Good design eliminates unnecessary questions by
making choices obvious, reducing noise, and matching user expectations. The book emphasises testing
with real users early and often, even with just a few participants.

---

## Principles for Self-Help

### 1. Don't Make Me Think

The title is the core principle: a page should be self-evident. Users should never have to pause and
wonder "Where am I?", "Where do I start?", "Where did they put X?", "What are the most important
things on this page?", or "Why did they call it that?"

**Application to decision trees:**

- Branch labels must be instantly clear — no clever names, no jargon
- The current position in the tree should always be visible
- Each screen should have an obvious "next step"
- If users have to think about what an option means, rewrite it

**Test:** Show a branch to someone unfamiliar with the topic. Can they explain what each option
leads to without hesitation?

### 2. Users Don't Read — They Scan

Users glance at each page, scan some text, and click on the first link that catches their interest
or vaguely resembles what they're looking for. They're usually in a hurry and know they don't need
to read everything.

**Application to decision trees:**

- Front-load branch labels with distinguishing keywords
- Keep labels short enough to scan in a single fixation
- Make the differences between options visually obvious
- Don't bury the key differentiator in the middle of a label

**Good:** "Business account" vs "Personal account" **Bad:** "Account for business customers and
organisations" vs "Account for individual personal use"

### 3. Users Don't Make Optimal Choices — They Satisfice

Users don't scan the page and carefully weigh all options. They scan until they find a link that
seems like it might lead somewhere useful, and they click it. This is called "satisficing" — a blend
of satisfying and sufficing. Users choose the first reasonable option, not the best one.

**Application to decision trees:**

- Make the correct choice the most obvious one
- Order options by likelihood of being the user's need
- Avoid having two options that both seem "reasonable" for the same need
- If users commonly pick the wrong branch, it's a design problem, not a user problem

### 4. Users Muddle Through

Users don't figure out how things work — they muddle through. They'll use something in completely
wrong ways if it sort of works. They rarely read instructions, preferring to forge ahead and make it
work.

**Application to decision trees:**

- Don't rely on users reading introductory text
- Make the interaction pattern self-evident
- Provide clear feedback on current state and available actions
- If guidance is essential, make it impossible to miss

### 5. Eliminate Visual Noise

There are three kinds of noise: shouting (everything demanding attention), disorganisation, and
clutter. Noise makes it harder for users to find what they're looking for and understand what
they're looking at.

**Application to decision trees:**

- Present only the options relevant to the current decision
- Remove decorative elements that don't aid comprehension
- Use visual hierarchy to show what's important
- Group related options visually

### 6. Make Clicks Mindless

Users don't mind clicking if each click is effortless and brings them closer to their goal. The
quality of the click matters more than the number of clicks. Three mindless clicks beat one click
that requires thought.

**Application to decision trees:**

- Each branch should present a simple, clear choice
- Prefer more shallow decisions over fewer complex ones
- Never make users choose between options they can't distinguish
- Provide enough context at each step to make the choice obvious

### 7. Omit Needless Words

Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no
unnecessary sentences. Every word on a page competes for attention with every other word.

**Application to decision trees:**

- Cut branch labels to the minimum needed for clarity
- Remove introductory text that users will skip
- In leaf content, get to the point immediately
- Use half the words you think you need, then cut again

### 8. Conventions Are Your Friends

Web conventions exist because they work. Users have expectations from millions of hours spent on
other sites. Innovating on conventions requires clear improvement to justify the learning cost.

**Application to decision trees:**

- Follow standard interaction patterns for selection and navigation
- Use familiar terminology (not invented jargon)
- Place navigation elements where users expect them
- Indicate the current location clearly

---

## Patterns to Adopt

### The "Trunk Test"

On any page, users should be able to answer:

1. What site is this? (Site ID)
2. What page am I on? (Page name)
3. What are the major sections? (Sections)
4. What are my options at this level? (Local navigation)
5. Where am I in the scheme of things? ("You are here" indicators)
6. How can I search? (if applicable)

**Application:** At any point in the tree, users should know: what help system they're in, which
branch they're on, what level they're at, and how to go back.

### Breadcrumbs

Show the path from root to current location. Don't use breadcrumbs as the only navigation — they're
a secondary aid.

### Progressive Disclosure

Show only the information needed for the current decision. Reveal complexity gradually as users
drill down.

### "Don't Punish Me" Principle

If users make a wrong choice, make it easy to recover:

- Always provide a way back
- Don't lose user context when they navigate
- Consider confirming destructive actions

---

## Anti-Patterns to Avoid

### Happy Talk

❌ Introductory text that sounds welcoming but says nothing useful ✅ Get straight to the content
users came for

### Instructions That No One Reads

❌ "Please read carefully before continuing..." ✅ Design the interface so instructions aren't
needed

### Clever Over Clear

❌ Creative labels that require interpretation ("Explore the Possibilities") ✅ Clear, descriptive
labels ("Browse Products")

### Too Many Options

❌ Presenting 15 branches at once ✅ Chunking options into digestible groups or levels

### Assumed Knowledge

❌ Using internal terminology or acronyms without explanation ✅ Using language your users actually
use

### Hidden Navigation

❌ Making users guess where they are or how to proceed ✅ Always showing location and available
paths

---

## The "Reservoir of Goodwill"

Every user starts with a reservoir of goodwill toward your product. Every difficulty they encounter
drains it:

**Drains goodwill:**

- Hiding information users want (like contact details)
- Punishing users for not doing things your way
- Asking for unnecessary information
- Making users feel stupid
- Not telling users what they need to know

**Builds goodwill:**

- Making the main things users want obvious
- Saving users steps where possible
- Knowing what questions they'll have and answering them
- Providing recovery from errors
- Apologising for things that aren't your fault

**Application to decision trees:**

- Don't make users repeat information they've already provided
- Acknowledge when a path led to an unhelpful result
- Make it easy to start over or go back
- Provide contact information for edge cases

---

## Usability Testing Principles

### Test Early, Test Often

"Testing one user early in the project is better than testing 50 near the end."

Testing with 3-4 users catches most serious problems. Run multiple small tests, fix issues between
tests.

### Testing Is Iteration, Not Validation

Testing isn't about proving the design works — it's about finding what doesn't work and fixing it.
The goal is learning, not approval.

### What to Watch For

- Where users hesitate (thinking = friction)
- What users click when it's wrong (expectation mismatch)
- What users say they expect vs what they find
- Recovery attempts after wrong turns

---

## Key Quotes

> "Don't make me think!"

> "If something requires a large investment of time — or looks like it will — it's less likely to be
> used."

> "People don't figure out how things work. They muddle through."

> "Get rid of half the words on each page, then get rid of half of what's left."

> "Three mindless, unambiguous clicks equal one click that requires thought."

> "Your job is to make the important things obvious."

> "Users don't read, they scan. Users don't make optimal choices, they satisfice. Users don't figure
> out how things work, they muddle through."

> "The main thing to keep in mind is that testing one user is 100 percent better than testing none."

---

## Action Items

- [ ] Review all branch labels: can users understand them without thinking?
- [ ] Test tree navigation with a "trunk test" — can users identify location at any point?
- [ ] Audit for "happy talk" or unnecessary instructions
- [ ] Check option ordering — is the most likely choice first/most obvious?
- [ ] Verify recovery paths exist at every decision point
- [ ] Cut label and content word counts in half
- [ ] Run a quick usability test with 3-5 users to find friction points
- [ ] Check breadcrumb/location indicators are always visible
