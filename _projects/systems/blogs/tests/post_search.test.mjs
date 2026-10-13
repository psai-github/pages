import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesQuery, readQuery, writeQuery, statusText, createPostSearch } from '../js/post-search.js';

const characters = 'Characters - Players and NPCs Learn object literals, constructors, inheritance, and animation';

test('every word of the query must appear, in any order or case', () => {
  assert.equal(matchesQuery(characters, 'npc'), true);
  assert.equal(matchesQuery(characters, 'PLAYERS inheritance'), true);
  assert.equal(matchesQuery(characters, 'inheritance players'), true);
  assert.equal(matchesQuery(characters, 'players parallax'), false);
});

test('a blank query matches every card', () => {
  assert.equal(matchesQuery('Backgrounds', ''), true);
  assert.equal(matchesQuery('Backgrounds', '   '), true);
  assert.equal(matchesQuery('', ''), true);
});

test('accents are ignored on both sides', () => {
  assert.equal(matchesQuery('Pokémon sprites', 'pokemon'), true);
  assert.equal(matchesQuery('Pokemon sprites', 'POKÉMON'), true);
});

test('the query round trips through ?q= and keeps the page\'s other parameters', () => {
  assert.equal(readQuery('?q=npc%20players'), 'npc players');
  assert.equal(readQuery(''), '');
  assert.equal(writeQuery('', 'npc players'), '?q=npc+players');
  assert.equal(readQuery(writeQuery('?post=%2Fa%2F', 'a&b=c')), 'a&b=c');
  assert.equal(writeQuery('?post=%2Fa%2F&q=old', ''), '?post=%2Fa%2F');
  assert.equal(writeQuery('?q=old', '   '), '');
});

test('the status line counts the cards that are showing', () => {
  assert.equal(statusText(3, 3, ''), '3 documents');
  assert.equal(statusText(1, 1, '  '), '1 document');
  assert.equal(statusText(1, 3, 'npc'), '1 of 3 documents');
  assert.equal(statusText(0, 3, ' xyz '), 'No documents match "xyz".');
});

// Plain objects standing in for the field, button, status line, cards and window.
function element(fields = {}) {
  return {
    hidden: false,
    disabled: true,
    value: '',
    textContent: '',
    dataset: {},
    focused: false,
    listeners: {},
    addEventListener(name, handler) { this.listeners[name] = handler; },
    focus() { this.focused = true; },
    ...fields,
  };
}

function fixture(search = '') {
  const input = element();
  const clear = element();
  const status = element();
  const cards = [
    ['Backgrounds', 'An introduction to backgrounds and parallax scrolling in the adventure game.'],
    ['Characters - Players and NPCs', 'Learn object literals, constructors, inheritance, and animation.'],
    ['JavaScript Variables and HTML DOM Challenge', 'Perform variables and HTML DOM Challenge using this notebook.'],
  ].map(([title, description]) => element({ dataset: { postSearchText: `${title} ${description}` } }));
  const addresses = [];
  const environment = {
    location: { pathname: '/gamebuilder/docs/', search, hash: '' },
    history: { replaceState: (state, title, url) => addresses.push(url) },
  };
  const type = (value) => {
    input.value = value;
    input.listeners.input();
  };
  return { input, clear, status, cards, environment, addresses, type, click: () => clear.listeners.click() };
}

const shown = (cards) => cards.filter((card) => !card.hidden).length;

test('the bar starts enabled with every card showing', () => {
  const page = fixture();
  createPostSearch(page, page.environment);
  assert.equal(page.input.disabled, false);
  assert.equal(page.clear.disabled, true);
  assert.equal(shown(page.cards), 3);
  assert.equal(page.status.textContent, '3 documents');
  assert.deepEqual(page.addresses, []);
});

test('typing hides the cards that do not match and keeps the query in the address', () => {
  const page = fixture();
  createPostSearch(page, page.environment);
  page.type('npc');
  assert.deepEqual(page.cards.map((card) => card.hidden), [true, false, true]);
  assert.equal(page.clear.disabled, false);
  assert.equal(page.status.textContent, '1 of 3 documents');
  assert.equal(page.addresses.at(-1), '/gamebuilder/docs/?q=npc');

  page.type('dragons');
  assert.equal(shown(page.cards), 0);
  assert.equal(page.status.textContent, 'No documents match "dragons".');
});

test('Clear Search shows every card again, drops ?q= and returns focus to the field', () => {
  const page = fixture();
  createPostSearch(page, page.environment);
  page.type('variables');
  page.click();
  assert.equal(page.input.value, '');
  assert.equal(shown(page.cards), 3);
  assert.equal(page.clear.disabled, true);
  assert.equal(page.status.textContent, '3 documents');
  assert.equal(page.addresses.at(-1), '/gamebuilder/docs/');
  assert.equal(page.input.focused, true);
});

test('an address with ?q= opens with that search applied', () => {
  const page = fixture('?q=parallax');
  createPostSearch(page, page.environment);
  assert.equal(page.input.value, 'parallax');
  assert.deepEqual(page.cards.map((card) => card.hidden), [false, true, true]);
  assert.equal(page.clear.disabled, false);
  assert.equal(page.status.textContent, '1 of 3 documents');
});
