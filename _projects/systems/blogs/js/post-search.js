// A search bar for a blogs catalog. A page turns it on with post_search: true,
// the way post_filter narrows the catalog; _includes/blog-catalog.html draws
// the bar and calls createPostSearch. Typing hides the cards whose title and
// description don't contain every word typed, and the catalog keeps its order.
// The query stays in the address as ?q=, the parameter Topics uses, so a
// search can be reloaded or shared.
// Test: node --test tests/post_search.test.mjs

// Lowercase and without accents, so "pokemon" finds "Pokémon".
function normalize(text) {
  return String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// A card matches when each word of the query is somewhere in its text.
export function matchesQuery(text, query) {
  const haystack = normalize(text);
  return normalize(query).split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

export function readQuery(search) {
  return new URLSearchParams(search).get('q') || '';
}

// Keeps the page's other parameters; a blank query removes q.
export function writeQuery(search, query) {
  const params = new URLSearchParams(search);
  if (query.trim()) params.set('q', query);
  else params.delete('q');
  const text = params.toString();
  return text ? `?${text}` : '';
}

// "3 documents", "1 of 3 documents", or why nothing is showing.
export function statusText(shown, total, query) {
  const documents = count => `${count} ${count === 1 ? 'document' : 'documents'}`;
  if (!query.trim()) return documents(total);
  if (!shown) return `No documents match "${query.trim()}".`;
  return `${shown} of ${documents(total)}`;
}

// input: the search field; clear: the Clear Search button; status: the line
// that counts the results; cards: the catalog's <li>s, each with its title and
// description in data-post-search-text. The field and button arrive disabled,
// so they only work once this has run.
export function createPostSearch({ input, clear, status, cards }, environment = window) {
  function render() {
    const query = input.value;
    let shown = 0;
    cards.forEach(card => {
      card.hidden = !matchesQuery(card.dataset.postSearchText, query);
      if (!card.hidden) shown += 1;
    });
    clear.disabled = !query;
    status.textContent = statusText(shown, cards.length, query);
  }

  function update() {
    const { pathname, search, hash } = environment.location;
    environment.history.replaceState(null, '', `${pathname}${writeQuery(search, input.value)}${hash}`);
    render();
  }

  input.value = readQuery(environment.location.search);
  input.disabled = false;
  render();
  input.addEventListener('input', update);
  clear.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
  });
}
