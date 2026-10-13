---
toc: false
layout: post
title: Classroom Presence System, Pipeline
description: How one RFID tap travels from the CrowPi to the live dashboard, and what comes next.
permalink: /capstone/presence-system/pipeline/
year: "2026-2027"
rp_active: pipeline
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Pipeline</div>
    <h2 class="ocs__section-title">From tap to dashboard</h2>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-hero.svg" alt="A student taps the RFID tag on their laptop on the CrowPi reader by the classroom door. Flask logs the tap and the dashboard shows the student as present. A wall camera, drawn dashed, is the next step.">
    <p class="ocs__description">How it works today: tap the laptop tag, and the teacher's dashboard updates in about 2 seconds.</p>
  </div>

  <div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-problem.svg" alt="One 66-minute class period. The student arrives 12 minutes late and is out for 17 minutes mid-class, but roll call still records Present.">
    <p class="ocs__description">The problem: roll call says Present, but this student missed 29 of 66 minutes.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__grid ocs__grid--standard cols-2">
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/crowpi.jpg" alt="The CrowPi tap station: a Raspberry Pi board in a case with a screen, RFID pad at the bottom left">
        <p class="ocs__description">Tap station: RFID pad at bottom left.</p>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/dashboard-after-tap.png" alt="Live dashboard two seconds after a tap, with Vibha marked Present">
        <p class="ocs__description">Teacher dashboard: Present two seconds after a tap.</p>
      </div>
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Postman stands in for the CrowPi</h3>
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>#</th><th>Method</th><th>Request</th><th>Dashboard shows</th></tr></thead>
        <tbody>
          <tr><td>1</td><td><code>POST</code></td><td>Log in</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Teacher session</span></td></tr>
          <tr><td>2</td><td><code>POST</code></td><td>Start demo period</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Everyone: not yet arrived</span></td></tr>
          <tr><td>3</td><td><code>POST</code></td><td>Tap</td><td><span class="ocs__status-pill ocs__status-pill--good">Present</span></td></tr>
          <tr><td>4</td><td><code>POST</code></td><td>Tap again</td><td><span class="ocs__status-pill ocs__status-pill--warn">Stepped Out</span></td></tr>
          <tr><td>5</td><td><code>POST</code></td><td>Same tap, resent</td><td><span class="ocs__status-pill ocs__status-pill--good">Not counted twice</span></td></tr>
          <tr><td>6</td><td><code>POST</code></td><td>Fake device key</td><td><span class="ocs__status-pill ocs__status-pill--bad">401 rejected</span></td></tr>
          <tr><td>7</td><td><code>GET</code></td><td>Status</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Same data as dashboard</span></td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">Same request, same server, and the dashboard updates live.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    T(["Student taps laptop tag"]) --> C["CrowPi
RFID reader"]
    C -- "tap + time" --> F[("Flask API
+ database")]
    D["Live dashboard
OCS Pages"] -- "status every 2s" --> F
    M["Jarvis camera
Mac Mini"] -. "next: face check" .-> F
    classDef next stroke-dasharray: 6 4
    class M next
</pre>
    </div>
    <p class="ocs__description">Architecture: solid lines run today; the dashed camera path is next.</p>
  </div>

  <div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-roadmap.svg" alt="Where it&#x27;s going. Now: tap the laptop tag on the CrowPi, working. Next: tap plus a camera face check. Later: walk through the front or back door and a UHF reader reads the laptop tag automatically.">
    <p class="ocs__description">Where it's going: today a tap, next a face check, later no tap at all.</p>
  </div>

  <div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-plan.svg" alt="Plan: done through October 11, today&#x27;s review, camera around October 19, second tap reader, Cycle 1 minutes accuracy, then a classroom pilot.">
    <p class="ocs__description">Plan: next up is the camera with the Jarvis team.</p>
  </div>

  <details>
    <summary>Technical details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">Status</h3>
      <div class="ocs__table-wrap">
        <table class="ocs__table">
          <thead><tr><th>Part</th><th>Status</th><th>Note</th></tr></thead>
          <tbody>
          <tr><td>RFID tap</td><td><span class="ocs__status-pill ocs__status-pill--good">Working</span></td><td>CrowPi reader</td></tr>
          <tr><td>Flask API</td><td><span class="ocs__status-pill ocs__status-pill--good">Working</span></td><td>Bell schedule, periods, tardy</td></tr>
          <tr><td>Live dashboard</td><td><span class="ocs__status-pill ocs__status-pill--good">Working</span></td><td>Updates every 2 seconds</td></tr>
          <tr><td>Camera check</td><td><span class="ocs__status-pill ocs__status-pill--warn">Next</span></td><td>Jarvis team, target Oct 19</td></tr>
          <tr><td>Second tap reader</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Ordered</span></td><td>Hardware on the way</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="ocs__card">
      <h3 class="ocs__section-title">The dashboard, before and after a tap</h3>
      <div class="ocs__grid ocs__grid--standard cols-2">
        <div class="ocs__grid-cell">
          <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/dashboard-before-tap.png" alt="Dashboard with a demo period running and every student marked Not Yet Arrived">
          <p class="ocs__description">Before: period running, nobody has tapped</p>
        </div>
        <div class="ocs__grid-cell">
          <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/dashboard-after-tap.png" alt="Dashboard two seconds after a tap, with Vibha marked Present">
          <p class="ocs__description">After: one tap, shown as Present</p>
        </div>
      </div>
    </div>

    <div class="ocs__card">
      <h3 class="ocs__section-title">Plan</h3>
      <ul class="ocs__checklist">
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Sep</strong> CrowPi tap reaches OCS</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 5</strong> Shared presence API, bell schedule, live dashboard</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 6</strong> Camera endpoints ready on our side</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 11</strong> Live demo working</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>Oct 16</strong> Camera connection test (Jarvis)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>~Oct 19</strong> Camera face check on every tap</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Second tap reader (ordered)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Cycle 1: minutes within 2 min of a hand log (H2)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Classroom pilot</span></li>
      </ul>
    </div>
    <p class="ocs__description">The step-by-step tap sequence is on the <a href="/capstone/presence-system/technical/">Technical Detail</a> page.</p>
  </details>
</div>
