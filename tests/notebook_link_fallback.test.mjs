import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activateNotebookFallback,
  githubNotebookUrlFrom,
  gistFallbackNotice,
  isNotebookFallbackActive,
  readNotebookFallbackUrl,
} from '../assets/js/notebook-link-fallback.js';

function fallbackForm(url = '') {
  const notice = { textContent: '' };
  const input = { value: url, required: false };
  const block = {
    hidden: true,
    querySelector: selector => (selector === '[data-notebook-fallback-notice]' ? notice : input),
  };
  const form = { querySelector: selector => (selector === '[data-notebook-fallback]' ? block : input) };
  return { form, block, notice, input };
}

test('accepts GitHub notebook links and normalizes raw links to blob links', () => {
  const blob = 'https://github.com/user/repo/blob/main/dir/lesson.ipynb';
  assert.equal(githubNotebookUrlFrom(` ${blob} `), blob);
  assert.equal(githubNotebookUrlFrom(`${blob}?plain=1`), blob);
  assert.equal(githubNotebookUrlFrom('https://raw.githubusercontent.com/user/repo/main/dir/lesson.ipynb'), blob);
});

test('rejects links that are not GitHub notebook files', () => {
  for (const url of ['', 'https://github.com/user/repo', 'https://github.com/user/repo/blob/main/Main.java',
    'https://gist.github.com/user/abc123', 'https://example.com/lesson.ipynb']) {
    assert.equal(githubNotebookUrlFrom(url), null, url);
  }
});

test('switching to the fallback reveals the field and says the Gist failed and why', () => {
  const { form, block, notice, input } = fallbackForm();
  assert.equal(isNotebookFallbackActive(form), false);
  activateNotebookFallback(form, new Error('GitHub could not be reached. Try again later.'));
  assert.equal(isNotebookFallbackActive(form), true);
  assert.equal(block.hidden, false);
  assert.equal(input.required, true);
  assert.equal(notice.textContent, gistFallbackNotice(new Error('GitHub could not be reached. Try again later.')));
  assert.match(notice.textContent, /Gist export failed \(GitHub could not be reached/);
});

test('reading the fallback link fails fast on an invalid link', () => {
  assert.throws(() => readNotebookFallbackUrl(fallbackForm('not a link').form), /GitHub link to an \.ipynb/);
  assert.equal(readNotebookFallbackUrl(fallbackForm('https://github.com/u/r/blob/main/a.ipynb').form),
    'https://github.com/u/r/blob/main/a.ipynb');
});
