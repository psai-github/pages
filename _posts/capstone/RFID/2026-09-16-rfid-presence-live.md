---
microblog: true
toc: false
layout: post
title: RFID Presence, Live Demo
description: The live attendance dashboard and admin panel, embedded directly from the running backend.
permalink: /capstone/rfid-presence/live/
year: "2026-2027"
rp_active: live
---

{% assign data = site.data.rfid_presence_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <a href="/capstone/rfid-presence/phases/" class="ocs__phase-crumb">&larr; All Phases</a>

  <div class="rfid-presence-header">
    <div class="ocs__badge">Phase 1, Live</div>
    <h1 class="rfid-presence-title">Live Attendance Dashboard</h1>
    <p class="ocs__description">The actual running system, not a screenshot. Every tap on the CrowPi shows up here in real time.</p>
    <div class="ocs__status">Live, Local Network</div>
  </div>

  {% include rfid-presence-nav.html %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">Dashboard</h3>
    <div class="rfid-presence-live-frame">
      <iframe src="http://192.168.1.242:5050" title="Live attendance dashboard" loading="lazy"></iframe>
    </div>
    <div class="ocs__callout">
      This embeds the backend directly, so it only loads while the backend is running on the local network the viewer is on. It is not reachable from the public internet. If the frame above is blank, the backend is either offline or you are viewing this from a different network than the one it is running on.
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Admin Panel</h3>
    <div class="rfid-presence-live-frame">
      <iframe src="http://192.168.1.242:5050/admin" title="Live admin panel" loading="lazy"></iframe>
    </div>
    <p class="rfid-presence-about">Newly scanned tags that are not yet registered to a student show up here to be named, live, as they are tapped.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__team">
      <span class="ocs__team-label">Project Team</span>
      <span class="ocs__team-name">{{ data.Team | join: ", " }}</span>
    </div>
    {% if data.Repo %}
    <a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>
    {% endif %}
  </div>
</div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
