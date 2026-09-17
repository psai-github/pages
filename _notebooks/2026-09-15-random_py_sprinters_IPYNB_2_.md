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

<p>Randomness makes programs less predictable and more interactive. It can power dice rolls, shuffled playlists, randomized quiz questions, and computer choices.</p>

<blockquote><p><strong>Warm-up:</strong> Think of one app or game that would become boring if it always made the same choice.</p></blockquote>

<p><strong>How to use this page:</strong> Read and trace the Python examples here. Run or edit them in the notebook or your Python editor. Expand the answers after making your prediction.</p>

<h2>1. LxD Cycle Process</h2>

<h3>Empathize</h3>

<p>Students learn random numbers best when they can <strong>predict, run, and immediately see</strong> what each line of code changes. Long explanations are avoided in favor of small examples and visible results.</p>

<h3>Define</h3>

<p>Students need to understand three main ideas:</p>

<ol>
<li>Python must import the <code>random</code> module.</li>
<li>Different functions create different types of random results.</li>
<li>A random value can be stored in a variable and used in a decision.</li>
</ol>

<h3>Ideate</h3>

<p>The lesson uses familiar examples: a dice roll, a random name picker, and a simple computer opponent. Each example adds only one new idea at a time.</p>

<h3>Prototype &amp; Test</h3>

<p>Students first run working examples, then change one part, predict the result, and test their prediction. The final mini-project combines the lesson concepts.</p>

<h2>2. Lesson Plan</h2>

<h3>Learning Objective</h3>

<p>Students will use Python's <code>random</code> module to generate random integers, select items from a list, and control decisions in a program.</p>

<h3>Success Criteria</h3>

<p>By the end of the lesson, I can:</p>

<ul>
<li>import and use the <code>random</code> module</li>
<li>explain that both endpoints in <code>randint(a, b)</code> are included</li>
<li>use <code>random.choice()</code> with a list</li>
<li>store a random result in a variable</li>
<li>use a random value inside an <code>if</code> statement</li>
</ul>

<h3>Part 1: Random Integers</h3>

<p>Python keeps its random tools inside a built-in <strong>module</strong> named <code>random</code>. A module is like a toolbox: importing it gives our program access to extra tools.</p>

<h4>Visual code trace</h4>

<table>
<thead><tr><th scope="col">Code</th><th scope="col">What Python does</th></tr></thead>
<tbody>
<tr><td><code>import random</code></td><td>Opens the random toolbox</td></tr>
<tr><td><code>roll = random.randint(1, 6)</code></td><td>Chooses a whole number from 1 through 6</td></tr>
<tr><td><code>print(roll)</code></td><td>Displays the chosen number</td></tr>
</tbody>
</table>

<p>The word <strong>inclusive</strong> matters: <code>random.randint(1, 6)</code> can return <strong>1, 2, 3, 4, 5, or 6</strong>.</p>

<p><strong>Predict before running:</strong> Could the result ever be 0? Could it ever be 6?</p>

<pre><code>import random

# Both 1 and 6 are possible
roll = random.randint(1, 6)
print("You rolled:", roll)</code></pre>

<h4>Change it and test it</h4>

<p>Turn the six-sided die into a twenty-sided die by changing only the two arguments inside <code>randint()</code>.</p>

<p><strong>Quick check:</strong> What values are possible from <code>random.randint(4, 8)</code>?</p>
<details><summary>Reveal answer</summary><p>4, 5, 6, 7, and 8. Both endpoints are included.</p></details>

<p>Each integer in the range has the same chance of being selected. Repeated calls can return the same result; a few runs do not have to contain every possible value.</p>

<h3>Part 2: Random Choices</h3>

<p><code>random.choice()</code> selects one item from a <strong>sequence</strong>, such as a list.</p>

<h4>Follow the data</h4>

<p><code>["forest", "desert", "ocean"]</code> → <code>random.choice(locations)</code> → one chosen item → <code>print()</code></p>

<table>
<thead><tr><th scope="col">Piece</th><th scope="col">Purpose</th></tr></thead>
<tbody>
<tr><td><code>locations = [...]</code></td><td>Stores all possible choices</td></tr>
<tr><td><code>random.choice(locations)</code></td><td>Selects one list item</td></tr>
<tr><td><code>selected</code></td><td>Remembers the selected item</td></tr>
</tbody>
</table>

<p><strong>Predict before running:</strong> Is Python returning the item's position or the actual item?</p>

<pre><code>import random

locations = ["forest", "desert", "ocean"]
selected = random.choice(locations)

print("Your mission location is:", selected)</code></pre>

<h4>Try this</h4>

<p>Add two new locations to the list and run the code several times. Every output should be one of the items in your list.</p>

<blockquote><p><code>randint()</code> chooses a whole <strong>number</strong> from a range.  <br>
<code>choice()</code> chooses an <strong>item</strong> from a sequence.</p></blockquote>

<h3>Part 3: Random Values in Decisions</h3>

<p>Randomness becomes more useful when a program reacts to the value it receives. We can combine a random number with an <code>if</code> statement.</p>

<h4>Program flow</h4>

<ol>
<li>Generate a number.</li>
<li>Save it in <code>computer_move</code>.</li>
<li>Compare the number.</li>
<li>Print the matching action.</li>
</ol>

<table>
<thead><tr><th scope="col">Random value</th><th scope="col">Program action</th></tr></thead>
<tbody>
<tr><td>1</td><td>Move left</td></tr>
<tr><td>2</td><td>Move right</td></tr>
<tr><td>3</td><td>Stay still</td></tr>
</tbody>
</table>

<p>Before running, trace the program as if <code>computer_move</code> were 2. Which message would print?</p>

<pre><code>import random

computer_move = random.randint(1, 3)
print("Computer rolled:", computer_move)

if computer_move == 1:
    print("Computer moves left.")
elif computer_move == 2:
    print("Computer moves right.")
else:
    print("Computer stays still.")</code></pre>

<h4>Common mistake</h4>

<p>This line generates one random value:</p>

<pre><code>move = random.randint(1, 3)</code></pre>

<p>Reuse <code>move</code> in every comparison. Calling <code>randint()</code> again inside each condition creates new values, so the program may not behave as expected.</p>

<h2>3. Classwork &amp; Practice Tasks</h2>

<h3>Classwork 1</h3>

<p><strong>Build a coin flip.</strong></p>

<ol>
<li>Generate either 1 or 2.</li>
<li>Print <code>Heads</code> when the value is 1.</li>
<li>Print <code>Tails</code> when the value is 2.</li>
<li>Run the program at least three times.</li>
</ol>

<p><strong>Checkpoint:</strong> Show your code and explain why both outcomes are possible.</p>

<pre><code>import random

# Replace the blanks to finish the coin flip
flip = random.randint(__, __)

if flip == __:
    print("Heads")
else:
    print("Tails")</code></pre>

<h3>Classwork 2</h3>

<p><strong>Create a random student picker.</strong></p>

<ul>
<li>Make a list containing at least five names.</li>
<li>Use <code>random.choice()</code> to select one name.</li>
<li>Print a complete sentence containing the selected name.</li>
</ul>

<p><strong>Extension:</strong> Add a second list of questions and randomly select both a student and a question.</p>

<pre><code>import random

students = ["Alex", "Sam", "Jordan", "Taylor", "Casey"]

# Write two lines below:
# 1. Select a random student
# 2. Print the result
</code></pre>

<h3>Classwork 3</h3>

<p><strong>Create a weather simulator.</strong></p>

<p>Generate a random number from 1 through 4 and use a decision to print:</p>

<ul>
<li>1: Sunny</li>
<li>2: Cloudy</li>
<li>3: Rainy</li>
<li>4: Windy</li>
</ul>

<p>Then add one extra message for each result. For example, a sunny result could print <code>Remember sunglasses.</code></p>

<p><strong>Requirement:</strong> Generate the random number once, store it, and reuse that variable in the conditions.</p>

<pre><code>import random

weather_number = random.randint(1, 4)

# Add an if / elif / else decision below
</code></pre>

<h3>Homework</h3>

<h4>Mini-project: Random Adventure Generator</h4>

<p>Create a short program that can produce different adventure setups when it runs. Random results can repeat.</p>

<p>Your program must include:</p>

<ul>
<li><code>import random</code></li>
<li>one list of at least four locations</li>
<li>one list of at least four items</li>
<li><code>random.choice()</code> used on both lists</li>
<li>one <code>random.randint()</code></li>
<li>an <code>if</code> statement that reacts to the random integer</li>
<li>a clear final output that combines the results</li>
</ul>

<p>Example format: <code>You travel to the forest with a map. Challenge level: 3.</code></p>

<p>Do not copy the example exactly. Choose your own theme and outputs.</p>

<h2>4. Grading Plan</h2>

<table>
<thead><tr><th scope="col">Category</th><th scope="col">Points</th><th scope="col">Full-credit requirement</th></tr></thead>
<tbody>
<tr><td>Random tools</td><td>3</td><td>Correctly imports <code>random</code> and uses both <code>randint()</code> and <code>choice()</code></td></tr>
<tr><td>Program logic</td><td>3</td><td>Stores results in variables and uses a correct decision</td></tr>
<tr><td>Required content</td><td>2</td><td>Includes the required lists, range, and output</td></tr>
<tr><td>Testing and explanation</td><td>1</td><td>Runs multiple tests and briefly explains what changes</td></tr>
<tr><td>Readability</td><td>1</td><td>Uses clear variable names, comments, and organized output</td></tr>
<tr><td><strong>Total</strong></td><td><strong>10</strong></td><td></td></tr>
</tbody>
</table>

<h3>Exit Ticket</h3>

<p>Answer in 1–2 sentences each:</p>

<ol>
<li>What is the difference between <code>random.randint()</code> and <code>random.choice()</code>?</li>
<li>Why should a random result usually be stored in a variable?</li>
<li>If <code>random.randint(2, 5)</code> is used, list every possible result.</li>
</ol>

<h2>5. Lesson Revisions &amp; Feedback Evidence</h2>

<p>After teaching the lesson, record feedback here.</p>

<table>
<thead><tr><th scope="col">Feedback source</th><th scope="col">What was confusing or helpful?</th><th scope="col">Revision made</th></tr></thead>
<tbody>
<tr><td>Student feedback</td><td></td><td></td></tr>
<tr><td>Peer feedback</td><td></td><td></td></tr>
<tr><td>Teacher observation</td><td></td><td></td></tr>
</tbody>
</table>

<p>Possible evidence includes completed quick checks, common coding errors, student explanations, and improvements between the first and final program.</p>
