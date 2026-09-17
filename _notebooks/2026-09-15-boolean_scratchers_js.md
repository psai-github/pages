---
layout: post
categories: [JavaScript, Boolean-Expressions]
lesson_language: JavaScript
lesson_topic: Boolean-Expressions
lesson_part: interactive
lesson_type: lesson
codemirror: true
microblog: true
toc: false
comments: false
title: 3.5 Boolean Expressions (JS)
description: Learn Boolean expressions in JavaScript using the five-part LxD lesson format.
permalink: /javascript/boolean/js
---

# 3.5 Boolean Expressions in JavaScript

A **Boolean expression** is a question that evaluates to only `true` or `false`. JavaScript is the main language for this lesson. Python and College Board pseudocode are only used to compare the same idea in different forms.

## 1. LxD Cycle Process

**Empathize:** Boolean expressions can look simple, but it is easy to mix up `&&` and `||`, forget a boundary such as `>=`, or write a condition that does not match the rule in normal English.

**Define:**
- **POV:** CSP students need a clear way to turn real-world rules into Boolean expressions so their programs make the correct decisions.
- **Learning Goal:** Students will be able to evaluate, write, test, and explain Boolean expressions in JavaScript.

**Ideate:**
- **HMW Question:** How might we make Boolean logic easier to understand before students have to write a full program?
- **Activity:** Predict Boolean results, fix an incorrect condition, and then build one complete decision checker.

**Prototype & Test:** Use the classwork below to check whether students can predict results before running code, choose the correct Boolean operator, and explain why their expression matches the rule.

---

## 2. Lesson Plan

**Learning Objective:** By the end of this lesson, you will be able to use comparisons, `&&`, `||`, and `!` to create Boolean expressions and use them in JavaScript decisions.

**Success Criteria:** You can predict whether an expression is `true` or `false`, write a condition from a rule in normal English, and test the condition with more than one set of values.

### Part 1: Comparisons Create Booleans

JavaScript comparison operators return `true` or `false`.

| JavaScript | Meaning | Example |
| --- | --- | --- |
| `===` | equal to | `score === 90` |
| `!==` | not equal to | `score !== 0` |
| `>` | greater than | `score > 70` |
| `<` | less than | `age < 18` |
| `>=` | greater than or equal to | `score >= 70` |
| `<=` | less than or equal to | `age <= 18` |

```javascript
let score = 82;

console.log(score >= 70);
console.log(score === 100);
console.log(score !== 0);
```

Remember:
- `score = 90` assigns a value.
- `score === 90` compares both value and type.

### Part 2: `&&`, `||`, and `!`

Sometimes one comparison is not enough.

| Idea | JavaScript | Python | College Board pseudocode |
| --- | --- | --- | --- |
| both must be true | `&&` | `and` | `AND` |
| at least one is true | `||` | `or` | `OR` |
| reverse true/false | `!` | `not` | `NOT` |

```javascript
let hasId = true;
let hasTicket = false;

console.log(hasId && hasTicket);
console.log(hasId || hasTicket);
console.log(!hasTicket);
```

A longer expression can be read one part at a time:

```javascript
let age = 16;
let isTeenager = age >= 13 && age <= 19;
console.log(isTeenager);
```

### Part 3: Booleans Control `if` Statements

An `if` statement runs when its condition is true.

```javascript
let temperature = 72;

if (temperature >= 70) {
    console.log("It is warm outside.");
} else {
    console.log("It is not warm outside.");
}
```

The same basic decision in College Board pseudocode is:

```text
IF(temperature ≥ 70)
{
    DISPLAY("It is warm outside.")
}
ELSE
{
    DISPLAY("It is not warm outside.")
}
```

---

## 3. Classwork & Practice Tasks

### Classwork 1: Predict Before You Run

Predict each result first. Then run the code and compare.

```javascript
console.log(8 > 5);
console.log(4 === 7);
console.log("cat" !== "dog");
console.log(10 <= 10);
```

For each line, write `true` or `false` and one short reason.

### Classwork 2: Fix the Logic

A level should unlock only when the player has **at least 10 coins AND has found the key**.

```javascript
let coins = 12;
let hasKey = false;

// Fix the condition so both requirements are needed.
let canUnlock = coins >= 10 || hasKey;

if (canUnlock) {
    console.log("Level unlocked");
} else {
    console.log("Keep looking");
}
```

Do these four things:
1. Predict what the current code prints.
2. Fix the Boolean expression.
3. Test at least three combinations of `coins` and `hasKey`.
4. Explain why the rule needs `&&` or `||`.

### Classwork 3: Translate the Logic

Start with this JavaScript expression:

```javascript
hasTicket || onGuestList
```

Write the same Boolean expression in Python and College Board pseudocode. Then explain what word in **"ticket or guest list"** tells you which operator to use.

### Homework: Boolean Decision Checker

A student can use a study room when:
- they are logged in,
- they reserved the room **or** a teacher gave permission,
- and the room is **not** closed.

```javascript
let loggedIn = true;
let reservedRoom = false;
let teacherPermission = true;
let roomClosed = false;

// Replace false with one Boolean expression.
let canUseRoom = false;

if (canUseRoom) {
    console.log("Study room access approved");
} else {
    console.log("Study room access denied");
}
```

Test at least four cases, including one where the room is closed and one where the student is not logged in. Then explain your Boolean expression in 2–3 sentences.

---

## 4. Grading Plan

Point values can be decided separately. For now, the work to check is:
- classwork predictions include an explanation,
- the incorrect Boolean condition is fixed and tested,
- the homework uses the required conditions,
- the student can explain the final expression in normal English.

---

## 5. Lesson Revisions & Feedback Evidence

- The lesson is organized into the same numbered `1` through `5` structure used by the Python lesson.
- Activity names use **Part**, **Classwork**, and **Homework** instead of labels such as Tech Talk or Popcorn Hack.
- JavaScript stays the main coding language, while Python and College Board pseudocode are short comparison aids.
- Feedback from a practice run can be added here with the specific change that was made because of it.
