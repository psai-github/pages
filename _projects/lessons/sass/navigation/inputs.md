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
codemirror: true
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

### What Is an Input?

An HTML `<input>` is a **form control that lets a user give data to a web page**. The browser renders the control, the user changes its value, and JavaScript or a form submission can read that value.

The most important pieces are:

| Part | What it does |
| --- | --- |
| `type` | Chooses the kind of input, such as `text`, `email`, `number`, or `password`. |
| `value` | The data currently stored in the input. In JavaScript, `input.value` is normally a string. |
| `placeholder` | A short hint shown when the field is empty. It is not a replacement for a real label. |
| `name` | The key used when a traditional HTML form submits the field. |
| `class` | Controls reusable styling. In this lesson we use the OCS SASS input grammar. |

A simple input looks like this:

```html
<label for="student-name">Name</label>
<input
  id="student-name"
  name="studentName"
  type="text"
  class="ocs__input medium"
  placeholder="Enter your name"
>
```

The important distinction is: **HTML defines the input, SASS styles it, and JavaScript can read or react to its value.**

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

### Interactive UI Runner: Read an Input Value

This runner creates a real text input. Click **Run**, type into the rendered field, and watch JavaScript read the input's `.value`.

{% capture input_value_challenge %}
Run the example, type a name into the input, and observe how the displayed value changes. Then edit the placeholder or size modifier and run it again.
{% endcapture %}

{% capture input_value_code %}
outputElement.innerHTML =
  '<div class="ocs__card">' +
    '<label for="input-value-demo">Your name</label>' +
    '<input id="input-value-demo" name="studentName" type="text" class="ocs__input medium" placeholder="Type your name">' +
    '<p id="input-value-result">Current value: ""</p>' +
  '</div>';

const field = outputElement.querySelector('#input-value-demo');
const result = outputElement.querySelector('#input-value-result');

field.addEventListener('input', () => {
  result.textContent = 'Current value: "' + field.value + '"';
});
{% endcapture %}

{% include runners/ui.html
   runner_id="sass-input-value-demo"
   challenge=input_value_challenge
   code=input_value_code
   height="300px"
   output_height="220px"
   autostart="true"
%}

### Interactive UI Runner: Test OCS Input Classes

This runner is useful for teaching the SASS part of the lesson. Change `sizeClass` to `small`, `medium`, or `large`; toggle `useGradient`; then click **Run**.

{% capture input_style_challenge %}
Experiment with the OCS input modifiers. Change the size and gradient setting, run the code, and compare the rendered input.
{% endcapture %}

{% capture input_style_code %}
outputElement.innerHTML = '';

const sizeClass = 'large';
const useGradient = true;

const label = document.createElement('label');
label.textContent = 'Email';
label.setAttribute('for', 'styled-input-demo');

const input = document.createElement('input');
input.id = 'styled-input-demo';
input.type = 'email';
input.placeholder = 'student@example.com';
input.className = 'ocs__input ' + sizeClass + (useGradient ? ' gradient' : '');

const info = document.createElement('p');
info.textContent = 'Classes: ' + input.className;

outputElement.append(label, document.createElement('br'), input, info);
{% endcapture %}

{% include runners/ui.html
   runner_id="sass-input-style-demo"
   challenge=input_style_challenge
   code=input_style_code
   height="300px"
   output_height="220px"
   autostart="true"
%}

### Interactive UI Runner: Input + Button

This example shows the full flow: the user types data into an input, clicks a button, and JavaScript reads the value.

{% capture input_submit_challenge %}
Type a message and click the rendered Submit button. Change the input type or size class and run the example again.
{% endcapture %}

{% capture input_submit_code %}
outputElement.innerHTML =
  '<div class="ocs__card">' +
    '<label for="message-input-demo">Message</label>' +
    '<input id="message-input-demo" type="text" class="ocs__input medium" placeholder="Enter a message">' +
    '<button id="message-submit-demo" type="button" class="ocs__btn fill">Submit</button>' +
    '<p id="message-output-demo">Nothing submitted yet.</p>' +
  '</div>';

const input = outputElement.querySelector('#message-input-demo');
const button = outputElement.querySelector('#message-submit-demo');
const message = outputElement.querySelector('#message-output-demo');

button.addEventListener('click', () => {
  message.textContent = input.value
    ? 'Submitted value: "' + input.value + '"'
    : 'Enter a value first.';
});
{% endcapture %}

{% include runners/ui.html
   runner_id="sass-input-submit-demo"
   challenge=input_submit_challenge
   code=input_submit_code
   height="320px"
   output_height="240px"
   autostart="true"
%}

### Code Runner: Input Values Are Strings

The visual runners show the browser control. This JavaScript Code Runner explains what happens to the data after it is read. Edit `rawAge` and click **Run**.

{% capture input_string_challenge %}
Change rawAge, run the code, and explain why Number(rawAge) is useful after reading a numeric value from an HTML input.
{% endcapture %}

{% capture input_string_code %}
const rawAge = "16";

console.log("Raw input value:", rawAge);
console.log("Raw type:", typeof rawAge);

const age = Number(rawAge);
console.log("Converted value:", age);
console.log("Converted type:", typeof age);
console.log("Next year:", age + 1);
{% endcapture %}

{% include runners/code.html
   runner_id="sass-input-string-demo"
   language="javascript"
   challenge=input_string_challenge
   code=input_string_code
%}

### Code Runner: Validate User Input

This example shows a common next step after collecting input: checking whether the value is acceptable.

{% capture input_validation_challenge %}
Try several emailValue strings and run the code. What makes the simple validation pass or fail?
{% endcapture %}

{% capture input_validation_code %}
const emailValue = "student@example.com";

if (emailValue.trim() === "") {
  console.log("Please enter an email address.");
} else if (!emailValue.includes("@")) {
  console.log("That does not look like an email address.");
} else {
  console.log("Accepted:", emailValue);
}
{% endcapture %}

{% include runners/code.html
   runner_id="sass-input-validation-demo"
   language="javascript"
   challenge=input_validation_challenge
   code=input_validation_code
%}

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

## Local Testing

Use the repo's normal local development workflow so the SASS, Liquid includes, UI Runner, Code Runner, assignment UI, and microblog assets are built the same way they are for Pages.

From the repository root:

```bash
git pull
make stop
make clean
make
```

The default port is `4500`. In this fork, `baseurl` is empty, so open:

```text
http://localhost:4500/sass/inputs/
```

### Local Test Checklist

1. Confirm there is only one Inputs lesson at `/sass/inputs/`.
2. Confirm the page shows the standard **Submit Assignment** section near the bottom.
3. Confirm the Microblog controls render at the top of the page. Creating posts requires the configured OCS backend/login.
4. In **Read an Input Value**, type text and confirm the displayed value updates on every keystroke.
5. In **Test OCS Input Classes**, change `large` to `small` or `medium`, toggle `useGradient`, and click **Run**.
6. In **Input + Button**, type a message and verify the rendered button reads and displays the value.
7. Run both JavaScript Code Runners. On localhost, the runner has a browser fallback if the JavaScript backend is unavailable.
8. Resize the browser and confirm the inputs remain usable.
9. Check the terminal for Jekyll or SASS errors.

For a build-only check without keeping the preview server running:

```bash
make build
```

This project-aware build regenerates registered project assets, navigation includes, converted notebooks, and documentation before Jekyll runs.

If a renamed or deleted lesson still appears locally, clear generated output and rebuild:

```bash
make stop
make clean
make
```

---

## 5. Lesson Revisions & Feedback Evidence

**Feedback Received:** The lesson was originally placed in the Python notebook directory even though it teaches SASS. The reviewer also noted that the lesson should follow the Markdown-based SASS lesson structure and integrate with the site's normal submission and microblog behavior.

**Revision Made:** The lesson now lives in the SASS navigation lesson directory as Markdown, uses `assignment: true` for the standard submission UI, keeps the canonical trailing-slash permalink used by the microblog topic path, and teaches the OCS `ocs__input` grammar while retaining the older input classes for backward compatibility.
