# The Design of Everyday Things — Key Learnings

Source: The Design of Everyday Things, Revised Edition (2013) by Don Norman Additional sources:
jnd.org, Nielsen Norman Group articles on mental models, affordances, usability

## Summary

The Design of Everyday Things argues that good design makes products understandable and usable
through proper application of psychology. Norman introduces key concepts — affordances, signifiers,
mapping, feedback, and conceptual models — that explain why some designs are intuitive and others
frustrating. The core insight: when people have trouble using something, the fault lies with the
design, not the user. Designers must bridge the "gulf of execution" (how do I work this?) and the
"gulf of evaluation" (what happened?).

---

## Principles for Self-Help

### 1. Affordances and Signifiers

**Affordances** are the possible actions between an object and a person. A chair affords sitting.
**Signifiers** are the perceivable cues that indicate where actions should happen. A door handle
signals where to push or pull.

**Application to decision trees:**

- Each branch option should clearly signal it can be selected
- The signifier (visual treatment of options) should match the affordance (clickability)
- Don't make users guess what's interactive vs decorative
- Labels are signifiers — they must indicate what selecting that option will do

**Key distinction:** An affordance exists whether or not it's visible. A signifier must be
perceivable. Good design makes affordances visible through signifiers.

### 2. Conceptual Models

A conceptual model is an explanation (usually highly simplified) of how something works. Users form
mental models based on what they perceive. Designers have their own model. Problems occur when these
don't match.

**Application to decision trees:**

- The tree structure should match users' mental model of the domain
- Users expect hierarchical narrowing: each level gets more specific
- Reveal the model: show depth, show progress, show where options lead
- If users consistently pick wrong branches, their mental model differs from yours

**The three models:**

1. Designer's model (how the system actually works)
2. User's model (how the user thinks it works)
3. System image (what the design communicates)

The designer can only affect the system image. The system image must communicate the designer's
model clearly enough for users to form accurate mental models.

### 3. The Gulfs of Execution and Evaluation

**Gulf of execution:** The gap between what users want to do and what actions are available. **Gulf
of evaluation:** The gap between system state and user's perception of it.

**Application to decision trees:**

- **Execution:** Make it obvious how to select an option and proceed
- **Execution:** Make it clear what actions are available at each point
- **Evaluation:** Show current position in the tree clearly
- **Evaluation:** Confirm when an action has been taken
- **Evaluation:** Make it clear when the user has reached an answer

### 4. Mapping

Mapping refers to the relationship between controls and their effects. Natural mapping takes
advantage of physical analogies and cultural standards.

**Application to decision trees:**

- Navigation controls should map naturally (back goes back, forward goes forward)
- Visual position should map to logical position in hierarchy
- Breadcrumbs create a natural map of the journey
- Options arranged spatially should have meaningful arrangement (e.g., chronological, alphabetical)

**Good mapping:** A stove where burner controls are arranged like the burners themselves. **Bad
mapping:** Four controls in a row for burners arranged in a square.

### 5. Feedback

Feedback is communicating the results of an action. Without feedback, users wonder: did it work?

**Application to decision trees:**

- Provide immediate visual response to selection
- Show progress when loading async content
- Confirm navigation has occurred (highlight current, show breadcrumb update)
- At leaf nodes, make it clear "this is the answer"
- If a path leads nowhere useful, acknowledge it explicitly

**Feedback must be:**

- Immediate (or show progress for delays)
- Informative (what happened?)
- Non-intrusive (don't demand attention for routine actions)

### 6. Constraints

Constraints limit possible actions, making incorrect actions harder or impossible.

**Types of constraints:**

- **Physical:** Shapes that only fit one way
- **Semantic:** Meaning-based (a rider faces forward)
- **Cultural:** Conventions (red means stop)
- **Logical:** If X, then must be Y

**Application to decision trees:**

- Only show options that make sense given previous choices
- If a path is impossible, don't show it
- Use semantic constraints: label language should constrain interpretation
- Logical constraints: previous selections naturally narrow remaining options

### 7. Discoverability

Users must be able to discover what actions are possible and how to perform them.

**Application to decision trees:**

- All available options should be visible (don't hide behind interactions)
- The path forward should be obvious
- The way back should be obvious
- Don't require users to remember hidden commands

**The fundamental principles of interaction:**

1. Affordances
2. Signifiers
3. Constraints
4. Mappings
5. Feedback
6. Conceptual model

All six contribute to discoverability.

---

## Patterns to Adopt

### Knowledge in the World vs Knowledge in the Head

Put information users need in the interface, not in their memory.

- Show the current path, don't expect users to remember it
- Label options clearly, don't expect users to know what cryptic terms mean
- Display relevant context at each decision point

### Natural Mappings

Arrange controls and displays to mirror real-world relationships:

- Higher options for "up/more/bigger"
- Progress indicators that fill left to right (in LTR cultures)
- Back buttons on the left, forward on the right

### Forcing Functions

Design elements that prevent errors:

- **Interlocks:** Require completion of step A before step B
- **Lock-ins:** Keep operation going until completed
- **Lock-outs:** Prevent premature action

**Application:** Don't allow selection of an option that leads nowhere. If a leaf has no content,
either don't show that path or show a clear "content coming" state.

### Seven Stages of Action

1. Goal (form the goal)
2. Plan (the action)
3. Specify (the action sequence)
4. Perform (the action sequence)
5. Perceive (the state of the world)
6. Interpret (the perception)
7. Compare (the outcome with the goal)

**Design for each stage:**

- Help users form clear goals (what can I find here?)
- Make planning obvious (what are my options?)
- Make specification simple (how do I select?)
- Make performance easy (click, tap, etc.)
- Make perception clear (what happened?)
- Make interpretation obvious (what does this mean?)
- Make comparison possible (did I get what I wanted?)

---

## Anti-Patterns to Avoid

### The Design of Everyday Things' "Bad Design" Indicators

❌ **Lack of visibility:** User can't tell what actions are possible ✅ Show all options clearly

❌ **False causality:** User thinks action A caused result B (when it didn't) ✅ Provide clear,
accurate feedback

❌ **Poor mapping:** Controls don't relate logically to effects ✅ Use natural mappings

❌ **No feedback:** User doesn't know if action worked ✅ Always confirm state changes

❌ **Incorrect conceptual model:** User thinks system works differently than it does ✅ Design
system image to communicate correct model

### Blaming the User

❌ "The user should have read the instructions" ✅ Design so instructions aren't needed

❌ "Users are using it wrong" ✅ If many users err the same way, it's the design

### Mode Errors

❌ Same action produces different results depending on invisible state ✅ Make system state visible,
or avoid modes entirely

### Feature Creep

❌ Adding features until complexity overwhelms usability ✅ Add features only when they serve
demonstrated user needs

---

## Human Error and Design

Norman distinguishes two types of error:

### Slips

Automatic behaviour gone wrong — intending to do X but doing Y. Usually happens when attention
lapses during routine tasks.

**Design response:**

- Make actions distinct (don't put "delete all" next to "save")
- Add friction to dangerous actions
- Allow easy recovery

### Mistakes

Wrong goal or plan — consciously doing X when Y was needed. Usually happens due to incorrect mental
model.

**Design response:**

- Improve system image so users form correct models
- Provide feedback that reveals actual system state
- Make the current state visible

**Application to decision trees:**

- If users slip (click wrong option): make options visually distinct, provide undo
- If users mistake (follow wrong path): improve branch labels, clarify what each path is for

---

## Root Cause Analysis

When something goes wrong, ask "why" five times to find the root cause:

1. Why did the user click the wrong option?
2. Why did they think that was right?
3. Why was the label ambiguous?
4. Why wasn't the label tested?
5. Why don't we have a label review process?

**Application:** When users go down wrong paths, trace back to the design decision that led them
astray. Fix the system, not the user.

---

## Key Quotes

> "Design is really an act of communication, which means having a deep understanding of the person
> with whom the designer is communicating."

> "Two of the most important characteristics of good design are discoverability and understanding."

> "When people fail to follow the rules, designers should determine why the rules were broken and
> modify the design to make compliance easier."

> "Good design requires good communication, especially from machine to person, indicating what
> actions are possible, what is happening, and what is about to happen."

> "Simplified models are the key to useful mental models."

> "Make it easy to determine what actions are possible at any moment."

> "Make things visible, including the conceptual model of the system, the alternative actions, and
> the results of actions."

> "When things go wrong, as they often do, thoughtful designers will try to determine why, then
> modify their design. When people err, change the system so that type of error will be reduced or
> eliminated."

> "It is the duty of machines and those who design them to understand people."

---

## Action Items

- [ ] Audit signifiers: is every interactive element visibly interactive?
- [ ] Review conceptual model: does the tree structure match user mental models?
- [ ] Check for gulfs: execution (how do I use this?) and evaluation (what happened?)
- [ ] Verify mapping: do navigation controls feel natural?
- [ ] Ensure feedback at every interaction point
- [ ] Apply constraints: hide impossible paths, don't show dead ends
- [ ] Test discoverability: can users see all their options?
- [ ] Analyse errors: are they slips (need distinction) or mistakes (need clarity)?
- [ ] For each error pattern, trace root cause back to design
- [ ] Verify "knowledge in the world" — don't require users to remember state
