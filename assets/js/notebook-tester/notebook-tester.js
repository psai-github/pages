// Notebook Tester: talks to scripts/notebook_test_server.py (started by ./make_test)
// to convert one notebook on demand and link to the rebuilt page.

const root = document.querySelector('.notebook-tester');
const serverUrl = `http://${window.location.hostname}:${root.dataset.serverPort}`;
const baseUrl = root.dataset.baseUrl || '';

const elements = {
  status: document.getElementById('notebook-tester-server-status'),
  form: document.getElementById('notebook-tester-form'),
  input: document.getElementById('notebook-tester-path'),
  submit: document.getElementById('notebook-tester-submit'),
  options: document.getElementById('notebook-tester-options'),
  result: document.getElementById('notebook-tester-result'),
  log: document.getElementById('notebook-tester-log'),
  history: document.getElementById('notebook-tester-history'),
};

function setServerStatus(online, message) {
  elements.status.textContent = message;
  elements.status.classList.toggle('is-online', online);
  elements.status.classList.toggle('is-offline', !online);
  elements.submit.disabled = !online;
}

function showResult(success, message, permalink) {
  elements.result.hidden = false;
  elements.result.classList.toggle('is-success', success);
  elements.result.classList.toggle('is-error', !success);
  elements.result.textContent = message;
  if (permalink) {
    const link = document.createElement('a');
    link.href = `${baseUrl}${permalink}`;
    link.textContent = ` Open ${permalink}`;
    elements.result.append(link);
  }
}

function showLog(text) {
  elements.log.hidden = !text;
  elements.log.textContent = text || '';
}

function addHistoryEntry(path, permalink) {
  const item = document.createElement('li');
  if (permalink) {
    const link = document.createElement('a');
    link.href = `${baseUrl}${permalink}`;
    link.textContent = path;
    item.append(link);
  } else {
    item.textContent = path;
  }
  elements.history.prepend(item);
}

async function loadNotebookOptions() {
  try {
    const response = await fetch(`${serverUrl}/api/notebooks`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { notebooks } = await response.json();
    elements.options.replaceChildren(
      ...notebooks.map((path) => Object.assign(document.createElement('option'), { value: path }))
    );
    setServerStatus(true, `Compile server online (${notebooks.length} notebooks available).`);
  } catch (error) {
    // Expected on the deployed site, or when ./make_test is not running.
    setServerStatus(false, `Compile server not reachable at ${serverUrl}. Start it locally with ./make_test.`);
  }
}

async function compileNotebook(path) {
  elements.submit.disabled = true;
  elements.submit.textContent = 'Compiling…';
  showResult(true, `Converting ${path} and rebuilding the site. This can take a minute…`);
  showLog('');

  try {
    const response = await fetch(`${serverUrl}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    const data = await response.json();
    if (data.ok) {
      showResult(true, `Compiled ${data.path}.`, data.permalink);
      addHistoryEntry(data.path, data.permalink);
    } else {
      showResult(false, data.error || `Compile failed (HTTP ${response.status}).`);
    }
    showLog(data.log);
  } catch (error) {
    showResult(false, `Could not reach the compile server: ${error.message}`);
  } finally {
    elements.submit.disabled = false;
    elements.submit.textContent = 'Compile';
  }
}

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const path = elements.input.value.trim();
  if (path) compileNotebook(path);
});

loadNotebookOptions();
