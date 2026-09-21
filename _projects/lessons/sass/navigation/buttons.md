---
layout: post
title: SASS Buttons Grammar
description: Explore the Open Coding Society button grammar through living examples.
categories: [SASS, Buttons]
lesson_language: SASS
lesson_topic: Buttons Grammar
lesson_part: interactive
lesson_type: lesson
microblog: true
permalink: /sass/buttons-grammar
author: Rashi, Aashni, and Kelervia
---

# OCS SASS Buttons & SASS Button Grammar

### The Core SASS Rule
Buttons must use semantic HTML (`<button>` or `<a>`) paired with **OCS SASS button classes** (`ocs__btn`). Never use custom hardcoded CSS or inline `style=""` attributes to style buttons—let your global SASS variables, SASS mixins, and SASS theme classes handle all colors, hover states, and borders.

---

## 1. SASS Button Grammar Reference

Use standard OCS SASS class modifiers to express button roles and visual states cleanly:

| SASS Class / Modifier | Visual Role / Purpose | Example Usage |
| :--- | :--- | :--- |
| `ocs__btn` | **Base SASS Button Role:** Standard SASS button reset, layout, and font rules | `<button class="ocs__btn">Click</button>` |
| `ocs__btn fill` | **Filled Solid SASS Variant:** High-emphasis primary action | `<button class="ocs__btn fill">Submit</button>` |
| `ocs__btn outline` | **Outlined SASS Variant:** Secondary or low-emphasis action | `<button class="ocs__btn outline">Cancel</button>` |
| `ocs__btn small` | **SASS Size Modifier:** Compact button for tight layouts | `<button class="ocs__btn small">Edit</button>` |
| `alert-green` | **SASS Status Modifier (Success):** Confirmation or success actions | `<a class="ocs__btn alert-green fill">Save</a>` |
| `alert-yellow` | **SASS Status Modifier (Warning):** Caution or pending state | `<button class="ocs__btn alert-yellow">Caution</button>` |
| `alert-red` | **SASS Status Modifier (Danger):** Destructive actions (delete, remove) | `<button class="ocs__btn alert-red fill">Delete</button>` |

---

## 2. LxD Cycle Process

* **Empathize:** Many CSP students try to style buttons using custom classes or inline CSS (e.g., `<button style="background: blue; color: white;">Submit</button>`), or they use fake `<div>` buttons. This breaks accessibility, ruins site consistency, and duplicates SASS code that already exists globally in our SASS stylesheet system.
* **Define:**
  * **POV:** CSP students need a clear system for creating interactive buttons using semantic tags and OCS SASS utility classes so their project code remains clean, accessible, and SASS theme-compliant.
  * **Learning Goal:** Students will learn how SASS variables, SASS mixins, and SASS state modifiers (`&:hover`, `&:active`) power global button design, and how to apply predefined SASS classes without writing custom CSS.
* **Ideate:**
  * **HMW Question:** How might we teach students to use semantic button elements and OCS SASS button modifier classes instead of writing custom CSS rules?
  * **Activity:** Refactoring "fake" or hardcoded inline-styled buttons into clean semantic HTML with OCS SASS button modifiers.
* **Prototype & Test:** We tested a trial run with our team and revised the practice into a quick **Popcorn Hack** (2-minute class refactor) and one targeted **Homework Refactor**.

---

## 3. Lesson Plan

### Learning Objective
By the end of this lesson, you will be able to construct functional, accessible buttons using semantic HTML tags (`<button>`, `<a>`) and OCS SASS button classes (`ocs__btn`, `fill`, `outline`, `small`, `alert-*`) without writing manual CSS styling.

### Success Criteria
You can refactor broken, non-semantic, inline-styled button markup into clean, accessible OCS SASS buttons that automatically inherit SASS hover states, SASS active transitions, and SASS theme consistency.

### Tech Talk (3 minutes)
Under the hood, our global SASS system compiles reusable button styles using **SASS Variables** (e.g., `$btn-radius`, `$primary-color`) and **SASS Mixins** with SASS state operators (`&:hover`, `&:active`). 

As a frontend developer, your job is not to re-invent the SASS button stylesheet. Your job is to select the right **semantic element** and append the correct **OCS SASS button grammar class**.

* **The SASS Rule:** Use `<button>` for in-page actions (forms, submissions, toggles) and `<a>` for navigational links. Apply `ocs__btn` plus visual SASS modifiers.
* **✅ Do this:** `<button class="ocs__btn alert-green fill small">Save Changes</button>`
* **❌ Don't do this:** `<div onclick="save()" style="background: green; padding: 10px;">Save Changes</div>`

---

### Code Examples

#### A. Simple: Basic Semantic Buttons

```html
<!-- We use button tags for in-page actions and a tags for navigational links. -->
<button class="ocs__btn">Standard Action</button>
<a href="/capstone/goodbrain/" class="ocs__btn">View Project ↗</a>
```

#### B. Intermediate: Adding SASS Modifiers

``` html
<!-- Use predefined OCS SASS modifier classes for visual variants. -->
<button class="ocs__btn fill">Primary Submit</button>
<button class="ocs__btn outline">Cancel</button>
```

#### C. Complex: Full Button Group & Status Variants

``` html
<!-- Combining OCS SASS state modifiers for contextual actions -->
<div class="flex gap-2">
  <button class="ocs__btn alert-green fill small">Approve</button>
  <button class="ocs__btn alert-yellow outline small">Hold</button>
  <button class="ocs__btn alert-red fill small">Delete</button>
</div>
```


---

## 4. Hacks & Practice Tasks

### Prepare your submission IPYNB

Complete this quick-start flow so you can begin in about 2 minutes.

1. Create a new notebook in your portfolio homework area
2. Add one markdown cell at the top with the frontmatter below.
3. Add code cells for Popcorn and Homework. Keep the `%%html` and `UI_RUNNER` comment in each code cell.
4. Run each cell and verify the rendered output before submitting.

```raw
---
layout: post
title: OCS SASS Buttons & SASS Button Grammar HW 
categories: [SASS]
lesson_language: SASS
lesson_topic: SASS Buttons HW
lesson_part: interactive
lesson_type: lesson
permalink: /sass/buttons-hw
author: githubID
---
```
### Submission Safety Rules (Read First)

> **[!IMPORTANT]**
> To avoid grading errors, follow these rules exactly:
>
> * Submit **only** your final refactored HTML for each hack.
> * **Do not** add custom CSS, inline styles, or extra non-OCS classes.
> * Keep the `%%html` cell magic tag and the `UI_RUNNER` comment line intact in each submission cell.
> * Use only allowed semantic tags and OCS classes for this lesson: `<a>`, `<button>`, `ocs__btn`, `fill`, `outline`, `small`, `alert-green`, `alert-yellow`, `alert-red`.
> * For this notebook assignment, treat your notebook content as the student artifact, while site pages still reserve global SASS stylesheets.
> * Your cell should start with this exact header line:


```text
%%html
<!-- UI_RUNNER: SASS Buttons Popcorn Base -->
```


### Popcorn Hack (In-Class)

**Purpose:** Practice replacing non-semantic, inline-styled elements with proper semantic `<button>` tags and OCS SASS utility classes to instantly inherit hover states and theme styling.

> **[!TIP] 2-Minute Challenge:** Look at the bad code below. Refactor the **two** fake button elements into real `<button>` tags using the OCS SASS button classes (`ocs__btn`, `fill`, `alert-green`, `alert-red`). Remove all inline `style="..."` attributes!

**Starter Code to Copy:**

```html
%%html
<!-- UI_RUNNER: SASS Buttons Popcorn Base --> 
<div class="flex gap-2">
  <!-- 1. Refactor to a green success action button -->
  <div class="fake-btn" style="background: green; color: white;">
    Save Changes
  </div>

  <!-- 2. Refactor to a red danger action button -->
  <span class="fake-btn" style="border: 1px solid red; color: red;">
    Cancel Order
  </span>
</div>
```



### Homework Hack

**Purpose:** Practice refactoring a realistic frontend button bar by converting hardcoded, non-semantic tags into clean, standardized OCS SASS buttons.

> **Quick Cheat Sheet for Beginners:**
> 1. **Choose the Tag:** Use `<button>` for in-page actions (Submit, Delete, Hold) and `<a>` for page links (`href="..."`).
> 2. **Delete Hand-Coded CSS:** Wipe out all `style="..."` attributes completely.
> 3. **Apply SASS Grammar Classes:**
>    * Base class (Required): `ocs__btn`
>    * Primary action (Blue solid): `fill`
>    * Small green navigation link: `alert-green outline small`
>    * Caution/Warning button: `alert-yellow outline`
>    * Destructive action (Red solid): `alert-red fill small`


**Starter Code to Copy:**

```html
%%html
<!-- UI_RUNNER: SASS Buttons Homework Base --> 
<div class="flex gap-2">
  <!-- 1. Primary Action: Convert to a primary filled SASS button -->
  <span class="my-custom-btn" style="background: blue; color: white;">
    Submit Form
  </span>

  <!-- 2. Green Navigation: Convert to a small green navigation link -->
  <div class="fake-link" style="color: green;" onclick="location.href='/success'">
    View Results ↗
  </div>

  <!-- 3. Caution Action: Convert to an outlined yellow warning button -->
  <span class="warn-pill" style="border: 1px solid orange; color: orange;">
    Hold Status
  </span>

  <!-- 4. Danger Action: Convert to a small red filled danger button -->
  <p class="red-box" style="background: red; color: white;">
    Delete Account
  </p>
</div>
```


**Instructions:**
1. Copy the starter code block above and paste it into a code cell inside your homework notebook
2. Refactor each non-semantic tag into its proper HTML element and swap the inline `style="..."` attributes for OCS SASS modifier classes.
3. Execute the cell using `UI_RUNNER` and confirm all four buttons display proper hover effects and alignment before committing.

---

## 5. Grading Rubric & Submission Requirements

| Requirement | Point Value | Success Criteria |
| :--- | :--- | :--- |
| **Popcorn Hack** | 0.25 pts | Correctly refactored in-class code cell using semantic `<button>` tags and OCS SASS classes (`ocs__btn`, `alert-green`, `alert-red`). No inline styles present. |
| **Homework Hack** | 0.50 pts | Fully refactored 4-button bar. Used correct semantic tags (`<button>` vs `<a>`), removed all inline `style=""` attributes, and correctly applied OCS state modifiers. |
| **Technical & Code Quality** | 0.25 pts | Clean notebook execution using `%%html` and `UI_RUNNER`. No stray non-OCS utility classes or inline styling used anywhere. |

---

## 6. Feedback & Evidence

```markdown
### Peer Review & Verification Checklist

- [ ] All `style="..."` attributes completely removed from notebook cells.
- [ ] In-page actions use `<button>` tags; navigation links use `<a>` tags.
- [ ] Every button includes the base class `ocs__btn`.
- [ ] `UI_RUNNER` comment line is retained at the top of each code cell.
- [ ] Proof of execution (rendered interactive buttons) visible in student notebook post.
```