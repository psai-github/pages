// ToolchainApi.js
// Spring endpoints for Toolchain Trail one-time device pairing (blueprint-spring: mvc/toolchain).
// The signed-in page starts a station and gets a single-use pairing code; the
// student's local agent (scripts/toolchain_agent.py) exchanges it for a scoped
// token and sends check results; this page polls the session for the verdict.
import { javaURI, fetchOptions } from '@assets/js/api/config.js';

const BASE_URL = `${javaURI}/api/toolchain`;

async function readError(response, fallback) {
  try {
    const body = await response.json();
    if (typeof body?.error === 'string') return body.error;
  } catch (_) {
    // not JSON; use the fallback
  }
  return `${fallback} (HTTP ${response.status})`;
}

/**
 * @param {string} stationId
 * @returns {Promise<{sessionId: string, stationId: string, pairingCode: string, expiresAt: string}>}
 */
export async function startToolchainSession(stationId) {
  const response = await fetch(`${BASE_URL}/sessions`, {
    ...fetchOptions,
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify({ stationId }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Starting the station failed'));
  }
  const body = await response.json();
  if (typeof body?.sessionId !== 'string' || typeof body?.pairingCode !== 'string') {
    throw new Error('Starting the station failed (unexpected response)');
  }
  return body;
}

/**
 * @param {string} sessionId
 * @returns {Promise<{sessionId: string, stationId: string,
 *   status: 'WAITING_FOR_AGENT'|'PAIRED'|'VERIFIED'|'FAILED'|'EXPIRED',
 *   checks: {id: string, label: string, passed: boolean, detail: string}[]}>}
 */
export async function getToolchainSession(sessionId) {
  const response = await fetch(`${BASE_URL}/sessions/${encodeURIComponent(sessionId)}`, {
    ...fetchOptions,
    method: 'GET',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Checking the station failed'));
  }
  return response.json();
}

/** The command a student runs for their OS, from inside their pages repository. */
export function agentCommands(os) {
  const local = javaURI.startsWith('http://localhost') ? ` --server ${javaURI}` : '';
  if (os === 'windows') {
    return [
      { label: 'Ubuntu (WSL) terminal', command: `python3 scripts/toolchain_agent.py${local}` },
      { label: 'or PowerShell', command: `py scripts\\toolchain_agent.py${local}` },
    ];
  }
  return [{ label: 'Terminal', command: `python3 scripts/toolchain_agent.py${local}` }];
}
