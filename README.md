# IntentGate

**Enforce PR scope before merge.**

IntentGate is a CI gate that blocks pull requests when the actual changes exceed the declared intent.
It’s designed to catch silent scope creep — especially common with AI-generated code — that passes linting, tests, and static analysis.

---

## Why this exists

Modern CI already answers questions like:
- Does the code compile?
- Is it clean?
- Do tests pass?
- Is it secure?

What’s missing is a simple, deterministic check for:

**“Did this PR stay within what it claimed to change?”**

With AI-assisted development, PRs often expand scope unintentionally.
IntentGate makes scope explicit and machine-checkable.

---

## What IntentGate does

IntentGate treats **intent as a contract** and validates the PR diff against it.

It fails CI if:
- forbidden paths or layers are touched
- required evidence (like tests) is missing
- the change exceeds declared scope

It does **not** judge code quality.
It judges **change permission**.

---

## What it does NOT do

IntentGate is intentionally narrow.

It does not:
- replace linters, tests, or security scanners
- analyze code quality or architecture
- perform AI review or heuristics
- call an LLM
- manage deployments or releases

It is a small, deterministic gate that runs in CI.

---

## How it fits into CI

CI checks often run in parallel, but they answer different questions:

- Linters → Is the code acceptable?
- Sonar / analyzers → Is the code maintainable and risky?
- Tests → Does it work?
- **IntentGate → Was this change allowed given its declared intent?**

IntentGate complements existing checks; it doesn’t replace them.

---

## Example intent file

```yaml
intent_version: 1

allowed:
  paths:
    - "src/ui/**"

forbidden:
  paths:
    - "src/domain/**"
    - "src/data/**"

require:
  tests_touched: true
```

If a PR touches `src/domain/**` or `src/data/**`, or fails to update tests when required, CI fails — even if lint and tests pass.

---

## Why this is especially useful with AI-generated code

AI often produces correct-looking code that:
- touches more files than requested
- crosses layers unintentionally
- expands scope silently

Static tools are good at judging code quality.
They are not designed to judge **intent vs diff**.

IntentGate exists to catch that specific failure mode early.

---

## Installation

```yaml
- name: IntentGate
  uses: your-org/intent-gate@v0
  with:
    intent_path: intent.yml
```

Runs on `pull_request` by default.

---

## FAQ

**Isn’t this just another linter or Sonar-style check?**  
No. Linters and analyzers judge *code quality*. IntentGate judges *change permission* by validating the PR diff against declared intent (scope, touched areas, required evidence).

**Does this replace linting, tests, or code review?**  
No. It’s additive. Those tools answer whether the code is good and works. IntentGate answers whether the change stayed within what it claimed to be.

**More questions?**  
See **[FAQ.md](FAQ.md)** for a deeper comparison with linters, Sonar, Clean Code, and code review.


---

## License

IntentGate is released for evaluation and experimentation.
Commercial reuse and redistribution are restricted.
See the LICENSE file for details.
