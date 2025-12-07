# Thinking, Fast and Slow — Key Learnings

Source: Thinking, Fast and Slow (2011) by Daniel Kahneman Additional sources: Nielsen Norman Group
articles on cognitive biases and UX psychology

## Summary

Kahneman's central thesis is that human cognition operates through two distinct systems: System 1
(fast, automatic, intuitive) and System 2 (slow, deliberate, analytical). System 1 handles most
daily decisions effortlessly but is prone to predictable biases. System 2 is capable of careful
reasoning but requires effort and is easily depleted. Understanding these systems explains why users
make irrational choices, satisfice rather than optimise, and rely heavily on defaults and first
impressions. For decision tree design, this means optimising for System 1 processing while providing
System 2 support when stakes are high.

---

## Principles for Self-Help

### 1. System 1 vs System 2 Thinking

**System 1:** Fast, automatic, effortless, emotional, intuitive. Operates constantly in the
background. Recognises patterns, makes snap judgments, jumps to conclusions.

**System 2:** Slow, deliberate, effortful, logical, conscious. Activated for complex tasks. Monitors
System 1 but often accepts its suggestions uncritically.

**Application to decision trees:**

- Design for System 1 by default — most users will scan, not read
- Branch labels should trigger instant recognition, not require analysis
- Visual hierarchy signals importance to System 1 before System 2 engages
- Reserve System 2 engagement for genuinely complex decisions

**Test:** Can users select the correct branch within 2-3 seconds? If they pause to think, the design
is demanding System 2 when System 1 could handle it.

### 2. Cognitive Ease vs Cognitive Strain

System 1 operates optimally in a state of cognitive ease — when information is familiar, clear, and
effortless to process. Cognitive strain (unfamiliar content, poor legibility, complex choices)
forces System 2 engagement, which feels unpleasant and depletes mental resources.

**Factors that create cognitive ease:**

- Repeated exposure (familiar patterns)
- Clear visual presentation (high contrast, readable fonts)
- Priming (relevant context already activated)
- Good mood (positive emotional state)

**Application to decision trees:**

- Use familiar terminology users have encountered before
- Maintain consistent visual design throughout
- Provide context before presenting choices
- Remove friction that creates strain (slow loading, visual clutter)

**The fluency effect:** Information that's easy to process feels more true and trustworthy. A
well-designed branch feels more reliable than a confusing one, regardless of content quality.

### 3. Anchoring

People rely heavily on the first piece of information they encounter (the "anchor") when making
subsequent judgments. Even arbitrary anchors influence estimates and choices. This effect persists
even when people are warned about it.

**Application to decision trees:**

- The first option presented has disproportionate influence
- Initial framing shapes how users interpret all subsequent choices
- Order options strategically — most common/recommended first
- Set accurate expectations early; they're difficult to revise later

**Example:** If the first branch label mentions "complex setup required," users will perceive the
entire process as difficult, even if subsequent steps are simple.

### 4. Loss Aversion and Prospect Theory

Losses loom larger than equivalent gains. People are roughly twice as sensitive to losses as to
gains of the same magnitude. This asymmetry drives risk-averse behaviour when facing potential gains
but risk-seeking behaviour when facing potential losses.

**Application to decision trees:**

- Frame choices in terms of what users keep, not what they lose
- Negative experiences (wrong turns, dead ends) have outsized impact
- Users overweight small risks of bad outcomes
- Recovery from errors matters more than preventing them

**The negativity bias:** One frustrating experience undoes multiple positive ones. Every dead-end
branch, confusing label, or unhelpful answer drains trust disproportionately.

### 5. What You See Is All There Is (WYSIATI)

System 1 constructs the most coherent story possible from available information, without considering
what information might be missing. Users jump to conclusions based on limited data and rarely seek
additional evidence.

**Application to decision trees:**

- Users will choose based on visible labels alone
- Don't assume users will explore to understand options
- Each branch label must be self-sufficient
- Hidden information doesn't exist in users' mental models

**Implication:** A branch labelled "Other" provides no information and forces random guessing. Users
can't consider what they can't see.

### 6. Recognition Over Recall

Recognition is easy (System 1); recall is hard (System 2). People can recognise correct answers from
a list far more easily than they can generate answers from memory. Memory is context-dependent —
cues spread activation to related information.

**Application to decision trees:**

- Present options rather than expecting users to formulate their own path
- Use labels that trigger recognition of the user's situation
- Phrase options in the user's language, not your taxonomy
- Provide enough context for recognition without requiring background knowledge

**Memory chunks:** Information is organised in interconnected units. Relevant context activates the
right chunks, making the correct option "jump out."

### 7. Satisficing, Not Optimising

People don't evaluate all options to find the best one. They scan until they find an option that
seems "good enough" and select it immediately. This is rational given limited time and cognitive
resources.

**Application to decision trees:**

- The first "good enough" option captures most users
- Order matters — most likely matches should appear first
- Don't expect users to read all options before choosing
- Design for satisficers; optimisers will find their way regardless

### 8. The Default Effect

People tend to accept whatever option is presented as the default. Changing from a default requires
effort and implies responsibility for the outcome. Defaults are interpreted as implicit
recommendations.

**Application to decision trees:**

- First/highlighted options are effectively defaults
- Pre-selected paths carry weight of implicit endorsement
- Make the most common/beneficial path the most obvious
- Understand that presentation order influences behaviour

---

## Cognitive Biases Relevant to Decision Trees

### Availability Heuristic

People judge probability based on how easily examples come to mind. Recent, vivid, or emotionally
charged examples are overweighted.

**Implication:** Use concrete, recognisable examples in branch labels. Abstract categories don't
activate relevant memories.

### Substitution

When facing a difficult question, System 1 often substitutes an easier one and answers that instead,
without realising the switch.

**Target question:** "Which of these technical categories describes my problem?" **Substituted
question:** "Which of these words have I seen before?"

**Implication:** Users answer the question they can answer, not necessarily the one you asked. Frame
choices to match how users naturally categorise their situations.

### Framing Effects

The same information presented differently leads to different choices. "90% survival rate" produces
different responses than "10% mortality rate."

**Implication:** Frame options positively where possible. "Find the answer" rather than "Avoid
getting it wrong."

### Confirmation Bias

Once users form an initial impression, they interpret subsequent information to confirm it. Early
mistakes in navigation compound as users reinterpret correct paths as wrong.

**Implication:** Provide clear confirmation when users are on the right path. Don't let early
confusion contaminate the entire experience.

### The Halo Effect

Initial impressions of one attribute influence perception of other attributes. A well-designed
interface feels more trustworthy and accurate.

**Implication:** First impressions of professionalism affect credibility throughout. Visual quality
signals content quality.

---

## Patterns to Adopt

### Design for System 1

- Use visual hierarchy to guide attention
- Make choices scannable in a single glance
- Use familiar patterns and terminology
- Provide just enough information for recognition

### Provide System 2 Support When Needed

- Offer optional detail for users who want it
- Allow comparison of options for high-stakes decisions
- Support deliberate exploration without requiring it
- Make it easy to pause and resume

### Reduce Cognitive Load

- Limit choices to manageable numbers (3-5 per screen)
- Remove irrelevant information
- Group related options visually
- Use progressive disclosure

### Leverage Defaults Ethically

- Make the most helpful path the most obvious
- Order options by likelihood/benefit
- Don't exploit defaults to mislead users
- Ensure defaults serve user interests

### Support Easy Recovery

- Acknowledge that wrong turns happen
- Make backtracking effortless
- Don't punish exploration
- Provide clear "start over" options

---

## Anti-Patterns to Avoid

### Demanding System 2 When System 1 Should Suffice

❌ Options that require careful reading to distinguish ✅ Options that differ visibly at a glance

### Creating Cognitive Strain

❌ Jargon, small text, cluttered layouts, unexpected patterns ✅ Familiar words, readable
presentation, clean design, conventions

### Ignoring Loss Aversion

❌ "You may lose access to..." "Don't miss out on..." ✅ "Keep your..." "Continue with..."

### Assuming Full Option Review

❌ Placing the best option last, expecting users to evaluate all ✅ Placing most relevant options
first; users will satisfice

### Providing Incomplete Information

❌ Generic labels that could match multiple user situations ✅ Specific labels that trigger
immediate recognition

### Hidden Complexity

❌ Simple labels hiding complex processes ✅ Labels that accurately preview what follows

---

## First Impressions and Credibility

Users form judgments about credibility within 50 milliseconds — pure System 1 evaluation. These snap
judgments influence all subsequent interactions:

- Visual design quality signals content quality
- Professional appearance builds trust
- Consistency suggests reliability
- Clutter suggests disorganisation

**Prominence-Interpretation Theory:** The more prominent an element, the greater its impact on
credibility assessment. Whatever stands out most shapes overall impression, positively or
negatively.

**Application:** The first screen of a help tree shapes expectations for the entire experience.
Invest disproportionately in that first impression.

---

## Key Quotes

> "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity
> is not easily distinguished from truth."

> "Nothing in life is as important as you think it is, while you are thinking about it." (Focusing
> illusion)

> "We can be blind to the obvious, and we are also blind to our blindness."

> "The confidence that individuals have in their beliefs depends mostly on the quality of the story
> they can tell about what they see, even if they see little."

> "Laziness is built deep into our nature." (System 2 avoidance)

> "When faced with a difficult question, we often answer an easier one instead, usually without
> noticing the substitution."

> "Losses loom larger than gains."

---

## Action Items

- [ ] Audit branch labels for System 1 processing — can users select in 2-3 seconds?
- [ ] Review option ordering — are most likely/helpful paths first?
- [ ] Check for cognitive strain: jargon, visual clutter, unfamiliar patterns
- [ ] Verify first screen makes strong positive impression
- [ ] Ensure recovery from wrong turns is effortless
- [ ] Test framing of labels — positive vs negative orientation
- [ ] Remove options that require careful comparison to distinguish
- [ ] Add recognition cues (examples, familiar phrasing) to abstract options
- [ ] Confirm "good enough" option leads to helpful outcome (satisficing path)
- [ ] Check for WYSIATI violations — are labels self-sufficient without hidden context?
