---
layout: post
categories: ['CSSE JavaScript']
comments: True
codemirror: True
title: Character Stats & Inventory (JSON)
description: JavaScript Object Notation (JSON) lesson defining character attributes, stats, and inventory in a game.
permalink: /javascript/json/lesson
author: Ekrayem, Vincent, Cole
---

## All About Game Character Objects and JSON

## What is a Game Character Object?

JSON is a notation for a data structure that stores key-value pairs in a single variable. In game development, it could act as a character sheet that holds a player's stats, equipped items, and inventory in a single organized unit.

### Key Features:
- Elements are stored as a hash table (like a character attribute registry)
- Each attribute can be accessed by its key (e.g., `character.health`)
- You can change stats, add new gear, or remove inventory items
- Usually stores elements as a mix of different data types (strings, numbers, arrays)
- Data can be nested (e.g., storing an inventory array inside a character object)

## Why are Objects Important in Game Development?

JavaScript Objects allow you to:
- Store related character stats and properties under one character sheet
- Update player health, level, and equipment dynamically during gameplay
- Organize game state information in a structured, readable way
- Save and load player save-data between sessions (JSON format)

## Character Profile Object

Let's start with a basic character screen. Notice how we use keys (like "name", "level", "class") to access character data.

{% capture challenge0 %}
Personalize your character profile screen.
{% endcapture %}

{% capture code0 %}
// Simple game character object with key-value pairs
const character = {
    name: "Astra",
    level: 12,
    class: "Mage",
    primaryElement: "Lightning"
};

// Access character stats using keys
console.log("Name:", character.name);
console.log("Level:", character.level);
console.log("Element:", character.primaryElement);

// Add a new attribute to the character
character.guild = "Shadow Keepers";
console.log("After joining a guild:");
console.log(character);
{% endcapture %}

{% capture source0 %}
```javascript
%%js

// CODE_RUNNER: Personalize your character profile screen.

// Simple game character object with key-value pairs
const character = {
    name: "Astra",
    level: 12,
    class: "Mage",
    primaryElement: "Lightning"
};

// Access character stats using keys
console.log("Name:", character.name);
console.log("Level:", character.level);
console.log("Element:", character.primaryElement);

// Add a new attribute to the character
character.guild = "Shadow Keepers";
console.log("After joining a guild:");
console.log(character);