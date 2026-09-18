---
layout: post
assignment: true
title: SASS Inputs — PAW Patrol
description: Learn the OCS SASS input grammar and refactor hardcoded input styles into reusable classes.
categories: [SASS, Inputs]
lesson_language: SASS
lesson_topic: Inputs
lesson_part: interactive
lesson_type: lesson
microblog: true
permalink: /sass/inputs/
author: PAW Patrol
---

# OCS SASS Inputs

## 1. LxD Cycle Process

### Empathize

Students often style inputs by hand with inline CSS such as `style="width: 400px; border: 3px dashed purple;"` or invent one-off classes for each field. That may work for one page, but it makes forms inconsistent and harder to maintain when the site theme changes.

### Define

**POV:** CSP students need a shared, class-based input system so forms stay consistent without repeating custom CSS.

**Learning Goal:** Students will use the OCS input grammar—`ocs__input` plus reusable size and style modifiers—instead of inline styles or made-up classes.

### Ideate

**HMW Question:** How might we teach students to choose an existing input role and modifier before writing custom CSS?

**Activity:** Refactor hardcoded inputs into clean OCS input markup.

### Prototype & Test

Our first practice version asked students to build a full form from scratch. That took too long, so the practice was reduced to a quick refactor task followed by one focused homework exercise.

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to size and style `<input>` elements using the OCS SASS input grammar.

**Success Criteria:** You can remove inline input styling and replace it with `ocs__input` plus the correct size and style modifiers.

### OCS Input Grammar

| Class / Modifier | Purpose | Example |
| --- | --- | --- |
| `ocs__input` | Base input role | `<input class="ocs__input">` |
| `small` | Compact input | `<input class="ocs__input small">` |
| `medium` | Standard input size | `<input class="ocs__input medium">` |
| `large` | Large input | `<input class="ocs__input large">` |
| `gradient` | Gradient style | `<input class="ocs__input gradient">` |

Modifiers can be combined:

```html
<input
  type="text"
  class="ocs__input large gradient"
  placeholder="Username"
>
```

> **Backward compatibility:** Existing pages that use `smallInput`, `mediumInput`, `largeInput`, or `gradientInput` will continue to work. New code should use the OCS grammar shown above.

### Tech Talk

The global SASS system already provides the shared input appearance. Your HTML should describe the component role and modifiers rather than duplicate styling.

**The Rule:** Use `ocs__input` and its modifiers. Let the global SASS system handle the visual design.

- ✅ Do this: `<input type="email" class="ocs__input medium" placeholder="Email">`
- ❌ Don't do this: `<input type="email" style="width: 300px; padding: 8px;" placeholder="Email">`

### Code Examples

#### A. Simple: Base Input

```html
<input type="text" class="ocs__input" placeholder="Default input">
```

#### B. Intermediate: Size Modifiers

```html
<input type="text" class="ocs__input small" placeholder="First Name">
<input type="text" class="ocs__input large" placeholder="Search...">
```

#### C. Complex: Combined Modifiers

```html
<input type="text" class="ocs__input large gradient" placeholder="Username">
```

### Accessibility Tips

- Prefer a visible `<label>` for form fields.
- If a visible label is not available, provide an appropriate accessible name such as `aria-label`.
- Keep keyboard focus visible.
- Use the correct input `type` such as `email`, `number`, or `password` when appropriate.

---

## 3. Hacks & Practice Tasks

### Prepare Your Submission (IPYNB)

1. Create a notebook in your portfolio homework area: `_notebooks/homework`.
2. Add a markdown cell with the frontmatter below.
3. Add code cells for the Popcorn Hack and Homework Hack.
4. Keep `%%html` and the `UI_RUNNER` comment in each code cell.
5. Run each cell and verify the rendered result before submitting.

```raw
---
layout: post
title: SASS Inputs PAW Patrol HW
categories: [SASS]
lesson_language: SASS
lesson_topic: Inputs HW
lesson_part: interactive
lesson_type: lesson
permalink: /sass/inputs-hw/
author: githubID
---
```

### Submission Safety Rules

> [!IMPORTANT]
> - Submit only your final class-based input markup for each hack.
> - Do not add custom CSS, inline styles, or made-up classes.
> - Keep `%%html` and the `UI_RUNNER` comment line in each notebook submission cell.
> - For new code, use `ocs__input` with the allowed modifiers: `small`, `medium`, `large`, and `gradient`.

### Popcorn Hack (In-Class)

> [!TIP]
> **2-minute challenge:** refactor the code, run it, and submit only the corrected markup.

**Task:** Replace the inline styling and made-up class below with the OCS input grammar.

```html
%%html
<!-- UI_RUNNER: Inputs Popcorn Base -->

<input type="text" style="width: 400px; border: 3px dashed purple;" placeholder="Search...">
<input type="text" class="box" placeholder="First Name">
```

**Expected direction:** one large, gradient-styled input and one compact plain input, both using `ocs__input`.

### Homework Hack

**Task:** Refactor this signup form. Remove all inline styles and made-up classes. Use `ocs__input` with the appropriate size and style modifiers, then run it with `UI_RUNNER`.

```html
%%html
<!-- UI_RUNNER: Inputs Homework Base -->

<input type="text" style="width: 500px; background: linear-gradient(to right, pink, purple);" placeholder="Username">
<input type="text" class="tinybox" placeholder="First Name">
<input type="email" style="padding: 6px;" placeholder="Email address">
```

---

## 4. Grading Plan (1 Point Total)

### Classroom Rubric

- **0.2 points — Popcorn completion:** Student submitted a class-based refactor attempt and kept the code runnable with `%%html`.
- **0.8 points — Homework completion:**
  - **0.4 — input grammar:** Every input uses `ocs__input` with an appropriate size modifier.
  - **0.3 — style modifier:** The gradient field uses `gradient` instead of inline background or border styling.
  - **0.1 — accessibility:** Every input has a clear purpose through a label, placeholder, or accessible name.

### Quick Validation Checklist

- Present: `%%html` and the `UI_RUNNER` comment line in homework notebook cells.
- Absent: inline `style` attributes and made-up classes.
- Present: `ocs__input` on each submitted input.
- Present: appropriate `small`, `medium`, or `large` modifiers.
- Present: `gradient` where decorative gradient styling is required.

---

## 5. Lesson Revisions & Feedback Evidence

**Feedback Received:** The lesson was originally placed in the Python notebook directory even though it teaches SASS. The reviewer also noted that the lesson should follow the Markdown-based SASS lesson structure and integrate with the site's normal submission and microblog behavior.

**Revision Made:** The lesson now lives in the SASS navigation lesson directory as Markdown, uses `assignment: true` for the standard submission UI, keeps the canonical trailing-slash permalink used by the microblog topic path, and teaches the OCS `ocs__input` grammar while retaining the older input classes for backward compatibility.
