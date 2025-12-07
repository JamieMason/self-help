# Conversational Design — Key Learnings

Source: Erika Hall, Mule Design Book: https://abookapart.com/products/conversational-design Blog:
https://www.muledesign.com/blog

## Summary

Conversational design uses conversation—the fundamental human interface—as a model for creating
systems that work on human terms. It's not about chatbots or voice interfaces specifically; it's
about applying the deeper principles of human interaction to any design. A good conversation is
cooperative, goal-oriented, context-aware, error-tolerant, turn-based, and polite.

---

## Principles for Self-Help

### 1. Conversation Is the Model, Not the Medium

**What it means:** Being conversational doesn't necessarily mean talking to a computer. It means
applying conversational principles to create human-centred systems.

**How it applies:**

- Decision trees ARE conversations—turn-based exchanges toward a shared goal
- Each branch selection is a "turn" in the dialogue
- The tree structure is the script; user choices are responses

**Specific changes:**

- Frame branch labels as natural responses to implicit questions
- Ensure each step feels like a logical continuation of dialogue
- Design for the back-and-forth rhythm of conversation

### 2. Six Principles of Conversational Interaction

Erika Hall identifies what makes conversation work:

1. **Cooperative:** Both parties work toward shared understanding
2. **Goal-oriented:** Moving toward a purpose, not just exchanging words
3. **Context-aware:** Adapting to the situation ("reading the room")
4. **Error-tolerant:** Helping each other through rough patches
5. **Turn-based:** Taking turns, not interrupting
6. **Polite:** Following social conventions that build trust

**How it applies:**

| Principle      | Application to Decision Trees                          |
| -------------- | ------------------------------------------------------ |
| Cooperative    | Tree helps user reach their goal, not organisation's   |
| Goal-oriented  | Every branch moves toward resolution                   |
| Context-aware  | Consider user's emotional state, device, time pressure |
| Error-tolerant | Allow backtracking, explain when paths don't match     |
| Turn-based     | One question per screen, clear progression             |
| Polite         | Respectful tone, no jargon, acknowledge effort         |

### 3. Technology Problem vs People Problem

**What it means:** "If the telephone isn't working—that's a technology problem. If someone is
hitting you over the head with a telephone, that's a people problem."

**How it applies:**

- A broken link is a technology problem
- Confusing branch labels are a people problem
- Scaling a confusing tree to more users magnifies the people problem

**Specific changes:**

- Before adding features, fix the underlying content/structure issues
- Don't automate confusion—automation magnifies inefficiency
- Solve the right problem before picking the solution

### 4. Explicit Exchange of Value

**What it means:** Ask "What's in it for them?" about every individual whose participation you need.
"No relationship, no value."

**How it applies:**

- Users invest attention; what do they get back?
- Each step should feel worth the effort
- Dead ends and circular paths destroy trust

**Specific changes:**

- Audit every path: does it lead to valuable resolution?
- Ensure leaf content delivers on the promise of the journey
- Balance user effort against information value

### 5. Narrative Before Form

**What it means:** "No story, no relationship. Narrative is how we make sense of our experiences."
Story precedes logic—we organise information by mapping it onto a path through time.

**How it applies:**

- Users experience the tree as a journey, not a database query
- Each path through the tree IS a narrative
- The sequence of branches shapes understanding

**Specific changes:**

- Design paths as coherent stories with beginning, middle, end
- Use branch labels that continue the narrative thread
- Consider the emotional arc: reassurance → clarity → resolution

### 6. Think Across Channels and Modes

**What it means:** "There is no one best way to communicate." Context determines the best approach.
Starting from the technology is backwards.

**How it applies:**

- Users may arrive from different contexts (search, link, mobile)
- The same tree may need to work across different interfaces
- Sometimes a different format entirely might serve better

**Specific changes:**

- Consider how users arrive at the tree
- Design for the least capable context (mobile, stressed, distracted)
- Question whether a decision tree is the right solution

### 7. Qualitative Understanding Is Critical

**What it means:** Quantitative data alone won't generate meaning. "All the quantitative data in the
world won't suddenly generate meaning. Unexamined, it will just introduce bias at scale."

**How it applies:**

- Drop-off rates tell you WHERE users leave, not WHY
- Completion rates don't reveal confusion or frustration
- User research is essential to understand interpretation

**Specific changes:**

- Combine analytics with user observation
- Talk to users about their experience of the tree
- Don't assume numbers tell the whole story

---

## Patterns to Adopt

### Turn-Based Feedback Loop

Design as a simple, effective exchange:

1. System presents options (turn 1)
2. User selects (turn 2)
3. System responds with next options or resolution (turn 3)
4. Repeat until goal reached

This is the core interaction pattern—keep it clean.

### Cooperative Framing

Frame every interaction as working WITH the user:

- "Help me find..." not "Select category"
- "What are you trying to do?" not "Choose option"
- "Here's what we found" not "Results"

### Error Recovery

Plan for wrong turns:

- Clear "go back" at every step
- "None of these fit" option when appropriate
- Graceful handling when user reaches wrong endpoint

### Context Awareness Checklist

For each tree, consider:

- What device? (mobile, desktop)
- What emotional state? (stressed, curious, urgent)
- What prior knowledge? (expert, novice)
- What time pressure? (immediate need, browsing)

---

## Anti-Patterns to Avoid

### Technology-First Thinking

❌ "Let's add a chatbot!" ✅ "What problem are users having, and what's the simplest solution?"

### Authority-Oriented Design

❌ Someone with power says a thing and everyone acts as though it's true ✅ Design based on evidence
of user needs and behaviour

### Automating Inefficiency

❌ "Automation applied to an inefficient operation will just entrench the inefficiency" — Bill Gates
✅ Fix the process before scaling it

### Ignoring the Why

❌ Measuring what's easy and ascribing meaning after the fact ✅ Understanding the why behind the
numbers through qualitative research

### Solo Design

❌ Making decisions in isolation, validating after the fact ✅ Collaborative design with
cross-functional input and user testing

---

## Key Quotes

> "Using conversation as a model for design is exciting because it gives us more ways to adapt
> technology to a wider range of human needs."

> "If the telephone isn't working—that's a technology problem. If someone is hitting you over the
> head with a telephone, that's a people problem."

> "Scaling and automating systems and processes that make people want to throw their phones at the
> wall doesn't help anyone."

> "The most avoidable reason ambitious initiatives fail inside and products fail outside is the
> failure to ask the question 'What's in it for them?' about every single individual whose
> participation you need."

> "Value can only be exchanged within a relationship — therefore: no relationship, no value." —
> Nathan Shedroff

> "No story, no relationship. Narrative is how we make sense of our experiences at a fundamental
> level."

> "There is no substitute for observing the world around you and talking to people where they are,
> to get a deep holistic understanding."

---

## The Conversational Design Framework Applied

For each decision tree:

1. **What's the shared goal?** User wants X, we help them get X
2. **What's the exchange of value?** User invests attention, gets clear answer
3. **What's the narrative?** How does this journey feel as a story?
4. **What context are users in?** Device, emotion, knowledge, urgency
5. **Where might it go wrong?** What error recovery do we provide?
6. **Is conversation the right model?** Or is there a simpler way?

---

## Action Items

- [ ] Audit existing trees against the six conversational principles
- [ ] Add "none of these fit" escape hatches where appropriate
- [ ] Review error recovery options (back, restart, alternative paths)
- [ ] Create context personas (stressed mobile user, curious browser, etc.)
- [ ] Schedule qualitative research alongside analytics review
- [ ] Document the "narrative arc" for each major tree path
