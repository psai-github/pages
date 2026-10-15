---
layout: opencs
title: Notebook Tester
description: Compile a single notebook on demand while running ./make_test locally.
permalink: /notebook-tester/
search_exclude: true
sitemap: false
test_server_port: 4600
---

<section class="ocs__container notebook-tester" data-server-port="{{ page.test_server_port }}" data-base-url="{{ site.baseurl }}">
  <div class="ocs__badge">make_test</div>
  <h1>Notebook Tester</h1>
  <p class="ocs__description">Started with <code>./make_test</code>? Enter a notebook path to convert just that notebook and rebuild the site.</p>

  <div class="ocs__card">
    <p><span class="ocs__status-pill ocs__status-pill--neutral" id="notebook-tester-server-status">Checking compile server…</span></p>

    <form class="notebook-tester__form" id="notebook-tester-form">
      <label for="notebook-tester-path">Notebook path</label>
      <div class="notebook-tester__row">
        <input id="notebook-tester-path" list="notebook-tester-options" autocomplete="off"
               placeholder="_projects/lessons/csa1/notebooks/2024-10-29-sprint2_plan.ipynb" required>
        <button type="submit" class="ocs__btn accent fill" id="notebook-tester-submit">Compile</button>
      </div>
      <datalist id="notebook-tester-options"></datalist>
    </form>

    <div class="ocs__callout notebook-tester__result" id="notebook-tester-result" hidden></div>
    <pre class="notebook-tester__log" id="notebook-tester-log" hidden></pre>
  </div>

  <h2 class="ocs__section-title">Compiled this session</h2>
  <ul class="notebook-tester__history" id="notebook-tester-history"></ul>
</section>

<script type="module" src="{{ '/assets/js/notebook-tester/notebook-tester.js' | relative_url }}"></script>
