import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { selectedDocuments, readState, writeState, groupedMatches, highlightedParts } from '../js/model.js';

const require = createRequire(import.meta.url);
const lunr = require('../../../../assets/js/vendor/lunr.min.js');
const documents = [
  { url: '/java/', title: 'Arrays', content: 'Binary algorithm', categories: ['java', 'algorithms'] },
  { url: '/python/', title: 'Arrays', content: 'Binary algorithm', categories: ['python', 'algorithms'] },
  { url: '/objects/', title: 'Objects', content: 'Inheritance', categories: ['java'] },
];

const topics = ['java', 'python'];

test('boxes in one filter widen the results and the two filters narrow each other', () => {
  assert.equal(selectedDocuments(documents, ['algorithms'], null, topics).length, 2);
  assert.deepEqual(selectedDocuments(documents, ['java', 'python'], null, topics).map((doc) => doc.url),
    ['/java/', '/python/', '/objects/']);
  assert.deepEqual(selectedDocuments(documents, ['java', 'algorithms'], null, topics).map((doc) => doc.url), ['/java/']);
  assert.deepEqual(selectedDocuments(documents, ['java', 'python', 'algorithms'], null, topics).map((doc) => doc.url),
    ['/java/', '/python/']);
  assert.equal(selectedDocuments(documents, [], null, topics).length, 3);
});

test('two Categories Filter boxes are alternatives too', () => {
  const docs = [
    { url: '/a/', categories: ['java', 'arrays'] },
    { url: '/b/', categories: ['java', 'loops'] },
    { url: '/c/', categories: ['java', 'classes'] },
  ];
  assert.deepEqual(selectedDocuments(docs, ['arrays', 'loops'], null, topics).map((doc) => doc.url), ['/a/', '/b/']);
});

test('full-text matches cannot escape the selected categories', () => {
  const index = lunr(function () {
    this.ref('url');
    this.field('title');
    this.field('content');
    documents.forEach((doc) => this.add(doc));
  });
  const ids = index.search('binary').map((result) => result.ref);
  assert.equal(ids.length, 2);
  assert.deepEqual(selectedDocuments(documents, ['java'], ids, topics).map((doc) => doc.url), ['/java/']);
  assert.equal(selectedDocuments(documents, ['java'], index.search('missing').map((result) => result.ref)).length, 0);
});

test('category and query context round trips without interpreting Lunr syntax', () => {
  const state = readState('?category=Java&category=Algorithms&category=Java&q=a%3Ab%20%22x%22&view=list');
  assert.deepEqual(state.categories, ['java', 'algorithms']);
  assert.deepEqual(readState(`?${writeState(state)}`), state);
  assert.equal(readState('?view=invalid').view, 'cards');
});

test('title cards precede body matches and both respect all category filters', () => {
  const docs = [
    { url: '/title/', title: 'Random Algorithm', content: 'A random algorithm is correct.', categories: ['java', 'algorithms'] },
    { url: '/body/', title: 'Verification', content: 'A random algorithm is correct.', categories: ['java', 'algorithms'] },
    { url: '/other/', title: 'Random Algorithm', content: 'A random algorithm is correct.', categories: ['python', 'algorithms'] },
  ];
  const index = lunr(function () {
    this.ref('url');
    this.field('title');
    this.field('content');
    this.metadataWhitelist = ['position'];
    docs.forEach((doc) => this.add(doc));
  });
  const groups = groupedMatches(docs, ['java', 'algorithms'], index.search('algorithm'), topics);
  assert.deepEqual(groups.title.map((match) => match.document.url), ['/title/']);
  assert.deepEqual(groups.body.map((match) => match.document.url), ['/body/']);
  assert.deepEqual(highlightedParts(groups.title[0].document.title, groups.title[0].positions)
    .filter((part) => part.highlighted).map((part) => part.text), ['Algorithm']);
  assert.equal(groups.body[0].field, 'content');
  assert.equal(highlightedParts(groups.body[0].document.content, groups.body[0].positions)
    .find((part) => part.highlighted).text, 'algorithm');
});

test('excerpts center on matches and merge overlapping ranges without losing text', () => {
  const text = `${'prefix '.repeat(30)}algorithm${' suffix'.repeat(30)}`;
  const parts = highlightedParts(text, [[210, 9], [210, 9], [215, 4]], true);
  assert.equal(parts[0].text, '…');
  assert.equal(parts.at(-1).text, '…');
  assert.equal(parts.filter((part) => part.highlighted).map((part) => part.text).join(''), 'algorithm');
  assert.ok(parts.map((part) => part.text).join('').length < text.length);
  assert.equal(highlightedParts('<img src=x onerror=alert(1)>', [[0, 4]]).map((part) => part.text).join(''),
    '<img src=x onerror=alert(1)>');
});
