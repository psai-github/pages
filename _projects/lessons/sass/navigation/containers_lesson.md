---
layout: post
title: SASS Containers Grammar
description: Learn and explore Open Coding Society container grammar through living examples.
categories: [SASS, Containers]
lesson_language: SASS
lesson_topic: Containers
lesson_part: interactive
lesson_type: lesson
microblog: true
permalink: /navigation/sass/containers/lesson/
---

<!-- markdownlint-disable MD033 MD046 -->

<div class="ocs__container">
<div class="ocs__badge">Lesson · Frontend + SASS</div>

## A Bit About Frontend & SASS

<p class="ocs__description">Frontend is what a visitor sees and touches in the browser. SASS is how we style it without repeating ourselves. Containers are where the two meet: one shared wrapper that gives every page the same boundary.</p>

<div class="ocs__links ocs__links--wide">
<a class="ocs__btn pill accent fill" href="#frontend-trio">Frontend trio</a>
<a class="ocs__btn pill" href="#what-sass-adds">What SASS adds</a>
<a class="ocs__btn pill" href="#containers-meet">Containers</a>
</div>

<div class="ocs__card" id="frontend-trio">

### The Frontend Trio — 30-Second Version

<div class="ocs__grid ocs__grid--card cols-3">
<div class="ocs__grid-cell">
<h4>HTML</h4>
<p>Structure and meaning.</p>
<span class="ocs__status-pill ocs__status-pill--neutral">structure</span>
</div>
<div class="ocs__grid-cell ocs__grid-cell--accent">
<h4>SASS / CSS</h4>
<p>Presentation and layout.</p>
<span class="ocs__status-pill ocs__status-pill--good">this lesson</span>
</div>
<div class="ocs__grid-cell">
<h4>JavaScript</h4>
<p>Behavior and interaction.</p>
<span class="ocs__status-pill ocs__status-pill--neutral">behavior</span>
</div>
</div>

<div class="ocs__callout">Say it in one line: HTML says <em>what</em> is on the page, SASS says <em>how</em> it looks, JavaScript says <em>what it does</em>.</div>

</div>

<div class="ocs__card" id="what-sass-adds">

### What SASS Adds to CSS

SASS compiles to plain CSS, so the browser sees nothing new — authors just get better tools.

<ul class="ocs__entity-list">
<li><strong>Variables:</strong> name a color or spacing once, reuse it everywhere.</li>
<li><strong>Nesting:</strong> write selectors inside their parent, matching the HTML.</li>
<li><strong>Partials and imports:</strong> split styles by topic, compile to one file.</li>
<li><strong>Mixins:</strong> package a reusable pattern such as a card or grid cell.</li>
</ul>

<div class="ocs__table-wrap">
<table class="ocs__table">
<thead>
<tr><th>CSS</th><th>SASS</th></tr>
</thead>
<tbody>
<tr><td>Repeated hex codes</td><td>One variable, used everywhere</td></tr>
<tr><td>Flat, repeated selectors</td><td>Nested selectors</td></tr>
<tr><td>Copy-pasted patterns</td><td>Reusable mixins</td></tr>
</tbody>
</table>
</div>

<div class="ocs__callout">On this site, shared SASS lives in <code>_sass/open-coding/</code> and compiles through <code>_main.scss</code> — one change updates every page.</div>

</div>

<div class="ocs__card" id="containers-meet">

### Containers: Where Frontend Meets SASS

The `ocs__container` class sets the page boundary — width, centering, padding, font, and text color — so no page rewrites layout CSS.

```html
<div class="ocs__container">
  <div class="ocs__card">
    <!-- grids, tables, images, and buttons go here -->
  </div>
</div>
```

<div class="ocs__keypoints">
<div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Start with grammar: container, then card, then grid or table, then button.</span></div>
<div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Cards group related content; grids compare or repeat it; tables structure it.</span></div>
<div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Write custom SASS only when the shared grammar cannot express the idea.</span></div>
</div>

</div>

<div class="ocs__callout">Presenter close: good frontend means a new page is mostly composition — pick container, card, grid, and button — not new CSS.</div>

</div>

<!-- markdownlint-enable MD033 MD046 -->
