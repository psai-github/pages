/**
 * notebook-link-fallback.js — keeps code submission working when Gist export fails.
 *
 * A failed Gist export used to stop the submit → AI grade chain. Instead, the code
 * form reveals a field for a GitHub .ipynb link and submits that under the same
 * "code" type; the backend grades it by URL shape.
 *
 * The form's markup owns a hidden `[data-notebook-fallback]` block containing
 * `[data-notebook-fallback-notice]` and `[data-notebook-fallback-url]`.
 */

const GITHUB_BLOB_NOTEBOOK = /^https?:\/\/github\.com\/[^/]+\/[^/#?]+\/blob\/[^/#?]+\/.+\.ipynb$/i;
const GITHUB_RAW_NOTEBOOK = /^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+\.ipynb)$/i;

/**
 * Normalize a pasted GitHub notebook link to its github.com/.../blob/... form,
 * which is what the backend grader fetches. Returns null for anything else.
 *
 * @param {string} text
 * @returns {string|null}
 */
export function githubNotebookUrlFrom(text) {
  const url = String(text || '').trim().replace(/[?#].*$/, '');
  if (GITHUB_BLOB_NOTEBOOK.test(url)) return url;
  const raw = url.match(GITHUB_RAW_NOTEBOOK);
  if (raw) return `https://github.com/${raw[1]}/${raw[2]}/blob/${raw[3]}/${raw[4]}`;
  return null;
}

/**
 * The message shown when the form switches over, including why the Gist failed
 * so testers can confirm which failure triggered it.
 *
 * @param {Error} error  what exportToGist threw
 * @returns {string}
 */
export function gistFallbackNotice(error) {
  const reason = error?.message || 'unknown error';
  return `Gist export failed (${reason}), so this submission switched to a notebook link. `
    + 'Paste a GitHub link to your .ipynb file below and submit again.';
}

/** Whether the form has already switched to notebook-link submission. */
export function isNotebookFallbackActive(form) {
  const block = form?.querySelector('[data-notebook-fallback]');
  return Boolean(block && !block.hidden);
}

/**
 * Switch the form to notebook-link submission and explain why.
 *
 * @param {HTMLFormElement} form
 * @param {Error} error  what exportToGist threw
 */
export function activateNotebookFallback(form, error) {
  const block = form?.querySelector('[data-notebook-fallback]');
  if (!block) throw new Error('Code form is missing its [data-notebook-fallback] block');
  block.querySelector('[data-notebook-fallback-notice]').textContent = gistFallbackNotice(error);
  const input = block.querySelector('[data-notebook-fallback-url]');
  input.required = true;
  block.hidden = false;
  input.focus?.();
}

/**
 * Read and validate the notebook link from an active fallback form.
 *
 * @param {HTMLFormElement} form
 * @returns {string} normalized github.com blob URL
 */
export function readNotebookFallbackUrl(form) {
  const input = form.querySelector('[data-notebook-fallback-url]');
  const url = githubNotebookUrlFrom(input?.value);
  if (!url) {
    throw new Error('Enter a GitHub link to an .ipynb file, like https://github.com/user/repo/blob/main/lesson.ipynb');
  }
  return url;
}
