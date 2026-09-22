---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Iterations
description: A running log of how this project's scope and framing changed, and why, in the design-based research spirit of reflect and redesign.
permalink: /capstone/presence-system/iterations/
year: "2026-2027"
rp_active: iterations
---

{% assign data = site.data.presence_system_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Design-Based Research Log</div>
    <h1 class="rfid-presence-title">Iterations</h1>
    <p class="ocs__description">Design-based research runs in cycles of build, test, reflect, and redesign (see the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>). This page is that reflect-and-redesign step made visible, instead of scattered as "used to be X" notes across the other pages.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">Timeline</h3>
    <div class="rfid-presence-table-wrap">
      <table class="ocs__table rfid-presence-table">
        <thead><tr><th>When</th><th>Change</th><th>Why</th></tr></thead>
        <tbody>
          <tr>
            <td>Phase 1</td>
            <td>Built a single-input, contact-tap RFID prototype: CrowPi reader, Flask backend, dashboard.</td>
            <td>Prove the core read-log-display loop end to end, cheaply, before investing in harder hardware. See <a href="https://github.com/vibha1019/crowpi-attendance/issues/3" target="_blank" rel="noopener">Issue&nbsp;#3</a>.</td>
          </tr>
          <tr>
            <td>2026-09-18</td>
            <td>Reframed the project around a research question instead of a technology. Added hypotheses H1&ndash;H4, a design-based research cycle plan, and a ground-truth evaluation methodology.</td>
            <td>Review feedback pointed out the project had drifted into "an RFID project" rather than a presence system, and was missing key objectives visible in the teacher communication and survey. See the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>.</td>
          </tr>
          <tr>
            <td>2026-09-21</td>
            <td>Split into three parallel input tracks, RFID, QR, and face scan, each with an owner: Vibha (RFID), Ruta (QR), Kush (Camera). Added a shared index issue and moved cross-cutting requirements (attendance reporting, roster import, door monitor) out of any single track.</td>
            <td>RFID alone can't answer RQ4 (which input works best) or test H4 (does combining inputs beat any single one). The three tracks needed to exist and be comparable before Cycle&nbsp;3 could run. See the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a>.</td>
          </tr>
          <tr>
            <td>2026-09-21</td>
            <td>Renamed project files, includes, and the data source from <code>rfid-presence-*</code> to <code>presence-system-*</code> to match the reframing.</td>
            <td>Naming that says RFID everywhere works against the point of the reframe above. Internal CSS class names were left as <code>.rfid-presence-*</code> since renaming those is purely internal and touches no reader-facing content.</td>
          </tr>
          <tr>
            <td>2026-09-21</td>
            <td>Changed every page's URL from <code>/capstone/rfid-presence/...</code> to <code>/capstone/presence-system/...</code>. Every internal link and the links already shared in GitHub issues #3&ndash;#9 were updated to match; no redirect exists for the old URLs.</td>
            <td>File names alone weren't enough, the public URL still said RFID everywhere too. No redirect plugin is installed on this site, so this was a clean break rather than a soft migration, worth knowing if an old link surfaces somewhere outside this project's own issues.</td>
          </tr>
          <tr>
            <td>2026-09-21</td>
            <td>Deleted the Live Demo page and Phases 2 through 4 as standalone pages. Phases 2&ndash;4 were condensed into one table on the Phases page instead.</td>
            <td>Live Demo had no link pointing to it anywhere on the site after an earlier nav change reverted, dead content nobody could reach. Phases 2&ndash;4 described UHF and room-scale hardware work that the Research Proposal explicitly pauses until the research cycles justify it, three detailed pages describing paused work read as active roadmap, which contradicts the proposal a reader might have just read.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">What Didn't Change</h3>
    <ul class="ocs__checklist">
      <li class="done"><span class="ocs__checklist-box"></span><span>The bell-schedule and registration inputs to the presence engine, these were correct regardless of which sensing tool sits on top, and are called out as such in the original review feedback.</span></li>
      <li class="done"><span class="ocs__checklist-box"></span><span>The Phase 1 RFID prototype itself, it's Cycle 0 of the current research design, not discarded work.</span></li>
      <li class="done"><span class="ocs__checklist-box"></span><span>What each remaining page actually covers. Overview, Project Summary, Technical Detail, Funding, and Phase 1 kept their scope, only their naming and URLs changed, not their content.</span></li>
    </ul>
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
