export interface ChallengeFile {
  name: string;
  language: string;
  content: string;
}

export interface TestCase {
  id: string;
  description: string;
  expected_output: string;
  type: 'output' | 'structure' | 'behavior' | 'sql';
  selector?: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  category: string;
  xp_reward: number;
  estimated_minutes: number;
  instructions: string;
  files: ChallengeFile[];
  test_cases: TestCase[];
  hints: string[];
  solution_hint: string;
  prerequisites: string[];
}

export const codingChallenges: CodingChallenge[] = [
  {
    id: 'challenge-1',
    title: 'FizzBuzz Classic',
    description: 'Implement the classic FizzBuzz algorithm — the go-to coding interview warmup. Print numbers 1 to 20, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
    difficulty: 1,
    category: 'JavaScript',
    xp_reward: 50,
    estimated_minutes: 10,
    instructions: 'Write a function called `fizzBuzz()` that loops from 1 to 20 and returns an array of strings. For each number:\n- If divisible by 3 AND 5 → "FizzBuzz"\n- If divisible by 3 → "Fizz"\n- If divisible by 5 → "Buzz"\n- Otherwise → the number as a string',
    files: [
      {
        name: 'index.js',
        language: 'javascript',
        content: `function fizzBuzz() {
  const result = [];
  
  // Write your code here
  for (let i = 1; i <= 20; i++) {
    // TODO: Add your FizzBuzz logic
  }
  
  return result;
}

// Run the function
const output = fizzBuzz();
console.log(output);`
      }
    ],
   test_cases: [
      {
        id: 'tc-1-1',
        description: 'Should return an array of 20 items',
        expected_output: '20',
        type: 'output'
      },
      {
        id: 'tc-1-2',
        description: 'Position 1 should be "1" (not "Fizz" or "Buzz")',
        expected_output: '"1"',
        type: 'output'
      },
      {
        id: 'tc-1-3',
        description: 'Position 3 should be "Fizz"',
        expected_output: '"Fizz"',
        type: 'output'
      },
      {
        id: 'tc-1-4',
        description: 'Position 15 should be "FizzBuzz"',
        expected_output: '"FizzBuzz"',
        type: 'output'
      }
    ],
    hints: [
      'Use the modulo operator (%) to check divisibility',
      'Check for divisibility by 15 FIRST (both 3 and 5), then 3, then 5',
      'Remember to convert numbers to strings with String() or .toString()'
    ],
    solution_hint: 'Loop from 1 to 20. Use if/else if to check divisibility by 15, then 3, then 5. Push the appropriate string to the result array.',
    prerequisites: []
  },
  {
    id: 'challenge-2',
    title: 'DOM Counter App',
    description: 'Build an interactive counter using vanilla JavaScript. Create a counter display and two buttons — one to increment and one to decrement. The counter should not go below 0.',
    difficulty: 1,
    category: 'HTML/CSS/JS',
    xp_reward: 75,
    estimated_minutes: 15,
    instructions: 'Create a simple counter with the following:\n1. A display showing the current count (starts at 0)\n2. A "+1" button that increments the count\n3. A "-1" button that decrements the count\n4. The count should never go below 0\n5. Add some basic styling to make it look nice',
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="counter-container">
    <h1>Counter</h1>
    <div id="counter-display" class="counter-display">0</div>
    <div class="button-group">
      <button id="decrement-btn" class="btn btn-decrement">-1</button>
      <button id="increment-btn" class="btn btn-increment">+1</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: 'style.css',
        language: 'css',
        content: `/* Add your styles here */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a0a0f;
  color: #f1f5f9;
}

.counter-container {
  text-align: center;
}

/* TODO: Style the counter display and buttons */`
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: `// Get DOM elements
const display = document.getElementById("counter-display");
const incrementBtn = document.getElementById("increment-btn");
const decrementBtn = document.getElementById("decrement-btn");

let count = 0;

// TODO: Add event listeners for increment and decrement
// TODO: Update the display whenever count changes
// TODO: Prevent count from going below 0`
      }
    ],
    test_cases: [
      {
        id: 'tc-2-1',
        description: 'Counter display should exist and start at 0',
        expected_output: '0',
        type: 'structure',
        selector: '#counter-display'
      },
      {
        id: 'tc-2-2',
        description: 'Increment button should exist',
        expected_output: 'exists',
        type: 'structure',
        selector: '#increment-btn'
      },
      {
        id: 'tc-2-3',
        description: 'Decrement button should exist',
        expected_output: 'exists',
        type: 'structure',
        selector: '#decrement-btn'
      }
    ],
    hints: [
      'Use document.getElementById() to grab DOM elements',
      'Use addEventListener("click", callback) to handle button clicks',
      'Update display.textContent to show the new count',
      'Use an if statement to check if count > 0 before decrementing'
    ],
    solution_hint: 'Add click event listeners to both buttons. In the increment handler, increase count and update display.textContent. In the decrement handler, only decrease if count > 0.',
    prerequisites: []
  },
  {
    id: 'challenge-3',
    title: 'Palindrome Checker',
    description: 'Write a function that checks whether a given string is a palindrome. A palindrome reads the same forwards and backwards, ignoring case, spaces, and punctuation.',
    difficulty: 2,
    category: 'JavaScript',
    xp_reward: 100,
    estimated_minutes: 15,
    instructions: 'Write a function `isPalindrome(str)` that:\n1. Takes a string as input\n2. Returns true if the string is a palindrome, false otherwise\n3. Ignores case (uppercase/lowercase)\n4. Ignores spaces, punctuation, and special characters\n5. Only considers alphanumeric characters',
    files: [
      {
        name: 'index.js',
        language: 'javascript',
        content: `function isPalindrome(str) {
  // Write your code here
  // Step 1: Convert to lowercase
  // Step 2: Remove all non-alphanumeric characters
  // Step 3: Check if the cleaned string equals its reverse
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome("Was it a car or a cat I saw?")); // true
console.log(isPalindrome("hello")); // false`
      }
    ],
    test_cases: [
      {
        id: 'tc-3-1',
        description: '"A man, a plan, a canal: Panama" should return true',
        expected_output: 'true',
        type: 'output'
      },
      {
        id: 'tc-3-2',
        description: '"race a car" should return false',
        expected_output: 'false',
        type: 'output'
      },
      {
        id: 'tc-3-3',
        description: '"Was it a car or a cat I saw?" should return true (with punctuation)',
        expected_output: 'true',
        type: 'output'
      },
      {
        id: 'tc-3-4',
        description: 'Empty string should return true',
        expected_output: 'true',
        type: 'output'
      }
    ],
    hints: [
      'Use .toLowerCase() to ignore case',
      'Use a regex like /[^a-z0-9]/g to remove non-alphanumeric characters',
      'Compare the cleaned string with its reverse using .split("").reverse().join("")',
      'The replace() method with regex is your friend here'
    ],
    solution_hint: 'Clean the string: str.toLowerCase().replace(/[^a-z0-9]/g, ""). Then check if cleaned === cleaned.split("").reverse().join("").',
    prerequisites: ['challenge-1']
  },
  {
    id: 'challenge-4',
    title: 'CSS Flexbox Card Grid',
    description: 'Create a responsive card grid layout using CSS Flexbox. Display 6 cards in a 3-column grid that wraps nicely on smaller screens with hover effects.',
    difficulty: 2,
    category: 'HTML/CSS/JS',
    xp_reward: 100,
    estimated_minutes: 20,
    instructions: 'Build a card grid with:\n1. 6 cards displayed in a 3-column layout\n2. Each card has an image placeholder, title, description, and a "Learn More" link\n3. Cards should wrap to 2 columns on medium screens and 1 column on small screens\n4. Add a subtle hover effect that lifts the card\n5. Use CSS Flexbox (not Grid) for layout',
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flexbox Card Grid</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1 class="page-title">Featured Courses</h1>
  <div class="card-grid">
    <div class="card">
      <div class="card-image"></div>
      <div class="card-body">
        <h3 class="card-title">HTML Fundamentals</h3>
        <p class="card-text">Learn the building blocks of the web — semantic markup, forms, and accessibility.</p>
        <a href="#" class="card-link">Learn More →</a>
      </div>
    </div>
    <div class="card">
      <div class="card-image"></div>
      <div class="card-body">
        <h3 class="card-title">CSS Mastery</h3>
        <p class="card-text">Master layouts, animations, and responsive design with modern CSS.</p>
        <a href="#" class="card-link">Learn More →</a>
      </div>
    </div>
    <div class="card">
      <div class="card-image"></div>
      <div class="card-body">
        <h3 class="card-title">JavaScript ES6+</h3>
        <p class="card-text">Modern JavaScript from arrow functions to async/await and beyond.</p>
        <a href="#" class="card-link">Learn More →</a>
      </div>
    </div>
    <div class="card">
      <div class="card-image"></div>
      <div class="card-body">
        <h3 class="card-title">React Essentials</h3>
        <p class="card-text">Build dynamic UIs with React hooks, context, and component patterns.</p>
        <a href="#" class="card-link">Learn More →</a>
      </div>
    </div>
    <div class="card">
      <div class="card-image"></div>
      <div class="card-body">
        <h3 class="card-title">Node.js Backend</h3>
        <p class="card-text">Create REST APIs and server-side applications with Node and Express.</p>
        <a href="#" class="card-link">Learn More →</a>
      </div>
    </div>
    <div class="card">
      <div class="card-image"></div>
      <div class="card-body">
        <h3 class="card-title">Database Design</h3>
        <p class="card-text">SQL, normalization, and database architecture for real-world apps.</p>
        <a href="#" class="card-link">Learn More →</a>
      </div>
    </div>
  </div>
</body>
</html>`
      },
      {
        name: 'style.css',
        language: 'css',
        content: `/* Add your styles here */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  background-color: #0a0a0f;
  color: #f1f5f9;
  padding: 40px 20px;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  color: #10b981;
}

/* TODO: Create flexbox card grid */
/* TODO: Style individual cards with hover effect */
/* TODO: Add responsive breakpoints */`
      }
    ],
    test_cases: [
      {
        id: 'tc-4-1',
        description: 'Card grid should use flexbox (display: flex)',
        expected_output: 'flex',
        type: 'structure',
        selector: '.card-grid'
      },
      {
        id: 'tc-4-2',
        description: 'Should have exactly 6 cards',
        expected_output: '6',
        type: 'structure',
        selector: '.card'
      }
    ],
    hints: [
      'Use display: flex and flex-wrap: wrap on .card-grid',
      'Each card width: calc(33.333% - 16px) with gap or margin for spacing',
      'Use transform: translateY(-4px) on hover for the lift effect',
      'Add transition: transform 0.2s ease for smooth animation',
      'Use @media breakpoints for responsive behavior'
    ],
    solution_hint: '.card-grid gets display:flex, flex-wrap:wrap, gap:16px. Each .card gets flex: 0 0 calc(33.333% - 12px). Add hover transform and responsive media queries.',
    prerequisites: ['challenge-2']
  },
  {
    id: 'challenge-5',
    title: 'Array Chunk Splitter',
    description: 'Write a function that splits an array into smaller arrays (chunks) of a specified size. This is a commonly asked coding challenge that tests array manipulation skills.',
    difficulty: 2,
    category: 'JavaScript',
    xp_reward: 100,
    estimated_minutes: 15,
    instructions: 'Write a function `chunkArray(arr, size)` that:\n1. Takes an array and a chunk size as parameters\n2. Returns a new array containing the original array split into chunks of the given size\n3. The last chunk may be smaller than the specified size if the array does not divide evenly\n4. Do NOT mutate the original array',
    files: [
      {
        name: 'index.js',
        language: 'javascript',
        content: `function chunkArray(arr, size) {
  // Write your code here
  // Return a new array of chunks
}

// Test cases
console.log(chunkArray([1, 2, 3, 4, 5], 2));
// Expected: [[1, 2], [3, 4], [5]]

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3));
// Expected: [[1, 2, 3], [4, 5, 6], [7, 8]]

console.log(chunkArray(["a", "b", "c", "d"], 2));
// Expected: [["a", "b"], ["c", "d"]]

console.log(chunkArray([1, 2, 3], 1));
// Expected: [[1], [2], [3]]`
      }
    ],
    test_cases: [
      {
        id: 'tc-5-1',
        description: 'chunkArray([1,2,3,4,5], 2) should return 3 chunks',
        expected_output: '[[1,2],[3,4],[5]]',
        type: 'output'
      },
      {
        id: 'tc-5-2',
        description: 'chunkArray([1,2,3,4,5,6,7,8], 3) should return 3 chunks (last has 2 items)',
        expected_output: '[[1,2,3],[4,5,6],[7,8]]',
        type: 'output'
      },
      {
        id: 'tc-5-3',
        description: 'chunkArray([], 3) should return an empty array',
        expected_output: '[]',
        type: 'output'
      },
      {
        id: 'tc-5-4',
        description: 'Original array should not be mutated',
        expected_output: 'not_mutated',
        type: 'behavior'
      }
    ],
    hints: [
      'Use a loop that increments by the chunk size',
      'Use Array.prototype.slice() to grab each chunk',
      'slice(start, end) is perfect — start at i, end at i + size',
      'Make sure to handle the edge case of an empty array'
    ],
    solution_hint: 'Loop with i += size. In each iteration, push arr.slice(i, i + size) to the result array. Return the result.',
    prerequisites: ['challenge-1']
  },
  {
    id: 'challenge-6',
    title: 'Build a Todo Input',
    description: 'Create a simple todo list input where users can type a task, press Enter or click Add, and see the task appear in a list below. Each task should have a delete button.',
    difficulty: 2,
    category: 'HTML/CSS/JS',
    xp_reward: 125,
    estimated_minutes: 20,
    instructions: 'Build a todo input with:\n1. A text input field and an "Add" button\n2. Pressing Enter or clicking "Add" creates a new todo item\n3. Each todo shows the task text and a delete (trash) button\n4. Empty inputs should not create a todo\n5. Clear the input after adding a task\n6. Style it with a clean, modern look',
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo Input</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="todo-container">
    <h1 class="todo-title">My Tasks</h1>
    <div class="todo-input-group">
      <input type="text" id="todo-input" class="todo-input" placeholder="What needs to be done?">
      <button id="add-btn" class="add-btn">Add</button>
    </div>
    <ul id="todo-list" class="todo-list">
      <!-- Todo items will be added here -->
    </ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: 'style.css',
        language: 'css',
        content: `/* Add your styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #0a0a0f;
  color: #f1f5f9;
  padding-top: 60px;
}

/* TODO: Style the todo container, input group, and list items */`
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: `// Get DOM elements
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

// TODO: Create addTodo function
// TODO: Add event listeners for button click and Enter key
// TODO: Create todo items with delete buttons

function addTodo() {
  const text = input.value.trim();
  
  // TODO: Check if input is empty
  // TODO: Create li element with text and delete button
  // TODO: Append to the list
  // TODO: Clear the input
}`
      }
    ],
    test_cases: [
      {
        id: 'tc-6-1',
        description: 'Input field should exist with id "todo-input"',
        expected_output: 'exists',
        type: 'structure',
        selector: '#todo-input'
      },
      {
        id: 'tc-6-2',
        description: 'Add button should exist with id "add-btn"',
        expected_output: 'exists',
        type: 'structure',
        selector: '#add-btn'
      },
      {
        id: 'tc-6-3',
        description: 'Todo list container should exist with id "todo-list"',
        expected_output: 'exists',
        type: 'structure',
        selector: '#todo-list'
      }
    ],
    hints: [
      'Use input.value.trim() to check for empty input',
      'Create elements with document.createElement("li")',
      'Add a delete button with a click listener that calls .remove() on the parent li',
      'Listen for "keydown" event and check if event.key === "Enter"',
      'Use classList.add() to add CSS classes to new elements'
    ],
    solution_hint: 'In addTodo(), check text !== "". Create <li>, set its textContent. Create a delete <button>, add click listener that removes the li. Append everything and clear input.value.',
    prerequisites: ['challenge-2']
  },
  {
    id: 'challenge-7',
    title: 'Title Case Converter',
    description: 'Write a function that converts a string to title case — where the first letter of each word is capitalized and the rest are lowercase. Handle edge cases like empty strings.',
    difficulty: 2,
    category: 'JavaScript',
    xp_reward: 80,
    estimated_minutes: 12,
    instructions: 'Write a function `toTitleCase(str)` that:\n1. Takes a string as input\n2. Returns the string in title case\n3. Capitalizes the first letter of each word\n4. Converts all other letters to lowercase\n5. Handles empty strings (return empty string)',
    files: [
      {
        name: 'index.js',
        language: 'javascript',
        content: `function toTitleCase(str) {
  // Write your code here
}

// Test cases
console.log(toTitleCase("hello world"));
// Expected: "Hello World"

console.log(toTitleCase("JAVASCRIPT IS FUN"));
// Expected: "Javascript Is Fun"

console.log(toTitleCase("the quick BROWN fox"));
// Expected: "The Quick Brown Fox"

console.log(toTitleCase(""));
// Expected: ""`
      }
    ],
    test_cases: [
      {
        id: 'tc-7-1',
        description: '"hello world" should return "Hello World"',
        expected_output: 'Hello World',
        type: 'output'
      },
      {
        id: 'tc-7-2',
        description: '"JAVASCRIPT IS FUN" should return "Javascript Is Fun"',
        expected_output: 'Javascript Is Fun',
        type: 'output'
      },
      {
        id: 'tc-7-3',
        description: 'Empty string should return empty string',
        expected_output: '',
        type: 'output'
      },
      {
        id: 'tc-7-4',
        description: 'Single word "hello" should return "Hello"',
        expected_output: 'Hello',
        type: 'output'
      }
    ],
    hints: [
      'Split the string by spaces into words: str.split(" ")',
      'Capitalize first char: word[0].toUpperCase()',
      'Lowercase the rest: word.slice(1).toLowerCase()',
      'Join the words back: words.join(" ")',
      'Handle empty string at the start'
    ],
    solution_hint: 'Split by space, map each word to word[0].toUpperCase() + word.slice(1).toLowerCase(), join with space. Guard against empty string.',
    prerequisites: ['challenge-1']
  },
  {
    id: 'challenge-8',
    title: 'Responsive Profile Card',
    description: 'Build a profile card component with an avatar, name, bio, stats row, and social links. Make it responsive — side-by-side layout on desktop, stacked on mobile.',
    difficulty: 3,
    category: 'HTML/CSS/JS',
    xp_reward: 150,
    estimated_minutes: 25,
    instructions: 'Create a profile card that includes:\n1. A circular avatar placeholder\n2. Full name and a short bio\n3. A stats row showing: Posts, Followers, Following\n4. Social link buttons (at least 3)\n5. The card should be centered on the page\n6. Desktop: horizontal layout with avatar on left, info on right\n7. Mobile: stacked vertical layout',
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Card</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="profile-card">
    <div class="profile-avatar">
      <div class="avatar-placeholder">AC</div>
    </div>
    <div class="profile-info">
      <h2 class="profile-name">Alex Chen</h2>
      <p class="profile-bio">Full-stack developer passionate about building beautiful, functional web applications. Currently exploring the world of gamified learning platforms.</p>
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">248</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat">
          <span class="stat-value">1.2K</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat">
          <span class="stat-value">386</span>
          <span class="stat-label">Following</span>
        </div>
      </div>
      <div class="profile-links">
        <a href="#" class="social-link">GitHub</a>
        <a href="#" class="social-link">LinkedIn</a>
        <a href="#" class="social-link">Portfolio</a>
      </div>
    </div>
  </div>
</body>
</html>`
      },
      {
        name: 'style.css',
        language: 'css',
        content: `/* Add your styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a0a0f;
  color: #f1f5f9;
}

/* TODO: Style the profile card with responsive layout */
/* Desktop: flex row, Mobile: flex column */`
      }
    ],
    test_cases: [
      {
        id: 'tc-8-1',
        description: 'Profile card should exist with class "profile-card"',
        expected_output: 'exists',
        type: 'structure',
        selector: '.profile-card'
      },
      {
        id: 'tc-8-2',
        description: 'Avatar placeholder should exist',
        expected_output: 'exists',
        type: 'structure',
        selector: '.avatar-placeholder'
      },
      {
        id: 'tc-8-3',
        description: 'Stats row should have 3 stat items',
        expected_output: '3',
        type: 'structure',
        selector: '.stat'
      }
    ],
    hints: [
      'Use flex-direction: row on desktop, flex-direction: column on mobile',
      'Avatar can be a div with border-radius: 50% and fixed width/height',
      'Stats should use flexbox with justify-content: space-around',
      'Add a media query at 600px to switch layout',
      'Use gap for spacing between elements'
    ],
    solution_hint: '.profile-card: display flex, flex-direction column (mobile first). At 600px breakpoint, switch to flex-direction row. Avatar gets fixed width, info gets flex: 1.',
    prerequisites: ['challenge-4']
  },

  // Idagdag ito sa loob ng challenges array sa codingChallengeData.ts

{
  id: 'challenge-sql-1',
  title: 'SQL Select High Earners',
  description: 'Write an SQL query to retrieve all students who have earned more than 1000 XP.',
  difficulty: 1,
  category: 'Database',
  xp_reward: 50,
  estimated_minutes: 10,
  instructions: 'Write a query to select all columns from the `students` table where `total_xp` is greater than 1000.',

  files: [
  {
    name: 'query.sql',
    language: 'sql',
    content: `-- Write your SQL query below
-- Select all students with total_xp greater than 1000

`
  }
  ],
  test_cases: [
    {
      id: 'tc-sql-1-1',
      description: 'Query should include SELECT statement',
      expected_output: 'SELECT',
      type: 'sql'
    },
    {
      id: 'tc-sql-1-2',
      description: 'Query should target the students table',
      expected_output: 'FROM students',
      type: 'sql'
    },
    {
      id: 'tc-sql-1-3',
      description: 'Query should filter total_xp > 1000',
      expected_output: 'WHERE total_xp > 1000',
      type: 'sql'
    }
  ],
  hints: [
    'Use the SELECT keyword to fetch data.',
    'Use the FROM clause to specify the students table.',
    'Use the WHERE clause to filter total_xp > 1000.'
  ],
  solution_hint: 'SELECT * FROM students WHERE total_xp > 1000;',
  prerequisites: []
},
{
  id: 'challenge-sql-2',
  title: 'SQL Insert New Student',
  description: 'Learn how to insert new records into a database table.',
  difficulty: 1,
  category: 'Database',
  xp_reward: 60,
  estimated_minutes: 10,
  instructions: 'Write an INSERT INTO statement to add a student named "Maria Santos" with 500 total_xp into the `students` table.',
  
  files: [
  {
    name: 'query.sql',
    language: 'sql',
    content: `-- Write your INSERT query below
-- Insert 'Maria Santos' with 500 total_xp into the students table

`
  }
  ],
  test_cases: [
    {
      id: 'tc-sql-2-1',
      description: 'Query should include INSERT INTO statement',
      expected_output: 'INSERT INTO',
      type: 'sql'
    },
    {
      id: 'tc-sql-2-2',
      description: 'Query should target the students table',
      expected_output: 'students',
      type: 'sql'
    },
    {
      id: 'tc-sql-2-3',
      description: 'Query should use VALUES clause',
      expected_output: 'VALUES',
      type: 'sql'
    }
  ],
  hints: [
    'Syntax: INSERT INTO table_name (column1, column2) VALUES (value1, value2);',
    'Make sure string values like names are wrapped in quotes.'
  ],
  solution_hint: "INSERT INTO students (full_name, total_xp) VALUES ('Maria Santos', 500);",
  prerequisites: ['challenge-sql-1']
},
{
  id: 'challenge-sql-3',
  title: 'SQL Inner Join Quests',
  description: 'Retrieve student names alongside their completed quest titles.',
  difficulty: 2,
  category: 'Database',
  xp_reward: 100,
  estimated_minutes: 15,
  instructions: 'Write a query that performs an INNER JOIN between `students` and `quests` using `student_id`. Select `full_name` and `quest_title`.',
 
  files: [
  {
    name: 'query.sql',
    language: 'sql',
    content: `-- Write your INNER JOIN query below

`
  }

  ],
  test_cases: [
    {
      id: 'tc-sql-3-1',
      description: 'Query should perform an INNER JOIN',
      expected_output: 'INNER JOIN',
      type: 'sql'
    },
    {
      id: 'tc-sql-3-2',
      description: 'Query should join the quests table',
      expected_output: 'JOIN quests',
      type: 'sql'
    },
    {
      id: 'tc-sql-3-3',
      description: 'Query should include ON condition',
      expected_output: 'ON',
      type: 'sql'
    }
  ],
  hints: [
    'Use INNER JOIN to combine rows from both tables.',
    'Use the ON keyword to specify the foreign key matching condition.'
  ],
  solution_hint: 'SELECT students.full_name, quests.title FROM students INNER JOIN quests ON students.id = quests.student_id;',
  prerequisites: ['challenge-sql-1']
}
]
