---
layout: post
categories: [Python, Random-Values]
lesson_language: Python
lesson_topic: Random-Values
lesson_part: interactive
lesson_type: lesson
codemirror: true
microblog: true
toc: false
comments: false
title: 3.15 Python Random Generator (PY)
description: Learn how Python creates random integers, choices, and decisions through interactive examples.
permalink: /csp/big-idea-3/RandomPY/p3/Lesson
authors: Ruhaan Bansal, Deyar Raissadat, Arya Taghavi Zargar
---

<h1>3.15 Python Random Generator</h1>
<p><strong>Warm-up:</strong> What would happen if a game’s computer opponent always made the same move?</p>
<p><mark>Predict → run → change.</mark> Follow the examples here; run them in your notebook or Python editor.</p>

<h2>1. LxD Cycle Process</h2>
<details>
<summary>Teaching plan</summary>
<h3>Empathize</h3>
<p>Make randomness visible through short, familiar examples.</p>
<h3>Define</h3>
<p>Choose a number, pick an item, and use the result in a decision.</p>
<h3>Ideate</h3>
<p>Use a die, a location picker, and a computer opponent.</p>
<h3>Prototype &amp; Test</h3>
<p>Students predict an output, run the code, then change one part.</p>
</details>

<h2>2. Lesson Plan</h2>
<h3>Learning Objective</h3>
<p>Use Python’s <code>random</code> module to make unpredictable choices.</p>
<h3>Success Criteria</h3>
<ul>
<li>Choose valid bounds for <code>randint()</code>.</li>
<li>Select a list item with <code>choice()</code>.</li>
<li>Store a result and use it in an <code>if</code> statement.</li>
</ul>

<h3>Part 1: Random Integers</h3>
<p><code>import random</code> gives Python access to its built-in random tools.</p>
<table>
<caption>Read the code from top to bottom</caption>
<thead><tr><th scope="col">Code</th><th scope="col">Job</th></tr></thead>
<tbody>
<tr><td><code>import random</code></td><td>Load the tools</td></tr>
<tr><td><code>roll = random.randint(1, 6)</code></td><td>Pick and store a whole number</td></tr>
<tr><td><code>print(roll)</code></td><td>Display it</td></tr>
</tbody>
</table>
<p><mark>Both endpoints count.</mark> Possible results: 1, 2, 3, 4, 5, 6.</p>
<p><strong>Predict:</strong> Can it return 0? What about 6?</p>

<pre><code>import random

# Both 1 and 6 are possible
roll = random.randint(1, 6)
print("You rolled:", roll)</code></pre>

<p><strong>Change it:</strong> Make this a twenty-sided die.</p>
<p><strong>Quick check:</strong> List the possible results of <code>random.randint(4, 8)</code>.</p>
<details><summary>Reveal answer</summary><p>4, 5, 6, 7, 8.</p></details>
<p>Each number has an equal chance. <mark>Random results can repeat.</mark> Six rolls do not guarantee six different numbers.</p>

<h3>Part 2: Random Choices</h3>
<p><code>random.choice()</code> picks <mark>one item from a list</mark>.</p>
<p><strong>Predict:</strong> Will this code print a location or its position in the list?</p>

<pre><code>import random

locations = ["forest", "desert", "ocean"]
selected = random.choice(locations)

print("Your mission location is:", selected)</code></pre>

<details><summary>Reveal answer and trace</summary>
<p>It prints the location itself. For example:</p>
<table>
<thead><tr><th scope="col">Step</th><th scope="col">Example value</th></tr></thead>
<tbody>
<tr><td>Available items</td><td><code>["forest", "desert", "ocean"]</code></td></tr>
<tr><td>Item stored in <code>selected</code></td><td><code>"ocean"</code></td></tr>
<tr><td>Printed message</td><td><samp>Your mission location is: ocean</samp></td></tr>
</tbody>
</table>
<p>This is one possible run, not a fixed output.</p>
</details>
<p><strong>Change it:</strong> Add two locations. Run again.</p>

<h3>Part 3: Random Values in Decisions</h3>
<p>An <code>if</code> statement turns a random number into an action.</p>
<table>
<thead><tr><th scope="col">Value</th><th scope="col">Action</th></tr></thead>
<tbody>
<tr><td>1</td><td>Move left</td></tr>
<tr><td>2</td><td>Move right</td></tr>
<tr><td>3</td><td>Stay still</td></tr>
</tbody>
</table>
<p><strong>Trace it:</strong> If <code>computer_move</code> is 2, which branch runs?</p>

<pre><code>import random

computer_move = random.randint(1, 3)
print("Computer rolled:", computer_move)

if computer_move == 1:
    print("Computer moves left.")
elif computer_move == 2:
    print("Computer moves right.")
else:
    print("Computer stays still.")</code></pre>

<details><summary>Reveal the branch</summary><p>The <code>elif</code> branch prints <samp>Computer moves right.</samp></p></details>
<p><mark>Generate once, reuse the variable.</mark> Calling <code>randint()</code> again makes a new draw—it may not match the first one.</p>

<h2>3. Classwork &amp; Practice Tasks</h2>
<h3>Classwork 1</h3>
<p><strong>Coin flip:</strong> Fill the blanks so 1 prints <samp>Heads</samp> and 2 prints <samp>Tails</samp>. Then run it three times.</p>
<p><strong>Explain:</strong> Why are both outcomes possible?</p>

<pre><code>import random

# Replace the blanks to finish the coin flip
flip = random.randint(__, __)

if flip == __:
    print("Heads")
else:
    print("Tails")</code></pre>

<h3>Classwork 2</h3>
<p><strong>Student picker:</strong> Use <code>choice()</code> to pick from at least five names and print a sentence with the result.</p>
<details><summary>Optional challenge</summary><p>Add a list of questions. Pick both a student and a question.</p></details>

<pre><code>import random

students = ["Alex", "Sam", "Jordan", "Taylor", "Casey"]

# Write two lines below:
# 1. Select a random student
# 2. Print the result
</code></pre>

<h3>Classwork 3</h3>
<p><strong>Weather simulator:</strong> Use one random draw and an <code>if / elif / else</code> decision.</p>
<table>
<thead><tr><th scope="col">Number</th><th scope="col">Weather</th></tr></thead>
<tbody>
<tr><td>1</td><td>Sunny</td></tr>
<tr><td>2</td><td>Cloudy</td></tr>
<tr><td>3</td><td>Rainy</td></tr>
<tr><td>4</td><td>Windy</td></tr>
</tbody>
</table>
<p>Print the weather and one matching suggestion, such as <samp>Bring an umbrella.</samp></p>

<pre><code>import random

weather_number = random.randint(1, 4)

# Add an if / elif / else decision below
</code></pre>

<h3>Homework</h3>
<h4>Mini-project: Random Adventure Generator</h4>
<p>Choose your own theme. Your program must:</p>
<ul>
<li>Import <code>random</code>.</li>
<li>Use <code>choice()</code> on two lists: at least four locations and four items.</li>
<li>Use <code>randint()</code> for a challenge level from 1 to 5.</li>
<li>Use an <code>if</code> statement to react to that level.</li>
<li>Print the location, item, level, and reaction.</li>
</ul>
<p><strong>Possible output:</strong> <samp>You reach the ocean with a map. Level: 4. Find a guide!</samp></p>
<p>Submit your code, three test outputs, and one sentence explaining what can change.</p>

<h2>4. Grading Plan</h2>
<table>
<caption>Homework rubric — 10 points</caption>
<thead><tr><th scope="col">Requirement</th><th scope="col">Points</th></tr></thead>
<tbody>
<tr><td>Correct import, <code>randint()</code>, and <code>choice()</code></td><td>3</td></tr>
<tr><td>Stored results and a working decision</td><td>3</td></tr>
<tr><td>Required lists, range, and output</td><td>2</td></tr>
<tr><td>Three test outputs and an explanation</td><td>1</td></tr>
<tr><td>Clear names and readable code</td><td>1</td></tr>
</tbody>
</table>

<h3>Exit Ticket</h3>
<ol>
<li><code>randint()</code> or <code>choice()</code>: which picks a name?</li>
<li>Why store a random result before testing it?</li>
<li>What can <code>random.randint(2, 5)</code> return?</li>
</ol>

<h2>5. Lesson Revisions &amp; Feedback Evidence</h2>
<details>
<summary>Record feedback after teaching</summary>
<table>
<thead><tr><th scope="col">Source</th><th scope="col">Feedback / evidence</th><th scope="col">Change made</th></tr></thead>
<tbody>
<tr><td>Student</td><td></td><td></td></tr>
<tr><td>Peer</td><td></td><td></td></tr>
<tr><td>Teacher</td><td></td><td></td></tr>
</tbody>
</table>
</details>
