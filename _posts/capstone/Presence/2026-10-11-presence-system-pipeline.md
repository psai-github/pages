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
    <p class="ocs__description">A student taps their card. About two seconds later the teacher's dashboard shows them as arrived.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="pp-progress">
    <div class="pp-progress-item">
      <span class="rfid-presence-pill rfid-presence-pill-good">Working</span>
      <div class="pp-progress-name">RFID tap</div>
      <div class="pp-progress-note">CrowPi reader</div>
    </div>
    <div class="pp-progress-item">
      <span class="rfid-presence-pill rfid-presence-pill-good">Working</span>
      <div class="pp-progress-name">Flask API</div>
      <div class="pp-progress-note">Bell schedule, periods, tardy</div>
    </div>
    <div class="pp-progress-item">
      <span class="rfid-presence-pill rfid-presence-pill-good">Working</span>
      <div class="pp-progress-name">Live dashboard</div>
      <div class="pp-progress-note">Updates every 2 seconds</div>
    </div>
    <div class="pp-progress-item">
      <span class="rfid-presence-pill rfid-presence-pill-warn">Next</span>
      <div class="pp-progress-name">Camera check</div>
      <div class="pp-progress-note">Jarvis team, target Oct 19</div>
    </div>
    <div class="pp-progress-item">
      <span class="rfid-presence-pill rfid-presence-pill-neutral">Ordered</span>
      <div class="pp-progress-name">Second tap reader</div>
      <div class="pp-progress-note">Hardware on the way</div>
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Architecture</h3>
    <pre class="mermaid">%%{init: {"flowchart": {"htmlLabels": false}}}%%
flowchart LR
    T(["Student taps card"]) --> C["CrowPi
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
    <p class="pp-caption">Solid lines run today. The dashed camera path is next: it will confirm that the person tapping owns the card.</p>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">One tap, step by step</h3>
    <pre class="mermaid">sequenceDiagram
    participant S as Student
    participant C as CrowPi
    participant F as Flask
    participant DB as Database
    participant D as Dashboard
    S->>C: Taps card
    C->>F: POST tap (card ID, time)
    Note over F: presence-event handler
    F->>DB: Save as ENTER in this period
    F-->>C: accepted
    loop every 2 seconds
        D->>F: GET classroom status
        F->>DB: Read this period's taps
        F-->>D: PRESENT or TARDY
    end
</pre>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">The dashboard, before and after a tap</h3>
    <div class="pp-shots">
      <figure class="pp-shot">
        <img src="{{ site.baseurl }}/images/presence-system/dashboard-before-tap.png" alt="Dashboard with a demo period running and every student marked Not Yet Arrived">
        <figcaption>Before: period running, nobody has tapped</figcaption>
      </figure>
      <figure class="pp-shot">
        <img src="{{ site.baseurl }}/images/presence-system/dashboard-after-tap.png" alt="Dashboard two seconds after a tap, with Vibha marked Present">
        <figcaption>After: one tap, shown as Present</figcaption>
      </figure>
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">The tap station</h3>
    <!-- Replace this placeholder with:
         <figure class="pp-shot"><img src="{{ site.baseurl }}/images/presence-system/crowpi.jpg" alt="CrowPi tap station"><figcaption>CrowPi tap station</figcaption></figure> -->
    <div class="pp-photo-placeholder">Photo of the CrowPi tap station goes here</div>
  </div>
</div>
