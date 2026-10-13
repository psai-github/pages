require "jekyll"

ROOT = File.expand_path("../../../..", __dir__)
PROJECT = File.expand_path("..", __dir__)

# Renders {% include name.html %} from _includes/, as Jekyll does: the layout
# includes blog-catalog.html, which includes post_list_image_card.html.
class CatalogInclude < Liquid::Tag
  def initialize(tag_name, markup, tokens)
    super
    @file = markup.strip
  end

  def render(context)
    Liquid::Template.parse(File.read(File.join(PROJECT, "_includes", @file)))
      .render!(context)
  end
end

Liquid::Template.register_tag("include", CatalogInclude)
Liquid::Template.register_filter(Jekyll::Filters)

site = Jekyll::Site.new(Jekyll.configuration(
  "source" => ROOT,
  "baseurl" => "/preview",
  "plugins" => [],
  "quiet" => true
))
layout = File.read(File.join(PROJECT, "layouts/blogs.html")).sub(/\A---\n.*?\n---\n/m, "")
template = Liquid::Template.parse(layout)

def post(id, date, fields = {})
  {
    "id" => id,
    "url" => "/#{id}/",
    "title" => id,
    "description" => "Description for #{id}",
    "date" => Time.parse(date)
  }.merge(fields)
end

posts = [
  post("older-doc", "2026-02-16", "game_docs" => true),
  post("newer-doc", "2026-02-17", "game_docs" => true),
  post("sticky-doc", "2026-02-15", "game_docs" => true, "sticky_rank" => 1),
  post("hidden-doc", "2026-02-18", "game_docs" => true, "hide" => true),
  post("unrelated", "2026-02-19"),
  post("false-flag", "2026-02-20", "game_docs" => false),
  post("string-flag", "2026-02-21", "game_docs" => "true"),
  post("course-a", "2026-02-14", "game_docs" => true, "canonical_id" => "shared"),
  post("course-b", "2026-02-13", "game_docs" => true, "canonical_id" => "shared"),
  post("lesson_content", "2026-02-12", "game_docs" => true)
]

render = lambda do |page, entries|
  template.render!(
    { "site" => { "posts" => entries }, "page" => page, "content" => "Catalog introduction" },
    registers: { site: site }
  )
end

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

filtered = render.call({ "post_filter" => "game_docs" }, posts)
links = filtered.scan(/class="post-link" href="([^"]+)"/).flatten
assert(links == %w[/preview/sticky-doc/ /preview/newer-doc/ /preview/older-doc/ /preview/course-a/],
       "Catalog must filter boolean flags, honor hide, deduplicate, preserve ordering and baseurl; got #{links.inspect}")
assert(filtered.include?("Description for newer-doc"), "Cards must include descriptions")
assert(filtered.include?("Feb 17, 2026"), "Cards must include formatted dates")
assert(filtered.include?("Catalog introduction"), "Catalog must retain its page content")

unfiltered = render.call({}, posts)
assert(unfiltered.include?('/preview/unrelated/'), "Ordinary blogs must remain unfiltered")
assert(!unfiltered.include?('/preview/hidden-doc/'), "Ordinary blogs must still exclude hidden posts")
assert(unfiltered.scan('class="post-link"').size == 7, "Ordinary blogs must retain distinct posts")

empty = render.call({ "post_filter" => "game_docs" }, [post("unrelated", "2026-02-19")])
assert(empty.include?("No documentation is available yet."), "Empty filtered catalog must explain its state")
assert(!empty.include?('class="post-link"'), "Empty filtered catalog must not show unrelated posts")

# post_search: true adds a search bar over the same cards, built from OCS components.
assert(!filtered.include?("post-search") && !unfiltered.include?("post-search"),
       "Catalogs without post_search must not change")
assert(filtered.scan("<li>").size == 4, "Cards without post_search must stay plain list items")

search_page = { "post_filter" => "game_docs", "post_search" => true, "title" => "GameBuilder Docs" }
quoted = post("quoted-doc", "2026-02-10", "game_docs" => true,
              "title" => %(Say "hi"), "description" => "<em>Sprites</em> & sounds")
searchable = render.call(search_page, posts + [quoted])
bar = searchable[%r{<p [^>]*data-post-search>.*?</p>}m]
assert(bar, "post_search must draw a search bar")
assert(bar.include?('<p class="ocs__split" role="search" aria-label="Search GameBuilder Docs"'),
       "The bar must be an OCS split and a labelled search landmark")
assert(bar.include?('<input class="ocs__input" type="search" size="1" placeholder="Search titles &amp; descriptions"'),
       "The field must be an OCS search input whose width comes from the split, not its size")
assert(bar.include?('aria-label="Search titles and descriptions"'), "The field must have an accessible name")
assert(bar.include?('<button class="ocs__btn medium accent" type="button"') && bar.include?("Clear Search"),
       "Clear Search must be an OCS button as tall as the field")
assert(bar.scan(" disabled").size == 2, "The field and button must stay disabled until the script runs")
assert(bar[%r{<span class="ocs__links">\s*<button .*?</button>\s*<span role="status" aria-live="polite" data-post-search-status></span>\s*</span>}m],
       "Clear Search and the announced result count must share one OCS links row")
assert(!searchable.include?("style="), "The search bar must not add inline styles")
texts = searchable.scan(/<li data-post-search-card data-post-search-text="([^"]*)">/).flatten
assert(texts.size == 5, "Every card must carry its search text; got #{texts.size}")
assert(texts.include?("newer-doc Description for newer-doc"), "Search text must be the title and description")
assert(texts.include?("Say &quot;hi&quot; Sprites &amp; sounds"), "Search text must be plain and escaped; got #{texts.inspect}")
assert(searchable.scan(/class="post-link" href="([^"]+)"/).flatten == links + ["/preview/quoted-doc/"],
       "Searching must keep the catalog's cards and order")
assert(searchable.include?(%(from "/preview/assets/js/blogs/post-search.js";)),
       "The search script must load under baseurl, encoded with jsonify")

empty_search = render.call(search_page, [post("unrelated", "2026-02-19")])
assert(!empty_search.include?("post-search"), "An empty catalog must not show a search bar")
assert(empty_search.include?("No documentation is available yet."), "An empty catalog keeps its message")

puts "PASS: blog catalog filtering, ordering, cards, deduplication, baseurl, empty state and search bar"
