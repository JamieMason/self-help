# Forms that Work — Key Learnings

Source: Caroline Jarrett's articles and workshops (https://www.effortmark.co.uk/forms/) Author:
Caroline Jarrett & Gerry Gaffney

## Summary

Forms are the point where users interact with systems to accomplish tasks. Jarrett's "three-layer
model" identifies that forms must work on three levels: easy to interact with
(appearance/interaction design), easy to understand (conversation/content design), and easy to
complete the task (relationship/service design). Bad forms aren't just frustrating—they directly
cause errors, abandoned tasks, and poor data quality.

---

## Principles for Self-Help

### 1. The Three-Layer Model of Forms

Forms must work at three levels simultaneously:

**Appearance (Interaction Design):**

- Boxes to type into, buttons, visual layout
- How the form looks and how users physically interact

**Conversation (Content Design):**

- Questions, instructions, error messages
- The words that guide users through the form

**Relationship (Service Design):**

- The purpose of the form for both issuer and user
- Whether the form achieves its goal within the broader service

**Application to decision trees:**

- Branch labels = Conversation layer (the question being asked)
- Visual layout = Appearance layer (how options are presented)
- Task completion = Relationship layer (does the tree solve the user's problem?)
- All three must work together; fixing one doesn't fix the others

### 2. Forms Are Conversations

A form is a structured conversation between the organisation and the user. Each question is a turn
in that conversation.

**Application to decision trees:**

- Each branch point is a "question" in the conversation
- The tree structure IS the conversation flow
- Branch labels should feel like natural questions a helper would ask
- The sequence should follow a logical conversational order

### 3. Don't Put Labels Inside Input Fields

Labels inside text boxes (placeholder text) disappear when users start typing, causing:

- Users to forget what they're answering
- Accessibility issues for screen readers
- Confusion when reviewing answers

**Application to decision trees:**

- Branch labels must be visible and persistent
- Don't hide context as users navigate
- Keep parent context visible when showing child options

### 4. Use Large Click Targets

Jarrett observed users struggling with small radio buttons and checkboxes, even when the text was
clickable. This led to GOV.UK's extra-large clickable targets.

**Application to decision trees:**

- Make entire option rows clickable, not just the text
- Ensure touch targets are large enough for mobile
- Don't make users aim precisely

### 5. Sentence Case Over Title Case

Sentence case is more familiar and slightly more legible than Title Case For Every Word.

**Application to decision trees:**

- Use sentence case for branch labels: "Check your eligibility" not "Check Your Eligibility"
- Consistent casing builds familiarity and trust

### 6. Don't Fear Long Pages

"No more accordions and don't be afraid of the big long page." Hidden content creates cognitive
load—users don't know what they haven't seen.

**Application to decision trees:**

- Consider showing more context rather than hiding it
- Accordions/collapsed sections can hide important information
- Progressive disclosure should be deliberate, not default

### 7. Error Rates and Data Quality

Bad forms produce bad data. Errors compound through systems.

**Types of errors:**

- Input errors (user enters wrong data)
- Abandonment (user gives up)
- Misunderstanding (user provides wrong answer to right question)
- System errors (form doesn't accept valid input)

**Application to decision trees:**

- Track where users go back, restart, or abandon
- Monitor which branches cause confusion
- Test that users arrive at the _correct_ leaf, not just _a_ leaf

### 8. Content Design for Forms

Key elements of form content:

- Clear, simple questions
- Helpful hints (but not inside input fields)
- Actionable error messages
- Logical question order

**Application to decision trees:**

- Branch labels are questions—make them clear
- Provide context where needed (hints)
- If users make wrong choices, make recovery easy

---

## Patterns to Adopt

### Three-Layer Checklist

For each branch/leaf, verify:

- [ ] **Appearance:** Is it visually clear what to do?
- [ ] **Conversation:** Are the words clear and helpful?
- [ ] **Relationship:** Does this serve the user's actual task?

### Question Protocol

Before adding a question (branch), ask:

1. Why do we need this information?
2. What will we do with the answer?
3. Is this the right point in the journey to ask?
4. Could we get this information another way?

### Error Prevention Hierarchy

1. Prevent the error (better design)
2. Make the error obvious immediately
3. Make recovery easy
4. Provide clear guidance

### Progressive Disclosure Done Right

- Show essential information first
- Reveal additional detail on demand
- Never hide critical decision-making information
- Test that users find what they need

---

## Anti-Patterns to Avoid

### Placeholder Text as Labels

❌ Labels that disappear when users interact ✅ Persistent, visible labels

### Tiny Click Targets

❌ Small radio buttons users must aim for ✅ Large clickable areas including the label text

### Hiding Everything

❌ Accordions that hide information users need to see ✅ Visible content with optional expansion for
details

### Question Overload

❌ Asking everything you might need ✅ Asking only what's necessary for this specific task

### Ignoring the Conversation

❌ Designing the visual form first, adding words later ✅ Writing the conversation first, then
designing the interface

### One-Way Forms

❌ No way to go back or change answers ✅ Easy navigation, ability to review and revise

---

## Key Quotes

> "A tax form is frightening before we even get it out of its envelope."

> "Successful forms work because they are designed to meet the needs of users, and are part of a
> complete ecosystem."

> "Good forms need interaction design, good content design, and to fit within the service."

---

## The Form Conversation Applied to Decision Trees

A decision tree IS a form—a structured conversation where:

- Each branch = a question
- Each option = a possible answer
- Each leaf = the form's "submission" (the answer/outcome)
- Navigation = the form's flow

The same principles apply:

1. Ask clear questions (branch labels)
2. Provide clear options (children)
3. Give helpful feedback (progress indication)
4. Deliver a useful result (leaf content)
5. Allow review and correction (navigation back)

---

## Action Items

- [ ] Audit branch labels as "questions"—are they clear?
- [ ] Check click/touch targets are large enough
- [ ] Review for hidden content that should be visible
- [ ] Add ability to go back and change choices
- [ ] Track error rates: wrong paths, abandonments
- [ ] Test with users: do they arrive at correct outcomes?
- [ ] Apply three-layer model to wiki review process
