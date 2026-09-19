---
layout: post
assignment: true
title: OCS SASS Containers Grammar
categories: [SASS, Containers]
lesson_language: SASS
lesson_topic: Containers
lesson_part: interactive
lesson_type: lesson
permalink: /navigation/sass/containers/lesson/
author: Rigved, Samarth, Rohan
microblog: true
---

## OCS Container

The OCS Container is a structural wrapper that establishes the page boundary and provides structure for the content in our page.  



### How it Fits

```mermaid
flowchart TB
    subgraph container["ocs__container<br/>outer page boundary"]
        direction TB
        nav["navigation / ocs__links"]
        heading["ocs__section-title<br/>+ ocs__description"]
        subgraph card["ocs__card<br/>framed group"]
            direction TB
            subgraph grid["ocs__grid<br/>repeated layout"]
                direction TB
                cell1["ocs__grid-cell<br/>text + ocs__btn"]
                cell2["ocs__grid-cell<br/>text + status"]
            end
            tablewrap["ocs__table-wrap<br/>ocs__table"]
            callout["ocs__callout"]
        end
        actions["ocs__btn actions<br/>ocs__pager"]
        nav --> heading --> card --> actions
        grid --> tablewrap --> callout
        cell1 --> cell2
    end
```

**Key Takeaway**: Containers encompass the entire page, and all other SASS elemenets are "contained" in them.

### Tech Talk

We are using a shared OCS container grammar. This means **you don't need to write CSS for your page layout**. Instead of writing wrapper styles, you just need to put your code within a `ocs_container` block. The global system to take care of the styling.

* **The Rule:** Use one `ocs__container` `<div>` block per page, with children like `ocs__card` and `ocs__grid`. Let the system handle the look.
* ✅ **Do this:** `<div class="ocs__container">` with `<div class="ocs__card">` inside it
* ❌ **Don't do this:** `<div class="page-wrap" style="max-width: 900px; margin: auto;">` or `<div class="pretty-box">`

Why do we do this? It ensures our whole project looks consistent, makes our code reusable, and keeps every page responsive without extra work.

### SASS Code

You can find the OCS SASS Container code in `_sass/open-coding/elements/containers/common.scss` (loaded through `_main.scss` in the same folder):

```scss
// Shared page container for document-style elements.
.ocs__container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: var(--pref-font-family);
  color: var(--pref-text-color);
}

.ocs__container,
.ocs__container * {
  box-sizing: border-box;
}
```

What this code does:

* `max-width: 900px; margin: 0 auto;` — constrains the page to a readable width and centers it, establishing the outer page boundary.
* `padding: 2rem 1.5rem;` — adds breathing room so content never touches the viewport edge.
* `font-family` / `color` — inherit the active user-preference theme tokens, so the container adapts to light/dark/accent choices with no page-specific CSS.
* `box-sizing: border-box;` — applied to the container and all children so padding and borders stay inside the 900px boundary.

### Code Examples

> How you can use OCS containers in your blogs, projects, and hacks.

#### A. Simple: Container and Card

```html
<!-- One container per page. Cards group related content inside it. -->
<div class="ocs__container">
  <h2 class="ocs__section-title">About Our Project</h2>
  <div class="ocs__card">
    <p class="ocs__description">We are a group of CSP students building a cool web app.</p>
  </div>
</div>
```

#### B. Adding a Grid

```html
<!-- Don't invent column classes. Use ocs__grid with ocs__grid-cell children. -->
<div class="ocs__container">
  <div class="ocs__card">
    <h3 class="ocs__section-title">Team Roles</h3>
    <div class="ocs__grid ocs__grid--standard cols-2">
      <div class="ocs__grid-cell">Frontend: builds the pages.</div>
      <div class="ocs__grid-cell">Backend: builds the API.</div>
    </div>
  </div>
</div>
```

#### C. Complex: Full Container Composition

```html
<!-- Compose container > card > grid + table, mirroring the Containers Grammar page -->
<div class="ocs__container">
  <h2 class="ocs__section-title">Hardware Plan</h2>
  <div class="ocs__card">
    <div class="ocs__grid ocs__grid--standard cols-2">
      <div class="ocs__grid-cell ocs__grid-cell--accent">Current hardware</div>
      <div class="ocs__grid-cell">Next hardware</div>
    </div>
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <tr><th>Item</th><th>Status</th></tr>
        <tr><td>Camera</td><td>Current</td></tr>
      </table>
    </div>
    <div class="ocs__callout">The same structure adapts to the active theme. No page-specific CSS is needed.</div>
  </div>
</div>
```

