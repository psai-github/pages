require "json"
require "yaml"
require "date"
require "tmpdir"
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
Dir.mktmpdir("flask-publication-") do |destination|
  ProjectPublisher.run("publish", PROJECT, destination)
  Dir[File.join(PROJECT, "docs/*.md")].each do |source|
    output = File.join(destination, "_posts/projects/flask/2026-04-15-flask-#{File.basename(source)}")
    assert(File.exist?(output) && File.read(output) == File.read(source),
           "Markdown is published before course splitting without duplicate output names: #{source}")
  end
end
puts "PASS: #{documents.size} Flask sources, unique routes, Topics categories, and Week 10 API readings"
