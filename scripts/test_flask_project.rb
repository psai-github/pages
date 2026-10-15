require "json"
require "yaml"
require "date"
require "tmpdir"
require "jekyll"
require "nokogiri"
require_relative "publish_project"

ROOT = File.expand_path("..", __dir__)
PROJECT = File.join(ROOT, "_projects/lessons/flask")

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

def frontmatter(text)
  YAML.safe_load(text.split(/^---\s*$/, 3)[1], permitted_classes: [Date], aliases: true)
end

documents = Dir[File.join(PROJECT, "docs/*.md")].map do |path|
  [path, frontmatter(File.read(path))]
end
documents.concat(Dir[File.join(PROJECT, "notebooks/*.ipynb")].map do |path|
  notebook = JSON.parse(File.read(path))
  [path, frontmatter(notebook.fetch("cells").first.fetch("source").join)]
end)
assert(documents.size >= 25, "The existing Flask collection is retained")
documents.each do |path, data|
  assert(Array(data["categories"]).map(&:downcase).include?("flask"), "Flask category: #{path}")
  assert(data["permalink"], "Stable permalink: #{path}")
  source = if path.end_with?(".ipynb")
             JSON.parse(File.read(path)).fetch("cells").map { |cell| cell.fetch("source").join }.join("\n")
           else
             File.read(path)
           end
  assert(!source.match?(/postman/i), "Flask lessons consistently teach REST Client: #{path}")
end
routes = documents.map { |_, data| data.fetch("permalink").sub(%r{/$}, "") }
assert(routes.uniq.size == routes.size, "No duplicate Flask permalinks")
%w[/python/flask /python/flask/crash-course /python/flask/anatomy /python/flask/api /python/flask/jinja_ui /flask-overview /flask--api /flask-debug-walk].each do |route|
  assert(routes.include?(route), "Existing route preserved: #{route}")
end
week10 = documents.select { |_, data| data.dig("courses", "csp", "week") == 10 }
assert(week10.map { |_, data| data["permalink"] }.sort ==
       %w[/flask--api /flask-debug-walk /python/flask/api/contracts-testing].sort,
       "Week 10 focuses on API interfaces, testing, and integration")
assert(File.read(File.join(ROOT, "_projects/.makeprojects")).lines.map(&:strip).include?("lessons/flask:dev"),
       "Flask is registered for development builds")
assert(Dir[File.join(ROOT, "_notebooks/CSP/flask/**/*.ipynb")].empty?, "No old notebook sources remain")
structure_source = File.read(File.join(PROJECT, "docs/2025-08-06-flask-file-structure.md"))
structure_body = structure_source.split(/^---\s*$/, 3).last
structure_liquid = Liquid::Template.parse(structure_body).render!("site" => { "baseurl" => "/preview" })
markdown = Jekyll::Converters::Markdown.new(Jekyll.configuration("config" => [], "quiet" => true))
structure = Nokogiri::HTML.fragment(markdown.convert(structure_liquid))
assert(structure.css("style, script, html, head, body, [style], [onclick]").empty?,
  "Structure guide uses shared styling and native navigation, not a nested page or inline code")
assert(structure.at_css("nav .ocs__tree .ocs__tree") && structure.at_css(".ocs__table-wrap > .ocs__table"),
  "Structure guide uses OCS tree and responsive table grammar")
structure.css('nav a[href^="#"]').each do |link|
  assert(structure.at_css(link["href"]), "Structure tree destination exists: #{link['href']}")
end
assert(structure.css("[id]").map { |element| element["id"] }.uniq.size == structure.css("[id]").size,
  "Structure guide anchor IDs are unique")
assert(structure.at_css("#db-init-py .ocs__callout").text.include?("drop and recreate"),
  "Database initialization is explicitly identified as destructive")
assert(structure.at_css("#demo-app").text.include?("5001") && structure.at_css("#init-py").text.include?("8587"),
  "The standalone demo and full backend are distinguished")
assert(structure.at_css('a[href="/preview/python/flask/api/contracts-testing"]'),
  "API testing link respects the site base URL")
assert(structure.at_css("#main-py").text.include?("from __init__ import app, db, login_manager"),
  "Startup example imports the existing shared app")
%w[api/user.py model/user.py hacks/joke.py hacks/jokes.py api/microblog_api.py model/microblog.py].each do |path|
  assert(structure.at_css("[data-flask-path='#{path}']"), "Structure guide includes the teaching source: #{path}")
end
contract_source = File.read(File.join(PROJECT, "docs/2026-10-15-api-contracts-testing.md"))
contract_body = contract_source.split(/^---\s*$/, 3).last
contract_liquid = Liquid::Template.parse(contract_body).render!("site" => { "baseurl" => "/preview" })
contract = Nokogiri::HTML.fragment(markdown.convert(contract_liquid))
requests = contract.css("pre code").map(&:text).join("\n")
[
  "GET {{baseUrl}}/api/jokes/count",
  "GET {{baseUrl}}/api/jokes",
  "GET {{baseUrl}}/api/id",
  "GET {{baseUrl}}/api/microblog?limit=5",
  "POST {{baseUrl}}/api/microblog"
].each do |request|
  assert(requests.lines.map(&:strip).include?(request), "REST Client request survives Liquid: #{request}")
end
assert(!requests.include?("@baseUrl"), "Examples inherit the selected backend REST Client environment")
assert(JSON.parse(requests.split("\n\n").last.strip) == { "content" => "" },
       "Authenticated negative microblog example validates empty content without creating a post")
assert(contract.text.include?("manual checks") && contract.text.include?("kasm_server_needed"),
       "Testing guidance distinguishes manual checks and warns about provisioning side effects")
flask_checkout = File.expand_path("../flask", ROOT)
if File.directory?(flask_checkout)
  structure.css("[data-flask-path]").each do |entry|
    assert(File.exist?(File.join(flask_checkout, entry["data-flask-path"])),
      "Documented path exists in sibling Flask checkout: #{entry['data-flask-path']}")
  end
end
Dir.mktmpdir("flask-publication-") do |destination|
  ProjectPublisher.run("publish", PROJECT, destination)
  Dir[File.join(PROJECT, "docs/*.md")].each do |source|
    output = File.join(destination, "_posts/projects/flask/2026-04-15-flask-#{File.basename(source)}")
    assert(File.exist?(output) && File.read(output) == File.read(source),
           "Markdown is published before course splitting without duplicate output names: #{source}")
  end
end
puts "PASS: #{documents.size} Flask sources, unique routes, Topics categories, and Week 10 API readings"
