import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(
  new URL('../assets/js/pages/dashboard/preferences.js', import.meta.url),
  'utf8',
);

const saved = new Map();
const applied = [];

globalThis.localStorage = {
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, value),
  removeItem: (key) => saved.delete(key),
};

globalThis.window = {
  SitePreferences: {
    applyPreferences: (preferences) => applied.push(preferences),
  },
};

globalThis.document = {
  getElementById: () => null,
};

const module = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`);
const {
  FormManager,
  PreferencesAPI,
  PreferencesConfig,
  PreferencesStore,
} = module;

const ocean = {
  bg: '#0c1929',
  text: '#e0f2fe',
  font: "'Open Sans', Arial, sans-serif",
  size: 15,
  accent: '#06b6d4',
  selectionColor: '#3b82f6',
  buttonStyle: 'rounded',
  language: '',
  ttsVoice: '',
  ttsRate: 1,
  ttsPitch: 1,
  ttsVolume: 1,
  customThemes: {},
};

function reset() {
  saved.clear();
  applied.length = 0;
  PreferencesStore.cachedPrefs = null;
  PreferencesAPI.isLoggedIn = false;
  PreferencesAPI.checkLogin = async () => false;
  FormManager.set = () => {};
}

test('guest preference changes are written to durable browser storage', async () => {
  reset();

  await PreferencesStore.set(ocean);

  assert.deepEqual(
    JSON.parse(saved.get(PreferencesConfig.LOCAL_STORAGE_KEY)),
    ocean,
  );
  assert.deepEqual(applied.at(-1), ocean);
});

test('a refresh restores and reapplies the saved guest preference', async () => {
  reset();
  saved.set(PreferencesConfig.LOCAL_STORAGE_KEY, JSON.stringify(ocean));

  const restored = await PreferencesStore.get();

  assert.deepEqual(restored, ocean);
  assert.deepEqual(PreferencesStore.cachedPrefs, ocean);
  assert.deepEqual(applied.at(-1), ocean);
});

test('corrupt stored preferences fail safely instead of applying a broken theme', async () => {
  reset();
  saved.set(PreferencesConfig.LOCAL_STORAGE_KEY, '{not valid json');
  const originalError = console.error;
  console.error = () => {};

  try {
    const restored = await PreferencesStore.get();

    assert.equal(restored, null);
    assert.equal(PreferencesStore.cachedPrefs, null);
    assert.equal(applied.length, 0);
  } finally {
    console.error = originalError;
  }
});
