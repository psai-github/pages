require "minitest/autorun"
require "jekyll"
require "tmpdir"
require "fileutils"
require_relative "../../../../scripts/publish_project"
require_relative "../plugins/topics"

class TopicsTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  PROJECT = File.expand_path("..", __dir__)

  def test_topic_urls_are_servable_for_all_permalink_forms
    assert_equal "/topics/view/example/", Topics.view_url("/example")
    assert_equal "/topics/view/example/", Topics.view_url("/example/")
    assert_equal "/topics/view/example.html", Topics.view_url("/example.html")
  end

  def test_topic_pages_and_original_course_documents_have_separate_contexts
    Dir.mktmpdir("topics-") do |source|
      ProjectPublisher.run("publish", PROJECT, source)
      ProjectPublisher.run("publish", File.join(ROOT, "_projects/systems/blogs"), source)
      File.write(File.join(source, "_layouts/opencs.html"), "<main>{{ content }}</main>")
      File.write(File.join(source, "_includes/course-document-player.html"), '<div id="course-player">{{ content }}</div>')
      FileUtils.cp(File.join(ROOT, "_includes/reading_time.html"), File.join(source, "_includes"))
      File.write(File.join(source, "lesson.md"), <<~DOC)
        ---
        layout: post
        title: Java Algorithms
        categories: [Java, Algorithms]
        permalink: /java/algorithms/
        courses: {csa: {week: 14}}
        assignment: true
        assignment_submission_type: code
        show_reading_time: false
        chat: true
        ---
        ## Algorithm heading
        Algorithm evidence.
        {% include_relative evidence.md %}
        <div class="code-runner-container">Interactive runner</div>
      DOC
      File.write(File.join(source, "evidence.md"), "**Relative evidence**")
      File.write(File.join(source, "outline.md"), <<~DOC)
        ---
        layout: opencs
        title: CS112 Outline
        categories: [Java, CS112]
        permalink: /csa/cs112/
        ---
        <a href="/preview/java/algorithms/">Supporting lesson</a>
      DOC
      File.write(File.join(source, "course-browser.md"), <<~DOC)
        ---
        layout: opencs
        permalink: /course-browser/
        ---
        {% include topics-browser.html course_context=true %}
      DOC
      %w[hidden draft excluded].each do |kind|
        flag = { "hidden" => "hide: true", "draft" => "lesson_status: draft", "excluded" => "search_exclude: true" }.fetch(kind)
        File.write(File.join(source, "#{kind}.md"), "---\nlayout: post\ncategories: [Java]\n#{flag}\n---\nExcluded\n")
      end
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"),
        "layouts_dir" => File.join(source, "_layouts"), "includes_dir" => File.join(source, "_includes"),
        "config" => [], "plugins_dir" => [], "quiet" => true, "incremental" => false,
        "baseurl" => "/preview", "disqus" => {}
      ))
      site.process
      index = JSON.parse(File.read(File.join(source, "_site/assets/js/topics/data.json")))
      assert_equal 2, index.size
      lesson = index.find { |entry| entry["url"] == "/java/algorithms/" }
      assert_equal %w[java algorithms], lesson["categories"]
      assert_equal ["CSA week 14"], lesson["weeks"]
      assert_includes lesson["content"], "Algorithm evidence."
      original = File.read(File.join(source, "_site/java/algorithms/index.html"))
      assert_includes original, 'id="course-player"'
      topic = File.read(File.join(source, "_site/topics/view/java/algorithms/index.html"))
      refute_includes topic, 'id="course-player"'
      assert_includes topic, "Interactive runner"
      assert_includes topic, "<strong>Relative evidence</strong>"
      assert_includes topic, 'id="algorithm-heading"'
      assert_includes topic, "CURRENT_LESSON_ID_BLOG = \"/java/algorithms/\""
      assert_includes topic, "/preview/topics/?category=java"
      assert_includes topic, "/preview/assets/js/topics/document.js"
      outline = File.read(File.join(source, "_site/topics/view/csa/cs112/index.html"))
      assert_includes outline, "Topics document navigation"
      browser = File.read(File.join(source, "_site/topics/index.html"))
      assert_includes browser, "Java Algorithms"
      assert_includes browser, "/preview/topics/view/java/algorithms/"
      assert_includes browser, "<legend>Primary topics</legend>"
      primary = browser.split('<legend>Primary topics</legend>', 2).last.split('</fieldset>', 2).first
      secondary = browser.split('<legend>Categories</legend>', 2).last.split('</fieldset>', 2).first
      %w[sass python java javascript flask spring cs111 cs112 cs113].each do |category|
        assert_includes primary, "value=\"#{category}\""
        refute_includes secondary, "value=\"#{category}\""
      end
      assert_includes secondary, 'value="algorithms"'
      assert_includes browser, 'data-topics-body-results'
      refute_includes browser, "js-search-results"
      refute_includes browser, "CSA week 14"
      course_browser = File.read(File.join(source, "_site/course-browser/index.html"))
      assert_includes course_browser, "CSA week 14"
      assert_includes course_browser, 'href="/preview/java/algorithms/"'
    end

  end

  def test_primary_category_configuration_rejects_duplicates
    Dir.mktmpdir("topics-invalid-") do |source|
      FileUtils.mkdir_p(File.join(source, "_data"))
      File.write(File.join(source, "_data/topics_primary.yml"), "- Java\n- java\n")
      site = Jekyll::Site.new(Jekyll.configuration("source" => source, "config" => [], "quiet" => true))
      site.read
      assert_raises(Jekyll::Errors::FatalException) { Topics::Generator.new.generate(site) }
    end
  end
end
