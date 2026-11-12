// Extended content blocks for the Backend Developer track.
// Each export is layered into the matching lesson inside lessonData.ts so the
// main lesson file stays focused and under control as content grows.

export const backend1Extras = [
  { type: 'heading', content: 'Where Backend Logic Actually Lives' },
  { type: 'text', content: 'It helps to picture the backend as the part of an application that users never see directly. When someone taps "Log in", the browser does not check the password itself. It sends the credentials to the backend, which verifies them against stored data and decides what the user is allowed to do next. The same is true for placing an order, loading a social feed, or streaming a video: the frontend asks, and the backend answers.' },
  { type: 'text', content: 'A single user action can trigger many backend responsibilities at once: validating the request, checking who the user is, reading or writing data, applying business rules, and finally shaping a response the frontend can render.' },
  { type: 'code', language: 'text', content: 'Browser (client)\n   |  HTTP request: POST /api/login\n   v\nNode.js server\n   |-- validate input\n   |-- look up user in the database\n   |-- verify password hash\n   |-- create a session or token\n   v\nHTTP response: 200 OK { token: "..." }\n   |\n   v\nBrowser stores the token and renders the dashboard' },
  { type: 'heading', content: 'The Request-Response Lifecycle Step by Step' },
  { type: 'list', items: [
    'The client opens a connection and sends an HTTP request (method, path, headers, optional body)',
    'The server parses the request and matches it to a route handler',
    'Middleware runs first — logging, authentication, parsing, validation',
    'The route handler executes business logic and talks to the database',
    'The server builds a response with a status code, headers, and a body',
    'The client receives the response and updates the user interface'
  ] },
  { type: 'heading', content: 'Stateless vs. Stateful Communication' },
  { type: 'text', content: 'HTTP is a stateless protocol, which means the server does not automatically remember anything about a client between requests. If an application needs continuity, such as remembering a logged-in user, that continuity has to be carried explicitly, usually with a token or session identifier sent on every request. Understanding this is the key to building APIs that scale across many servers.' },
  { type: 'heading', content: 'Real-World Example: A "Get My Quests" Request' },
  { type: 'text', content: 'Here is a small but realistic handler. It reads the requested category from the query string, looks up data, and returns a consistent JSON envelope the frontend can rely on.' },
  { type: 'code', language: 'javascript', content: 'const http = require("http");\n\nconst server = http.createServer((req, res) => {\n  const url = new URL(req.url, "http://localhost");\n\n  if (url.pathname === "/api/quests" && req.method === "GET") {\n    const category = url.searchParams.get("category") || "all";\n    const quests = [{ id: 1, title: "Learn Node.js", category: "backend" }];\n\n    res.writeHead(200, { "Content-Type": "application/json" });\n    res.end(JSON.stringify({ success: true, category, data: quests }));\n    return;\n  }\n\n  res.writeHead(404, { "Content-Type": "application/json" });\n  res.end(JSON.stringify({ success: false, error: "Route not found" }));\n});\n\nserver.listen(3000);' },
  { type: 'heading', content: 'Common Mistakes and Gotchas' },
  { type: 'list', items: [
    'Blocking the event loop with heavy synchronous work — this freezes every other request',
    'Forgetting to send a response, which leaves the client waiting until it times out',
    'Sending more than one response for a single request, which throws a headers-already-sent error',
    'Trusting client input without validating types, lengths, and formats',
    'Hard-coding ports and secrets instead of reading them from the environment',
    'Ignoring error cases such as missing records and returning 200 anyway'
  ] },
  { type: 'heading', content: 'Extending Your First Server' },
  { type: 'text', content: 'Try adding a second route that returns a single quest by ID, and return a proper 404 when the ID does not exist. Small exercises like this build the muscle memory used throughout the rest of the track.' },
  { type: 'code', language: 'javascript', content: 'const quests = [\n  { id: 1, title: "Learn Node.js" },\n  { id: 2, title: "Build an API" }\n];\n\napp.get("/api/quests/:id", (req, res) => {\n  const quest = quests.find((q) => q.id === Number(req.params.id));\n\n  if (!quest) {\n    return res.status(404).json({ success: false, error: "Quest not found" });\n  }\n\n  res.json({ success: true, data: quest });\n});' }
];

export const backend2Extras = [
  { type: 'heading', content: 'Modeling Real-World Resources' },
  { type: 'text', content: 'Good REST design starts long before any code is written. Ask what nouns the system manages and how they relate. A learning platform has users, courses, lessons, enrollments, and submissions. Each noun becomes a resource with its own URL, and the relationships decide which routes are nested.' },
  { type: 'code', language: 'javascript', content: '// Resource map for a learning platform\n\nusers            -> /api/users\ncourses          -> /api/courses\nlessons          -> /api/lessons\nenrollments      -> /api/enrollments\n\n// Relationships become nesting\nGET  /api/courses/12/lessons        // lessons inside a course\nGET  /api/users/42/enrollments      // courses a user is enrolled in\n\n// Keep nesting shallow — one or two levels is usually enough\n// Prefer /api/enrollments?userId=42 over /api/users/42/courses/12/enrollments/99' },
  { type: 'heading', content: 'Safe, Unsafe, and Idempotent Methods' },
  { type: 'text', content: 'Two properties describe how an HTTP method behaves. A method is safe if it does not change server data. A method is idempotent if calling it many times produces the same result as calling it once. These properties matter for caching, retries, and reliability.' },
  { type: 'list', items: [
    'GET — safe and idempotent: reads data, never modifies it',
    'HEAD — safe and idempotent: like GET but without a response body',
    'PUT — not safe but idempotent: replaces a resource, so repeating it leaves the same result',
    'DELETE — not safe but idempotent: deleting an already-deleted resource still ends in the same state',
    'POST — neither safe nor idempotent: usually creates a new resource on every call',
    'PATCH — not safe and not guaranteed idempotent: applies a partial update'
  ] },
  { type: 'text', content: 'Because PUT and DELETE are idempotent, clients and proxies can safely retry them after a network failure. Because POST is not, a retried create can accidentally produce duplicate records, which is why real systems sometimes use an idempotency key.' },
  { type: 'heading', content: 'Designing Consistent Error Responses' },
  { type: 'text', content: 'Clients handle errors far more easily when every endpoint speaks the same error shape. Decide on one format and use it everywhere, including the status code, a machine-readable code, and a human-readable message.' },
  { type: 'code', language: 'javascript', content: '// One error shape for the entire API\nfunction errorResponse(res, status, code, message) {\n  return res.status(status).json({\n    success: false,\n    error: { code, message }\n  });\n}\n\n// Usage inside a route\nif (!user) {\n  return errorResponse(res, 404, "USER_NOT_FOUND", "No user matches that id");\n}\n\nif (!isValidEmail(email)) {\n  return errorResponse(res, 422, "INVALID_EMAIL", "Email format is not valid");\n}' },
  { type: 'heading', content: 'Pagination, Filtering and Sorting in Practice' },
  { type: 'text', content: 'Collections should almost never be returned in full. Unbounded growth is invisible during development and painful in production, so give every list endpoint a sensible default page size and an upper limit.' },
  { type: 'code', language: 'javascript', content: 'app.get("/api/quests", (req, res) => {\n  const page = Math.max(1, parseInt(req.query.page, 10) || 1);\n  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);\n  const sort = req.query.sort === "xp" ? "xp" : "createdAt";\n\n  const start = (page - 1) * limit;\n  const data = allQuests\n    .sort((a, b) => (a[sort] > b[sort] ? 1 : -1))\n    .slice(start, start + limit);\n\n  res.json({\n    success: true,\n    data,\n    pagination: { page, limit, total: allQuests.length, pages: Math.ceil(allQuests.length / limit) }\n  });\n});' },
  { type: 'heading', content: 'Common REST Design Mistakes' },
  { type: 'list', items: [
    'Putting verbs in URLs such as /getUsers or /createQuest — the method already expresses the action',
    'Returning 200 OK for errors, which forces clients to inspect the body to detect failure',
    'Using singular collection names like /user when the endpoint returns many users',
    'Mixing naming styles, such as /get_all_users next to /quests',
    'Exposing internal database column names directly as API field names',
    'Breaking existing clients whenever the API changes instead of versioning'
  ] },
  { type: 'heading', content: 'Walkthrough: Evolving a Users API' },
  { type: 'text', content: 'Watch how a resource grows from a single endpoint into a well-rounded API while keeping the same conventions throughout.' },
  { type: 'code', language: 'javascript', content: '// v1 — the essentials\nGET    /api/v1/users\nPOST   /api/v1/users\nGET    /api/v1/users/:id\n\n// The collection gains capabilities through query parameters\nGET    /api/v1/users?role=student&sort=-createdAt&page=2&limit=25\n\n// A new capability is added as a sub-resource, not a new verb\nPOST   /api/v1/users/:id/activate\nPOST   /api/v1/users/:id/deactivate\n\n// A breaking change ships under a new version instead of mutating v1\nPOST   /api/v2/users' }
];

export const backend3Extras = [
  { type: 'heading', content: 'The Event Loop and Non-Blocking I/O' },
  { type: 'text', content: 'Node.js runs JavaScript on a single main thread, yet it can serve thousands of concurrent requests. It achieves this with an event loop: when code starts a slow operation such as reading a file or querying a database, Node hands that work off and continues handling other requests. When the operation finishes, its callback is queued back onto the main thread.' },
  { type: 'code', language: 'javascript', content: 'const fs = require("fs");\n\n// Blocking: nothing else runs until the file is fully read\nconst data = fs.readFileSync("data.json", "utf8");\n\n// Non-blocking: the event loop keeps serving other requests meanwhile\nfs.readFile("data.json", "utf8", (err, data) => {\n  if (err) return console.error(err);\n  console.log("File loaded");\n});\n\nconsole.log("This line runs before the file finishes loading");' },
  { type: 'text', content: 'A useful rule of thumb: any CPU-heavy or synchronous work in a request handler slows down every other user on that process. Prefer asynchronous APIs, and move genuinely heavy computation elsewhere.' },
  { type: 'heading', content: 'How Middleware Order Changes Behavior' },
  { type: 'text', content: 'Middleware runs top to bottom. If a middleware sends a response and does not call next(), the chain stops there. Ordering is not cosmetic — placing authentication middleware after a route means that route is effectively unprotected.' },
  { type: 'code', language: 'javascript', content: 'const express = require("express");\nconst app = express();\n\n// 1. Parsing runs for every request\napp.use(express.json());\n\n// 2. Logging runs next\napp.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next();\n});\n\n// 3. Authentication only applies where it is mounted\nconst requireAuth = (req, res, next) => {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ error: "Unauthorized" });\n  }\n  next();\n};\n\n// Protected route — middleware sits before the handler\napp.get("/api/profile", requireAuth, (req, res) => {\n  res.json({ user: "Alex" });\n});\n\n// Public route — no auth middleware\napp.get("/api/health", (req, res) => {\n  res.json({ status: "ok" });\n});' },
  { type: 'heading', content: 'Real-World Example: A Logged, Validated, Authenticated Route' },
  { type: 'text', content: 'Production routes are rarely a single function. They are a pipeline of small, focused middlewares followed by the handler. Each piece does one job, which makes the whole route easier to test and reason about.' },
  { type: 'code', language: 'javascript', content: 'const validateQuest = (req, res, next) => {\n  const { title } = req.body;\n  if (!title || title.length < 3) {\n    return res.status(422).json({ error: "title must be at least 3 characters" });\n  }\n  next();\n};\n\napp.post(\n  "/api/quests",\n  logRequest,\n  requireAuth,\n  validateQuest,\n  (req, res) => {\n    res.status(201).json({ success: true, data: { id: 1, title: req.body.title } });\n  }\n);' },
  { type: 'heading', content: 'Handling Async Errors Correctly' },
  { type: 'text', content: 'A promise that rejects inside an async handler will not automatically reach your error middleware in every Express version. Wrap async handlers so failures are forwarded properly instead of hanging the request.' },
  { type: 'code', language: 'javascript', content: '// A small helper that forwards async errors to next()\nconst asyncHandler = (fn) => (req, res, next) => {\n  Promise.resolve(fn(req, res, next)).catch(next);\n};\n\napp.get("/api/quests/:id", asyncHandler(async (req, res) => {\n  const quest = await findQuestById(req.params.id);\n  if (!quest) {\n    return res.status(404).json({ error: "Quest not found" });\n  }\n  res.json({ success: true, data: quest });\n}));\n\n// Central error handler — always registered last\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: "Internal server error" });\n});' },
  { type: 'heading', content: 'Common Express Mistakes and Gotchas' },
  { type: 'list', items: [
    'Registering the error-handling middleware before your routes, so it never runs',
    'Forgetting express.json(), which leaves req.body undefined for JSON requests',
    'Reading req.params values as strings and comparing them to numbers without converting',
    'Leaking stack traces to clients by sending err directly in the response',
    'Mounting a router at the wrong path, which silently shifts every route inside it',
    'Calling next() after already sending a response, which triggers a headers-already-sent error'
  ] },
  { type: 'heading', content: 'Structuring an Express Project for Growth' },
  { type: 'text', content: 'A single file works for a demo but collapses quickly. Splitting routes, controllers, and services keeps responsibilities clear as the application grows.' },
  { type: 'code', language: 'text', content: 'src/\n  app.js              # creates the Express app and middleware\n  server.js           # starts the HTTP server\n  routes/\n    quests.js         # route definitions only\n  controllers/\n    questController.js  # request handling logic\n  services/\n    questService.js     # business rules and data access\n  middleware/\n    auth.js\n    validate.js' }
];

export const backend4Extras = [
  { type: 'heading', content: 'Choosing the Right HTTP Method' },
  { type: 'text', content: 'Choosing the correct method is not just style — clients, proxies, and browsers all rely on method semantics for caching, retries, and safety guarantees.' },
  { type: 'list', items: [
    'GET — retrieve a resource or collection, never modify state',
    'POST — create a new resource, or trigger a non-idempotent action',
    'PUT — replace a resource completely with the provided representation',
    'PATCH — update only the fields included in the request',
    'DELETE — remove a resource',
    'HEAD and OPTIONS — metadata and capability discovery'
  ] },
  { type: 'heading', content: 'Real-World Example: A Course Enrollment API' },
  { type: 'text', content: 'Enrollment is a great example because it involves a relationship between two resources. Modeling the join as its own resource keeps the API predictable and avoids awkward nested routes.' },
  { type: 'code', language: 'javascript', content: 'const express = require("express");\nconst router = express.Router();\n\nlet enrollments = [];\n\n// List enrollments, optionally filtered by user\nrouter.get("/", (req, res) => {\n  const { userId } = req.query;\n  const result = userId\n    ? enrollments.filter((e) => e.userId === Number(userId))\n    : enrollments;\n  res.json({ success: true, data: result });\n});\n\n// Create an enrollment\nrouter.post("/", (req, res) => {\n  const { userId, courseId } = req.body;\n  if (!userId || !courseId) {\n    return res.status(400).json({ error: "userId and courseId are required" });\n  }\n  const exists = enrollments.some((e) => e.userId === userId && e.courseId === courseId);\n  if (exists) {\n    return res.status(409).json({ error: "Already enrolled in this course" });\n  }\n  const enrollment = { id: enrollments.length + 1, userId, courseId, progress: 0 };\n  enrollments.push(enrollment);\n  res.status(201).json({ success: true, data: enrollment });\n});\n\n// Update progress with a partial update\nrouter.patch("/:id", (req, res) => {\n  const enrollment = enrollments.find((e) => e.id === Number(req.params.id));\n  if (!enrollment) {\n    return res.status(404).json({ error: "Enrollment not found" });\n  }\n  Object.assign(enrollment, req.body);\n  res.json({ success: true, data: enrollment });\n});\n\nmodule.exports = router;' },
  { type: 'heading', content: 'Validating and Normalizing Input' },
  { type: 'text', content: 'Validation checks that input is acceptable; normalization makes it consistent. Doing both early keeps every downstream function simpler and prevents subtle bugs such as duplicate records that differ only in letter case.' },
  { type: 'code', language: 'javascript', content: 'function validateQuestPayload(body) {\n  const errors = [];\n\n  if (typeof body.title !== "string" || body.title.trim().length < 3) {\n    errors.push("title must be a string of at least 3 characters");\n  }\n\n  if (body.xp != null && (!Number.isInteger(body.xp) || body.xp < 0)) {\n    errors.push("xp must be a positive integer");\n  }\n\n  return errors;\n}\n\nfunction normalizeQuest(body) {\n  return {\n    title: body.title.trim(),\n    category: (body.category || "general").toLowerCase(),\n    xp: body.xp ?? 0\n  };\n}' },
  { type: 'heading', content: 'Caching with ETags and Conditional Requests' },
  { type: 'text', content: 'For read-heavy endpoints, HTTP caching can dramatically reduce load. An ETag is a fingerprint of a resource; a client can send it back, and if nothing changed the server replies with 304 Not Modified instead of resending the full payload.' },
  { type: 'code', language: 'javascript', content: 'app.get("/api/quests/:id", (req, res) => {\n  const quest = findQuestById(req.params.id);\n  if (!quest) return res.status(404).json({ error: "Not found" });\n\n  const etag = String(quest.updatedAt);\n  if (req.headers["if-none-match"] === etag) {\n    return res.status(304).end();\n  }\n\n  res.set("ETag", etag);\n  res.set("Cache-Control", "private, max-age=60");\n  res.json({ success: true, data: quest });\n});' },
  { type: 'heading', content: 'Common REST API Mistakes' },
  { type: 'list', items: [
    'Returning different status codes for the same failure across endpoints',
    'Accepting PATCH payloads that overwrite fields the client did not send',
    'Forgetting that DELETE should be safe to repeat without crashing',
    'Skipping input normalization, which allows near-duplicate records',
    'Returning the entire database row including sensitive columns',
    'Never adding cache headers, so clients re-fetch data that has not changed'
  ] },
  { type: 'heading', content: 'Testing Endpoints in Seconds' },
  { type: 'text', content: 'You do not need a full test suite to sanity-check an API. A quick request from the terminal or a small fetch script is often enough to confirm a route behaves as expected.' },
  { type: 'code', language: 'bash', content: '# List quests with a query filter\ncurl "http://localhost:3000/api/quests?category=frontend"\n\n# Create a quest with a JSON body\ncurl -X POST http://localhost:3000/api/quests \\\n  -H "Content-Type: application/json" \\\n  -d \'{"title":"Learn REST","xp":90}\'' }
];

export const backend5Extras = [
  { type: 'heading', content: 'Designing Tables That Age Well' },
  { type: 'text', content: 'A schema is a long-term commitment. Thinking about relationships up front, such as one-to-many and many-to-many, saves painful migrations later. The goal of normalization is to store each fact in exactly one place so updates never create contradictions.' },
  { type: 'code', language: 'sql', content: '-- Users, courses, and a many-to-many enrollment table\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(120) UNIQUE NOT NULL,\n  created_at TIMESTAMP NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE courses (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(200) NOT NULL,\n  instructor_id INT REFERENCES users(id) ON DELETE SET NULL\n);\n\n-- The join table carries its own attributes (progress, enrolled_at)\nCREATE TABLE enrollments (\n  id SERIAL PRIMARY KEY,\n  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,\n  progress INT NOT NULL DEFAULT 0,\n  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),\n  UNIQUE (user_id, course_id)\n);' },
  { type: 'heading', content: 'Transactions and the ACID Guarantee' },
  { type: 'text', content: 'A transaction groups several statements so they succeed or fail as a unit. This is essential whenever one logical action touches multiple tables: if the second statement fails, the first should not leave the database in a half-finished state.' },
  { type: 'code', language: 'sql', content: 'BEGIN;\n\nINSERT INTO users (username, email)\nVALUES (\'alex\', \'alex@example.com\')\nRETURNING id;\n\n-- If the next statement fails, the whole block can be rolled back\nINSERT INTO enrollments (user_id, course_id)\nVALUES (1, 42);\n\nCOMMIT;\n-- or ROLLBACK; on failure' },
  { type: 'heading', content: 'Aggregations and Grouping' },
  { type: 'text', content: 'Real applications constantly answer questions such as how many students are in each course. Aggregation functions and GROUP BY make these answers cheap once the pattern is familiar.' },
  { type: 'code', language: 'sql', content: '-- Count enrollments per course, then filter with HAVING\nSELECT\n  courses.title,\n  COUNT(enrollments.id) AS student_count,\n  AVG(enrollments.progress) AS avg_progress\nFROM courses\nLEFT JOIN enrollments ON enrollments.course_id = courses.id\nGROUP BY courses.id, courses.title\nHAVING COUNT(enrollments.id) > 0\nORDER BY student_count DESC;' },
  { type: 'heading', content: 'Real-World Example: Answering a Product Question' },
  { type: 'text', content: 'Suppose the product team asks which categories have the highest average XP reward and how many quests each contains. A single grouped query answers both parts at once.' },
  { type: 'code', language: 'sql', content: 'SELECT\n  category,\n  COUNT(*) AS quest_count,\n  ROUND(AVG(xp_reward), 1) AS avg_xp\nFROM quests\nWHERE is_active = true\nGROUP BY category\nORDER BY avg_xp DESC;' },
  { type: 'heading', content: 'Reading Query Plans with EXPLAIN' },
  { type: 'text', content: 'When a query feels slow, do not guess — measure. EXPLAIN shows how PostgreSQL intends to run a statement, including whether it uses an index or scans the whole table.' },
  { type: 'code', language: 'sql', content: 'EXPLAIN ANALYZE\nSELECT * FROM enrollments\nWHERE user_id = 42;\n\n-- Look for "Seq Scan" (scans the whole table) versus\n-- "Index Scan" (uses an index). Add an index when you see a repeated\n-- Seq Scan on a column that is filtered or joined frequently.' },
  { type: 'heading', content: 'Common SQL Mistakes and Gotchas' },
  { type: 'list', items: [
    'Using SELECT * in production queries, which pulls more data than needed and breaks when columns change',
    'Storing dates or numbers as text, which makes comparisons and sorting unreliable',
    'Forgetting indexes on foreign key columns, which slows joins as data grows',
    'Building queries by concatenating strings, which opens the door to SQL injection',
    'Assuming NULL equals NULL — use IS NULL and IS NOT NULL instead',
    'Updating or deleting without a WHERE clause, which affects every row'
  ] }
];

export const backend6Extras = [
  { type: 'heading', content: 'The Complete Registration and Login Flow' },
  { type: 'text', content: 'Authentication makes more sense when viewed end to end. Registration hashes the password and stores the user. Login verifies the password and issues a token. Every later request presents that token, and middleware verifies it before the route runs.' },
  { type: 'code', language: 'javascript', content: 'const express = require("express");\nconst bcrypt = require("bcrypt");\nconst jwt = require("jsonwebtoken");\nconst app = express();\n\napp.use(express.json());\nconst SECRET = process.env.JWT_SECRET;\n\n// Register\napp.post("/api/register", async (req, res) => {\n  const { email, password } = req.body;\n  const hashed = await bcrypt.hash(password, 10);\n  const user = await createUser({ email, password: hashed });\n  res.status(201).json({ success: true, data: { id: user.id, email: user.email } });\n});\n\n// Login\napp.post("/api/login", async (req, res) => {\n  const { email, password } = req.body;\n  const user = await findUserByEmail(email);\n\n  // Use the same message for both failures so the response does not reveal\n  // whether an account exists for that email\n  if (!user || !(await bcrypt.compare(password, user.password))) {\n    return res.status(401).json({ error: "Invalid credentials" });\n  }\n\n  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: "1h" });\n  res.json({ success: true, data: { token } });\n});' },
  { type: 'heading', content: 'Access Tokens vs. Refresh Tokens' },
  { type: 'text', content: 'Short-lived access tokens limit the damage if one is stolen, but they force users to log in often. The common solution is a pair: a short-lived access token used on every request and a longer-lived refresh token used only to obtain new access tokens.' },
  { type: 'code', language: 'javascript', content: 'function issueTokens(user) {\n  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });\n  const refreshToken = jwt.sign({ userId: user.id, type: "refresh" }, process.env.REFRESH_SECRET, { expiresIn: "7d" });\n  return { accessToken, refreshToken };\n}\n\napp.post("/api/refresh", (req, res) => {\n  const { refreshToken } = req.body;\n  try {\n    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);\n    const accessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });\n    res.json({ success: true, data: { accessToken } });\n  } catch (err) {\n    res.status(401).json({ error: "Refresh token is invalid or expired" });\n  }\n});' },
  { type: 'heading', content: 'Real-World Example: Role-Based Access Control' },
  { type: 'text', content: 'Authenticating a user is only half the job. Authorization decides what that user may do. A small role-checking middleware keeps this logic reusable across many routes.' },
  { type: 'code', language: 'javascript', content: 'function authorize(...allowedRoles) {\n  return (req, res, next) => {\n    if (!req.user) {\n      return res.status(401).json({ error: "Authentication required" });\n    }\n    if (!allowedRoles.includes(req.user.role)) {\n      return res.status(403).json({ error: "You do not have permission to do this" });\n    }\n    next();\n  };\n}\n\n// Only instructors and admins may create courses\napp.post("/api/courses", authenticateToken, authorize("instructor", "admin"), createCourse);' },
  { type: 'heading', content: 'Common Authentication Mistakes' },
  { type: 'list', items: [
    'Storing passwords as plain text or with a fast, unsalted hash',
    'Putting secrets such as the JWT signing key directly in source code',
    'Returning different errors for unknown email and wrong password, which reveals which accounts exist',
    'Issuing tokens that never expire',
    'Trusting a role value sent by the client instead of reading it from the verified token',
    'Building custom crypto instead of using established, reviewed libraries'
  ] },
  { type: 'heading', content: 'Debugging Auth Problems' },
  { type: 'list', items: [
    'A 401 usually means the token is missing, malformed, or expired',
    'A 403 usually means the token is valid but the user lacks permission',
    'Log the decoded payload (never the raw secret) to confirm the expected claims are present',
    'Verify the Authorization header literally starts with "Bearer " followed by a space',
    'Check that the same secret is used for both signing and verifying the token'
  ] }
];

export const backend7Extras = [
  { type: 'heading', content: 'Hardening a Registration Endpoint End to End' },
  { type: 'text', content: 'Security is most convincing when it is assembled. This handler combines body size limits, schema validation, safe password handling, and a response that does not reveal internal detail.' },
  { type: 'code', language: 'javascript', content: 'const express = require("express");\nconst helmet = require("helmet");\nconst bcrypt = require("bcrypt");\nconst { z } = require("zod");\n\nconst app = express();\napp.use(helmet());\napp.use(express.json({ limit: "100kb" }));\n\nconst schema = z.object({\n  email: z.string().email(),\n  password: z.string().min(12).max(128)\n});\n\napp.post("/api/register", async (req, res) => {\n  const parsed = schema.safeParse(req.body);\n  if (!parsed.success) {\n    return res.status(422).json({ error: "Invalid input" });\n  }\n\n  const hashed = await bcrypt.hash(parsed.data.password, 12);\n  await createUser({ email: parsed.data.email, password: hashed });\n\n  res.status(201).json({ success: true });\n});' },
  { type: 'heading', content: 'Rate Limiting and Payload Limits' },
  { type: 'text', content: 'Even a correct endpoint can be abused through repetition. Rate limiting slows brute-force and scraping attempts, while request size limits stop oversized payloads from exhausting memory.' },
  { type: 'code', language: 'javascript', content: 'const rateLimit = require("express-rate-limit");\n\nconst loginLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 10,\n  standardHeaders: true,\n  message: { error: "Too many attempts, please try again later" }\n});\n\napp.post("/api/login", loginLimiter, loginHandler);\n\n// Reject oversized JSON bodies early\napp.use(express.json({ limit: "100kb" }));' },
  { type: 'heading', content: 'Real-World Example: Catching an Injection Attempt' },
  { type: 'text', content: 'Injection happens when untrusted input is treated as code. The fix is never to filter bad characters — it is to keep data and code separate so input can never change the meaning of a query.' },
  { type: 'code', language: 'javascript', content: '// Dangerous: input is concatenated into the query text\nconst email = req.query.email; // e.g. \' OR 1=1 --\nconst sql = "SELECT * FROM users WHERE email = \'" + email + "\'";\n\n// Safe: the driver sends the query and values separately,\n// so the value is always treated as data\nconst result = await db.query(\n  "SELECT id, email FROM users WHERE email = $1",\n  [email]\n);' },
  { type: 'heading', content: 'Managing Secrets Safely' },
  { type: 'list', items: [
    'Keep secrets in environment variables, never in source files',
    'Add .env to .gitignore so credentials are not committed',
    'Rotate keys immediately if one is ever exposed',
    'Give each environment (development, staging, production) its own credentials',
    'Use a secrets manager for production instead of a plain file on a server'
  ] },
  { type: 'heading', content: 'Returning Errors Without Leaking Internals' },
  { type: 'text', content: 'Detailed errors are useful in logs and dangerous in responses. Send a short, safe message to the client, and keep the stack trace on the server where developers can read it.' },
  { type: 'code', language: 'javascript', content: 'app.use((err, req, res, next) => {\n  // Full detail goes to the server log only\n  console.error(err.stack);\n\n  // The client receives a generic message\n  res.status(err.status || 500).json({\n    success: false,\n    error: { code: err.code || "INTERNAL_ERROR", message: "Something went wrong" }\n  });\n});' },
  { type: 'heading', content: 'Common Backend Security Mistakes' },
  { type: 'list', items: [
    'Trusting client-side validation as if it were server-side validation',
    'Building SQL or shell commands from raw user input',
    'Leaking stack traces, internal paths, or database errors in responses',
    'Disabling HTTPS in production or failing to enforce it',
    'Skipping security headers such as Content-Security-Policy and X-Content-Type-Options',
    'Logging sensitive data such as passwords and full tokens'
  ] }
];

export const backend8Extras = [
  { type: 'heading', content: 'The Production Readiness Checklist' },
  { type: 'list', items: [
    'Set NODE_ENV=production so libraries skip expensive development checks',
    'Load all configuration from environment variables, with sensible defaults',
    'Return generic error messages to clients while logging details on the server',
    'Enable gzip compression for text-based responses',
    'Add a health check endpoint for load balancers and orchestrators',
    'Ship structured logs and basic metrics so problems are visible',
    'Automate the build and deploy so releases are repeatable'
  ] },
  { type: 'heading', content: 'Real-World Example: A Simple CI/CD Pipeline' },
  { type: 'text', content: 'A continuous integration pipeline runs tests on every push and only deploys when they pass. This turns deployment from a risky manual event into a routine, repeatable step.' },
  { type: 'code', language: 'yaml', content: 'name: deploy\non:\n  push:\n    branches: [main]\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm test\n      - run: npm run build\n' },
  { type: 'heading', content: 'Scaling Across CPU Cores' },
  { type: 'text', content: 'Node.js uses one main thread, so a single process uses only one CPU core. The built-in cluster module can fork a worker per core, letting the operating system spread traffic across them.' },
  { type: 'code', language: 'javascript', content: 'const cluster = require("cluster");\nconst os = require("os");\n\nif (cluster.isPrimary) {\n  const cores = os.cpus().length;\n  for (let i = 0; i < cores; i += 1) {\n    cluster.fork();\n  }\n\n  cluster.on("exit", (worker) => {\n    console.log("Worker " + worker.process.pid + " exited, restarting");\n    cluster.fork();\n  });\n} else {\n  require("./server");\n}' },
  { type: 'heading', content: 'Health Checks, Logging and Monitoring' },
  { type: 'text', content: 'In production a debugger usually is not available, so you rely on signals. A health endpoint tells the platform whether the process is alive, and structured logs let you reconstruct what happened.' },
  { type: 'code', language: 'javascript', content: 'app.get("/health", async (req, res) => {\n  try {\n    await db.query("SELECT 1");\n    res.json({ status: "ok", uptime: process.uptime() });\n  } catch (err) {\n    res.status(503).json({ status: "degraded" });\n  }\n});\n\n// Structured logging makes logs searchable\nfunction logRequest(req, res, next) {\n  const start = Date.now();\n  res.on("finish", () => {\n    console.log(JSON.stringify({\n      method: req.method,\n      path: req.path,\n      status: res.statusCode,\n      ms: Date.now() - start\n    }));\n  });\n  next();\n}' },
  { type: 'heading', content: 'Zero-Downtime Deployments' },
  { type: 'text', content: 'Restarting a single server drops in-flight requests. Real deployments run more than one instance and roll updates out gradually: start a new instance, wait for its health check to pass, then retire the old one. Because HTTP is stateless, any instance can handle any request as long as shared state lives in the database or a cache.' },
  { type: 'heading', content: 'Common Deployment Mistakes' },
  { type: 'list', items: [
    'Committing .env files or credentials to the repository',
    'Deploying without running tests, so broken builds reach users',
    'Exposing stack traces because NODE_ENV is not set to production',
    'Assuming a single process can use every CPU core',
    'Skipping a health check, so a crashed instance keeps receiving traffic',
    'Forgetting to update dependencies, leaving known vulnerabilities in production'
  ] }
];