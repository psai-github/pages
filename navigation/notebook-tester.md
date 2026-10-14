---
layout: opencs
title: Notebook Tester
description: Compile a single notebook on demand while running ./make_test locally.
permalink: /notebook-tester/
search_exclude: true
sitemap: false
test_server_port: 4600
---

<link rel="stylesheet" href="{{ '/assets/css/notebook-tester.css' | relative_url }}">

<section class="notebook-tester" data-server-port="{{ page.test_server_port }}" data-base-url="{{ site.baseurl }}">
  <header class="notebook-tester__header">
    <h1>Notebook Tester</h1>
    <p>Started with <code>./make_test</code>? Enter a notebook path to convert just that notebook and rebuild the site.</p>
  </header>

  <p class="notebook-tester__server-status" id="notebook-tester-server-status">Checking compile server…</p>

  <form class="notebook-tester__form" id="notebook-tester-form">
    <label for="notebook-tester-path">Notebook path</label>
    <div class="notebook-tester__row">
      <input id="notebook-tester-path" list="notebook-tester-options" autocomplete="off"
             placeholder="_notebooks/CSA/unit_01/2025-08-20-example.ipynb" required>
      <button type="submit" id="notebook-tester-submit">Compile</button>
    </div>
    <datalist id="notebook-tester-options"></datalist>
  </form>

  <div class="notebook-tester__result" id="notebook-tester-result" hidden></div>
  <pre class="notebook-tester__log" id="notebook-tester-log" hidden></pre>

  <h2>Compiled this session</h2>
  <ul class="notebook-tester__history" id="notebook-tester-history"></ul>
</section>

<script type="module" src="{{ '/assets/js/notebook-tester/notebook-tester.js' | relative_url }}"></script>
