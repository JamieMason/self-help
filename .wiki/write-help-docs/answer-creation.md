# Create an answer

## Read First

- [Create a wiki](./wiki-creation.md)

**Create a `.md` file and add a link to its parent `README.md`.**

## Steps

1. Create the markdown file in the appropriate folder
2. Write the content (entire file becomes the answer)
3. Add a link in the parent `README.md`
4. Validate with lint

## Example

Create `docs/topic/my-answer.md`:

```markdown
# My answer

The content here is what the user sees when they reach this answer.

Use markdown formatting:

- Bullet points
- Code blocks
- Links

Include actionable guidance.
```

Add link in `docs/topic/README.md`:

```markdown
# Topic

- [Existing answer](./existing.md)
- [My answer](./my-answer.md)
```

## Content guidelines

### Structure

- **H1 heading** — Becomes the label when rendered
- **First sentence** — Answer the question immediately
- **Body** — Supporting details, steps, examples
- **Read First/Next** — Related content links (optional)

### What to include

- Immediate answer in first sentence
- File paths for relevant source files
- Copy-pasteable commands or code
- Minimal examples (just enough to illustrate)

### What to exclude

- "Welcome to..." or "In this section..."
- Complete API references (use code comments)
- Long code dumps (gets stale)
- Generic advice (be specific)

## Read First / Read Next sections

Link related content at the bottom:

```markdown
## Read First

- [Prerequisite topic](../path/to/prereq.md)

## Read Next

- [Follow-up topic](../path/to/next.md)
```

## Validation

```bash
node dist/bin.js lint --source ./docs
```

Check for:

- H1 heading present
- Parent `README.md` has link to new file
- File path in link is correct

## File naming

- Use kebab-case: `my-answer.md`
- Be descriptive: `state-machine-stuck.md` not `issue-1.md`
- Match the label: "State machine stuck" → `state-machine-stuck.md`

## Source files

- Lint command: `src/lint.ts`
- Parser: `src/build/parser.ts`

## Read Next

- [Create a branch](./branch-creation.md)
- [Validate structure](./structure-validation.md)
