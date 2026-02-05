# FAQ — Intent Gate vs Linters, Sonar, and Clean Code

## Isn’t this just another linter / required check?
Not really. Linters enforce rules about the *code itself* (style, static patterns, obvious correctness issues).
This gate enforces rules about the *change as a unit*: it checks whether the PR’s actual diff matches the declared intent (scope, touched areas/layers, required tests). A PR can be perfectly lint-clean and still be “not allowed” because it silently expanded scope—something linters can’t evaluate because they don’t know what the change was supposed to be.

---

## Isn’t this overlapping with Sonar, CodeQL, or Clean Code rules?
There’s some surface overlap (they’re all CI gates), but they operate at different levels. Tools like Sonar analyze *code quality and maintainability* — complexity, duplication, smells, coverage, and long-term risk.
This gate doesn’t evaluate whether code is “good” or “clean.” It evaluates whether the *change itself* stayed within the declared intent and scope. A PR can be Sonar-clean and still violate intent by touching areas it wasn’t supposed to.

---

## Don’t Clean Code and Clean Architecture already enforce good boundaries?
They help you design systems with good boundaries, but they don’t enforce **change intent**. Even in a well-architected codebase, an AI-generated “small refactor” can cross layers unintentionally while remaining stylistically clean and passing static checks.
This gate enforces *human expectations about scope*, not architectural quality.

---

## Isn’t this something code review is supposed to catch?
Yes — and that’s exactly the gap. Reviewers infer intent informally from PR descriptions and trust that the diff matches it. With AI-generated PRs, scope creep is common and review fatigue is real.
This gate makes intent explicit and machine-checkable so reviewers don’t have to manually police scope on every PR.

---

## Why not encode this as more Sonar rules or linters?
Static analysis tools evaluate code *in isolation*. They don’t have access to a reliable, structured declaration of what the change was *supposed* to do.
This gate exists specifically because “what was intended” is external to the code and must be declared and validated against the diff.

---

## Is this enforcing Clean Architecture or domain purity?
Indirectly, yes — but intentionally in a simpler way. Instead of trying to statically prove architectural correctness, the gate enforces **declared boundaries** (for example: “this change should not touch domain/data”).
That’s often a more practical and deterministic check than deep architectural analysis, especially for AI-assisted changes.

---

## Does this replace Sonar, linters, or tests?
No. It’s additive.

- Linters → Is the code syntactically and stylistically acceptable?
- Sonar / analyzers → Is this code maintainable and risky?
- Tests → Does it work?
- **Intent gate** → Does the PR match what it claims to be?

They answer different questions.

---

## Why is this especially useful with AI-generated code?
AI often produces *correct-looking* code that expands scope silently. Static tools are good at judging code quality, but they don’t catch “this PR touched more than requested.”
This gate exists to catch that specific failure mode early and deterministically.

---

## One-sentence summary
Clean Code tools judge code quality.
This gate judges **change permission**.
