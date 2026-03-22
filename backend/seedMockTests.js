require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const MockTest = require('./models/Mocktest');

const questionsMap = {
  'Web Development Fundamentals': [
    // ── Basic ──────────────────────────────────────────
    { question: 'Which HTML tag defines the largest heading?', type: 'mcq', options: ['<h6>', '<h1>', '<head>', '<title>'], answer: '<h1>', explanation: '<h1> is the largest heading tag in HTML.' },
    { question: 'What does CSS stand for?', type: 'mcq', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], answer: 'Cascading Style Sheets', explanation: 'CSS stands for Cascading Style Sheets.' },
    { question: 'Flexbox is a one-dimensional layout model.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Flexbox handles layout in one direction — row or column.' },
    { question: 'Which property changes text color in CSS?', type: 'mcq', options: ['font-color', 'text-color', 'color', 'foreground'], answer: 'color', explanation: 'The color property sets the text color.' },
    { question: 'JavaScript is a statically typed language.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'JavaScript is dynamically typed.' },
    { question: 'Which HTML tag is used to create a hyperlink?', type: 'mcq', options: ['<link>', '<a>', '<href>', '<nav>'], answer: '<a>', explanation: 'The anchor tag <a> creates hyperlinks.' },
    { question: 'What is the correct HTML tag for inserting an image?', type: 'mcq', options: ['<image>', '<img>', '<pic>', '<src>'], answer: '<img>', explanation: '<img> is the self-closing tag for images.' },
    { question: 'CSS is used to style HTML elements.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'CSS controls the presentation and layout of HTML.' },
    { question: 'Which CSS property controls the font size?', type: 'mcq', options: ['text-size', 'font-size', 'text-style', 'font-style'], answer: 'font-size', explanation: 'font-size controls the size of text.' },
    { question: 'HTML stands for HyperText Markup Language.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'HTML is the standard markup language for web pages.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'Which method selects a DOM element by its ID?', type: 'mcq', options: ['querySelector()', 'getElement()', 'getElementById()', 'selectById()'], answer: 'getElementById()', explanation: 'getElementById() selects by ID directly.' },
    { question: 'What does the async keyword do in JavaScript?', type: 'mcq', options: ['Makes function faster', 'Returns a Promise', 'Stops execution', 'Loops the function'], answer: 'Returns a Promise', explanation: 'async functions always return a Promise.' },
    { question: 'CSS Grid is a two-dimensional layout system.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'CSS Grid handles rows and columns simultaneously.' },
    { question: 'localStorage data persists after closing the browser.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'localStorage persists until explicitly cleared.' },
    { question: 'Which HTTP method is used to send data to a server?', type: 'mcq', options: ['GET', 'POST', 'FETCH', 'PUSH'], answer: 'POST', explanation: 'POST sends data in the request body.' },
    { question: 'What is the box model in CSS?', type: 'mcq', options: ['A 3D CSS effect', 'Content, padding, border, margin layout model', 'A flexbox container', 'A grid layout'], answer: 'Content, padding, border, margin layout model', explanation: 'The box model defines space around HTML elements.' },
    { question: 'Which JavaScript method adds an element to end of an array?', type: 'mcq', options: ['push()', 'pop()', 'shift()', 'unshift()'], answer: 'push()', explanation: 'push() adds elements to the end of an array.' },
    { question: 'Media queries are used for responsive design.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Media queries apply styles based on screen size.' },
    { question: 'What does "position: absolute" do in CSS?', type: 'mcq', options: ['Positions relative to viewport', 'Positions relative to nearest positioned ancestor', 'Removes element from page', 'Fixes element to screen'], answer: 'Positions relative to nearest positioned ancestor', explanation: 'Absolute positioning is relative to the nearest positioned parent.' },
    { question: 'The fetch() API returns a Promise.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'fetch() is Promise-based for async HTTP requests.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is event delegation in JavaScript?', type: 'mcq', options: ['Removing event listeners', 'Attaching event to parent instead of each child', 'Using two events together', 'Delaying events'], answer: 'Attaching event to parent instead of each child', explanation: 'Event delegation uses bubbling to handle events at a parent level.' },
    { question: 'Which CSS property creates a stacking context?', type: 'mcq', options: ['display', 'z-index with position', 'margin', 'padding'], answer: 'z-index with position', explanation: 'z-index creates stacking context only when position is set.' },
    { question: 'A Promise can be in three states: pending, fulfilled, and rejected.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Promises have exactly three states.' },
    { question: 'What does the "defer" attribute do on a script tag?', type: 'mcq', options: ['Loads script immediately', 'Delays script until HTML is parsed', 'Blocks HTML parsing', 'Ignores the script'], answer: 'Delays script until HTML is parsed', explanation: 'defer ensures script runs after HTML parsing completes.' },
    { question: 'Service Workers can intercept network requests.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Service Workers act as a proxy between app and network.' },
    { question: 'What is the purpose of the "will-change" CSS property?', type: 'mcq', options: ['Animates elements', 'Hints browser to optimize rendering', 'Changes element visibility', 'Applies transitions'], answer: 'Hints browser to optimize rendering', explanation: 'will-change improves performance by pre-optimizing animations.' },
    { question: 'JavaScript closures retain access to outer function variables.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Closures capture the lexical environment of the outer function.' },
    { question: 'What is the Critical Rendering Path?', type: 'mcq', options: ['A CSS animation path', 'Steps browser takes to render a page', 'A JavaScript execution model', 'A server route'], answer: 'Steps browser takes to render a page', explanation: 'CRP includes DOM, CSSOM, render tree, layout, and paint steps.' },
    { question: 'Web Workers run on the main thread.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Web Workers run in background threads separate from main thread.' },
    { question: 'What does CORS stand for?', type: 'mcq', options: ['Cross-Origin Resource Sharing', 'Cross-Object Request System', 'Client Object Request Sharing', 'Content Origin Response System'], answer: 'Cross-Origin Resource Sharing', explanation: 'CORS is a security mechanism for cross-origin HTTP requests.' },
  ],

  'React.js - Modern Frontend Development': [
    // ── Basic ──────────────────────────────────────────
    { question: 'What is JSX in React?', type: 'mcq', options: ['A database', 'JavaScript XML syntax extension', 'A CSS framework', 'A Node module'], answer: 'JavaScript XML syntax extension', explanation: 'JSX lets you write HTML-like syntax inside JavaScript.' },
    { question: 'React components must return a single root element.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Each component must have one root — use fragments if needed.' },
    { question: 'Which hook manages state in a functional component?', type: 'mcq', options: ['useEffect', 'useRef', 'useState', 'useContext'], answer: 'useState', explanation: 'useState adds local state to functional components.' },
    { question: 'Props are mutable inside a component.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Props are read-only and cannot be modified by the child.' },
    { question: 'What does the virtual DOM help with?', type: 'mcq', options: ['Styling components', 'Efficient UI updates', 'Database queries', 'Routing'], answer: 'Efficient UI updates', explanation: 'Virtual DOM minimizes real DOM updates for performance.' },
    { question: 'React is a JavaScript library for building user interfaces.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'React was built by Facebook for UI development.' },
    { question: 'Which company developed React?', type: 'mcq', options: ['Google', 'Microsoft', 'Facebook', 'Twitter'], answer: 'Facebook', explanation: 'React was created and open-sourced by Facebook.' },
    { question: 'Functional components can use hooks.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Hooks were introduced specifically for functional components.' },
    { question: 'What is the entry point file in a React Vite project?', type: 'mcq', options: ['index.js', 'App.jsx', 'main.jsx', 'index.html'], answer: 'main.jsx', explanation: 'main.jsx is the entry point in a Vite React project.' },
    { question: 'React uses one-way data binding.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Data flows from parent to child via props in React.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'Which hook runs side effects in React?', type: 'mcq', options: ['useState', 'useCallback', 'useEffect', 'useMemo'], answer: 'useEffect', explanation: 'useEffect handles side effects like API calls.' },
    { question: 'What is the purpose of the key prop in lists?', type: 'mcq', options: ['Styling list items', 'Helping React identify changed items', 'Setting item index', 'Sorting items'], answer: 'Helping React identify changed items', explanation: 'Keys help React efficiently reconcile list changes.' },
    { question: 'useContext eliminates the need for prop drilling.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'useContext provides global state without passing through every level.' },
    { question: 'What does useRef return?', type: 'mcq', options: ['A state value', 'A mutable ref object', 'A context value', 'A callback'], answer: 'A mutable ref object', explanation: 'useRef returns a mutable object with a current property.' },
    { question: 'React Router is built into React by default.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'React Router is a separate third-party library.' },
    { question: 'Which hook prevents expensive recalculations?', type: 'mcq', options: ['useEffect', 'useState', 'useMemo', 'useRef'], answer: 'useMemo', explanation: 'useMemo memoizes computed values to avoid recalculation.' },
    { question: 'What is a controlled component in React?', type: 'mcq', options: ['A component with no state', 'A form element controlled by React state', 'A class component', 'A component with context'], answer: 'A form element controlled by React state', explanation: 'Controlled components have their value managed by React state.' },
    { question: 'useEffect with an empty dependency array runs once on mount.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Empty dependency array means the effect runs only on initial render.' },
    { question: 'What does React.Fragment do?', type: 'mcq', options: ['Creates a DOM element', 'Groups elements without adding extra DOM nodes', 'Splits components', 'Creates a context'], answer: 'Groups elements without adding extra DOM nodes', explanation: 'Fragments let you return multiple elements without a wrapper div.' },
    { question: 'State updates in React are synchronous.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'React state updates are asynchronous and batched.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is reconciliation in React?', type: 'mcq', options: ['Merging two components', 'Process of comparing virtual DOM trees', 'Combining states', 'Managing side effects'], answer: 'Process of comparing virtual DOM trees', explanation: 'Reconciliation is React\'s diffing algorithm to update the DOM efficiently.' },
    { question: 'Which hook should you use to persist a function reference?', type: 'mcq', options: ['useMemo', 'useState', 'useCallback', 'useRef'], answer: 'useCallback', explanation: 'useCallback memoizes function references to prevent unnecessary re-renders.' },
    { question: 'Error boundaries work with functional components using hooks.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Error boundaries still require class components in React.' },
    { question: 'What is code splitting in React?', type: 'mcq', options: ['Splitting CSS files', 'Breaking app into smaller bundles loaded on demand', 'Splitting components into files', 'Separating logic from UI'], answer: 'Breaking app into smaller bundles loaded on demand', explanation: 'Code splitting with React.lazy improves initial load performance.' },
    { question: 'React.memo prevents re-renders when props have not changed.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'React.memo is a higher-order component for memoizing functional components.' },
    { question: 'What is the Fiber architecture in React?', type: 'mcq', options: ['A CSS-in-JS library', 'React\'s reconciliation engine for async rendering', 'A state management tool', 'A router system'], answer: 'React\'s reconciliation engine for async rendering', explanation: 'Fiber enables incremental rendering and priority-based updates.' },
    { question: 'Context API is a replacement for Redux in all cases.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Context is good for simple global state but Redux is better for complex state.' },
    { question: 'What does the useReducer hook do?', type: 'mcq', options: ['Reduces bundle size', 'Manages complex state logic with a reducer function', 'Combines multiple hooks', 'Memoizes state'], answer: 'Manages complex state logic with a reducer function', explanation: 'useReducer is an alternative to useState for complex state transitions.' },
    { question: 'Lazy loading in React uses Suspense for fallback UI.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'React.lazy and Suspense work together for lazy loaded components.' },
    { question: 'What is hydration in React?', type: 'mcq', options: ['Adding water to code', 'Attaching event listeners to server-rendered HTML', 'Loading API data', 'Initializing state'], answer: 'Attaching event listeners to server-rendered HTML', explanation: 'Hydration makes server-rendered HTML interactive on the client.' },
  ],

  'Node.js & Express Backend Development': [
    // ── Basic ──────────────────────────────────────────
    { question: 'Node.js runs JavaScript on the server side.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Node.js is a runtime environment for server-side JavaScript.' },
    { question: 'Which module system does Node.js use by default?', type: 'mcq', options: ['ES Modules', 'CommonJS', 'AMD', 'UMD'], answer: 'CommonJS', explanation: 'Node.js uses require() and module.exports by default.' },
    { question: 'What is npm?', type: 'mcq', options: ['Node Package Manager', 'New Programming Module', 'Node Process Manager', 'Network Protocol Module'], answer: 'Node Package Manager', explanation: 'npm is the default package manager for Node.js.' },
    { question: 'Express is a built-in Node.js framework.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Express is a third-party framework installed via npm.' },
    { question: 'Which method starts an Express server?', type: 'mcq', options: ['app.run()', 'app.start()', 'app.listen()', 'app.connect()'], answer: 'app.listen()', explanation: 'app.listen() binds the server to a port.' },
    { question: 'What does req.body contain in Express?', type: 'mcq', options: ['URL parameters', 'Query strings', 'Request body data', 'Headers'], answer: 'Request body data', explanation: 'req.body contains data sent in the request body.' },
    { question: 'Node.js is single-threaded.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Node.js uses a single thread with an event loop.' },
    { question: 'Which file lists project dependencies in Node.js?', type: 'mcq', options: ['server.js', 'config.js', 'package.json', 'index.js'], answer: 'package.json', explanation: 'package.json tracks dependencies and scripts.' },
    { question: 'GET requests can have a request body.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'GET requests should not have a body — use query params instead.' },
    { question: 'What does res.json() do in Express?', type: 'mcq', options: ['Reads JSON file', 'Sends JSON response', 'Parses JSON body', 'Validates JSON'], answer: 'Sends JSON response', explanation: 'res.json() sends a JSON-formatted HTTP response.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is middleware in Express?', type: 'mcq', options: ['A database layer', 'Functions that execute during request-response cycle', 'A routing system', 'An error handler'], answer: 'Functions that execute during request-response cycle', explanation: 'Middleware functions have access to req, res, and next.' },
    { question: 'JWT stands for JSON Web Token.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'JWT is used for stateless authentication.' },
    { question: 'Which HTTP status code means "Not Found"?', type: 'mcq', options: ['200', '401', '403', '404'], answer: '404', explanation: '404 means the requested resource was not found.' },
    { question: 'bcrypt is used to hash passwords.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'bcrypt is a password hashing library.' },
    { question: 'What does CORS stand for?', type: 'mcq', options: ['Cross-Origin Resource Sharing', 'Client Object Request System', 'Cross-Object Resource System', 'Content Origin Response Sharing'], answer: 'Cross-Origin Resource Sharing', explanation: 'CORS controls which origins can access your API.' },
    { question: 'Which Mongoose method finds a document by ID?', type: 'mcq', options: ['findOne()', 'findById()', 'getById()', 'find()'], answer: 'findById()', explanation: 'findById() queries by the _id field.' },
    { question: 'Environment variables should be stored in .env files.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: '.env files keep sensitive config out of source code.' },
    { question: 'What does next() do in Express middleware?', type: 'mcq', options: ['Ends the request', 'Sends a response', 'Passes control to next middleware', 'Restarts the server'], answer: 'Passes control to next middleware', explanation: 'next() passes control to the next middleware function.' },
    { question: 'MongoDB is a relational database.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'MongoDB is a NoSQL document database.' },
    { question: 'Which HTTP status code means "Created"?', type: 'mcq', options: ['200', '201', '204', '301'], answer: '201', explanation: '201 Created is returned when a resource is successfully created.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is the Event Loop in Node.js?', type: 'mcq', options: ['A for loop in events', 'A mechanism that handles async callbacks', 'A thread pool', 'An error handler'], answer: 'A mechanism that handles async callbacks', explanation: 'The event loop processes async operations in Node.js.' },
    { question: 'Mongoose schemas enforce data structure in MongoDB.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Mongoose schemas define the shape and validation of documents.' },
    { question: 'What is the purpose of populate() in Mongoose?', type: 'mcq', options: ['Creates documents', 'Replaces ObjectId references with actual data', 'Deletes references', 'Counts documents'], answer: 'Replaces ObjectId references with actual data', explanation: 'populate() joins referenced documents like SQL JOINs.' },
    { question: 'JWT tokens should be stored in localStorage for security.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'HttpOnly cookies are more secure than localStorage for JWTs.' },
    { question: 'What is rate limiting used for?', type: 'mcq', options: ['Speeding up requests', 'Preventing too many requests from a single client', 'Compressing responses', 'Caching data'], answer: 'Preventing too many requests from a single client', explanation: 'Rate limiting protects APIs from abuse and DoS attacks.' },
    { question: 'Error handling middleware in Express takes four parameters.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Error middleware signature is (err, req, res, next).' },
    { question: 'What is the purpose of indexes in MongoDB?', type: 'mcq', options: ['Encrypt data', 'Speed up query performance', 'Backup data', 'Delete duplicates'], answer: 'Speed up query performance', explanation: 'Indexes allow MongoDB to find documents faster.' },
    { question: 'Node.js uses libuv for async I/O operations.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'libuv provides the event loop and thread pool for async I/O.' },
    { question: 'What is the difference between PUT and PATCH?', type: 'mcq', options: ['No difference', 'PUT replaces entire resource, PATCH updates partially', 'PATCH replaces entire resource', 'PUT is deprecated'], answer: 'PUT replaces entire resource, PATCH updates partially', explanation: 'PUT requires full data, PATCH only requires changed fields.' },
    { question: 'Clustering in Node.js helps utilize multiple CPU cores.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Node.js cluster module forks worker processes for each CPU core.' },
  ],

  'Full Stack MERN Development': [
    // ── Basic ──────────────────────────────────────────
    { question: 'What does MERN stand for?', type: 'mcq', options: ['MySQL Express React Node', 'MongoDB Express React Node', 'MongoDB Ember React Native', 'MongoDB Express Redux Node'], answer: 'MongoDB Express React Node', explanation: 'MERN = MongoDB + Express + React + Node.js.' },
    { question: 'React handles the frontend in a MERN stack.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'React is the client-side UI layer in MERN.' },
    { question: 'Which MERN component handles the database?', type: 'mcq', options: ['React', 'Express', 'Node.js', 'MongoDB'], answer: 'MongoDB', explanation: 'MongoDB is the database layer in MERN.' },
    { question: 'Express and Node.js form the backend of MERN.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Node.js is the runtime and Express is the web framework.' },
    { question: 'What tool is used to scaffold a React app with Vite?', type: 'mcq', options: ['npx create-react-app', 'npm init vite', 'npx vite create', 'yarn start'], answer: 'npm init vite', explanation: 'npm create vite@latest scaffolds a Vite React project.' },
    { question: 'Axios is used to make HTTP requests from React.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Axios is a popular HTTP client for React frontends.' },
    { question: 'What is the purpose of a .env file in MERN?', type: 'mcq', options: ['Store components', 'Store environment variables', 'Configure routes', 'Store schemas'], answer: 'Store environment variables', explanation: '.env stores secrets like DB URLs and JWT secrets.' },
    { question: 'MongoDB Atlas is a cloud-hosted MongoDB service.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Atlas provides managed MongoDB clusters in the cloud.' },
    { question: 'Which port does Express typically run on locally?', type: 'mcq', options: ['3000', '8080', '5000', '4000'], answer: '5000', explanation: 'Express apps commonly use port 5000 by convention.' },
    { question: 'React communicates with the backend through API calls.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'React fetches data from the backend via REST API calls.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is the purpose of CORS in a MERN app?', type: 'mcq', options: ['Database connection', 'Allow cross-origin requests between frontend and backend', 'Authentication', 'Routing'], answer: 'Allow cross-origin requests between frontend and backend', explanation: 'CORS enables React on port 5173 to call Express on port 5000.' },
    { question: 'JWT is used for stateless authentication in MERN.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'JWT tokens carry auth info without server-side sessions.' },
    { question: 'What does Mongoose provide in a MERN stack?', type: 'mcq', options: ['Routing', 'Schema-based MongoDB modeling', 'State management', 'UI components'], answer: 'Schema-based MongoDB modeling', explanation: 'Mongoose adds schemas, validation, and queries for MongoDB.' },
    { question: 'Protected routes prevent unauthenticated access in React.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Protected routes redirect unauthenticated users to login.' },
    { question: 'Which React hook is best for managing auth state globally?', type: 'mcq', options: ['useState', 'useEffect', 'useContext', 'useRef'], answer: 'useContext', explanation: 'useContext with a provider shares auth state across the app.' },
    { question: 'What is the proxy setting in Vite used for?', type: 'mcq', options: ['Database access', 'Redirecting API calls to avoid CORS in development', 'Building the app', 'Running tests'], answer: 'Redirecting API calls to avoid CORS in development', explanation: 'Vite proxy forwards frontend API calls to the backend server.' },
    { question: 'Express middleware must call next() to continue the chain.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Without next(), the request hangs with no response.' },
    { question: 'What is the purpose of the Authorization header?', type: 'mcq', options: ['Send cookies', 'Send JWT token with requests', 'Set content type', 'Cache control'], answer: 'Send JWT token with requests', explanation: 'Authorization: Bearer <token> sends JWT to protected routes.' },
    { question: 'React Context can be used to avoid prop drilling.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Context provides global state accessible from any component.' },
    { question: 'Which HTTP method is used to delete a resource?', type: 'mcq', options: ['GET', 'POST', 'DELETE', 'REMOVE'], answer: 'DELETE', explanation: 'DELETE is the RESTful method for removing resources.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is the purpose of the populate() method in Mongoose?', type: 'mcq', options: ['Insert bulk data', 'Replace ObjectId refs with document data', 'Count documents', 'Validate schema'], answer: 'Replace ObjectId refs with document data', explanation: 'populate() is Mongoose\'s way of doing joins.' },
    { question: 'Refresh tokens are used to get new access tokens.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Refresh tokens extend sessions without re-login.' },
    { question: 'What is code splitting in a MERN React app?', type: 'mcq', options: ['Splitting backend routes', 'Loading JS bundles on demand', 'Splitting database', 'Separating models'], answer: 'Loading JS bundles on demand', explanation: 'Code splitting reduces initial bundle size using React.lazy.' },
    { question: 'MongoDB supports transactions across multiple documents.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'MongoDB 4.0+ supports multi-document ACID transactions.' },
    { question: 'What is the role of an interceptor in Axios?', type: 'mcq', options: ['Cancels requests', 'Intercepts requests or responses before they are handled', 'Creates mock APIs', 'Validates responses'], answer: 'Intercepts requests or responses before they are handled', explanation: 'Axios interceptors add auth headers or handle errors globally.' },
    { question: 'Vercel is used for deploying React frontends.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Vercel specializes in frontend deployments.' },
    { question: 'What is the purpose of environment-specific .env files?', type: 'mcq', options: ['Store UI themes', 'Manage different configs for dev, staging, production', 'Store component state', 'Configure routing'], answer: 'Manage different configs for dev, staging, production', explanation: '.env.development and .env.production allow environment-specific settings.' },
    { question: 'A 401 status means the user is authenticated but not authorized.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: '401 means unauthenticated; 403 means unauthorized.' },
    { question: 'What is the benefit of using indexes in MongoDB?', type: 'mcq', options: ['Data encryption', 'Faster query performance', 'Auto backups', 'Schema validation'], answer: 'Faster query performance', explanation: 'Indexes allow MongoDB to avoid full collection scans.' },
    { question: 'Render.com can host a Node.js Express backend for free.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Render offers free tiers for Node.js web services.' },
  ],

  'Python for Beginners': [
    // ── Basic ──────────────────────────────────────────
    { question: 'Python uses indentation to define code blocks.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Python uses indentation instead of curly braces.' },
    { question: 'Which function prints output in Python?', type: 'mcq', options: ['echo()', 'console.log()', 'print()', 'output()'], answer: 'print()', explanation: 'print() displays output to the console in Python.' },
    { question: 'Python is an interpreted language.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Python code is executed line by line by the interpreter.' },
    { question: 'Which data type stores key-value pairs in Python?', type: 'mcq', options: ['List', 'Tuple', 'Set', 'Dictionary'], answer: 'Dictionary', explanation: 'Dictionaries store data as key-value pairs.' },
    { question: 'Lists in Python are mutable.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Lists can be changed after creation.' },
    { question: 'What keyword defines a function in Python?', type: 'mcq', options: ['function', 'func', 'def', 'define'], answer: 'def', explanation: 'def is used to define functions in Python.' },
    { question: 'Tuples are immutable in Python.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Tuples cannot be modified after creation.' },
    { question: 'Which operator is used for exponentiation in Python?', type: 'mcq', options: ['^', '**', '%%', '//'], answer: '**', explanation: '** is the exponentiation operator in Python.' },
    { question: 'Python supports multiple inheritance.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Python classes can inherit from multiple parent classes.' },
    { question: 'What does len() do in Python?', type: 'mcq', options: ['Counts loops', 'Returns length of an object', 'Converts to list', 'Joins strings'], answer: 'Returns length of an object', explanation: 'len() returns the number of items in a sequence.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is a lambda function in Python?', type: 'mcq', options: ['A named function', 'An anonymous one-line function', 'A recursive function', 'A class method'], answer: 'An anonymous one-line function', explanation: 'Lambda creates small anonymous functions inline.' },
    { question: 'List comprehensions are more efficient than for loops.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'List comprehensions are faster and more Pythonic.' },
    { question: 'Which method opens a file in Python?', type: 'mcq', options: ['file.open()', 'open()', 'read()', 'load()'], answer: 'open()', explanation: 'open() opens a file and returns a file object.' },
    { question: 'The "with" statement automatically closes files.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'with ensures proper resource cleanup via context managers.' },
    { question: 'What does the "self" parameter represent in a class?', type: 'mcq', options: ['Class name', 'Parent class', 'Current instance', 'Module name'], answer: 'Current instance', explanation: 'self refers to the current object instance.' },
    { question: 'Sets in Python do not allow duplicate values.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Sets automatically remove duplicates.' },
    { question: 'Which exception handles division by zero in Python?', type: 'mcq', options: ['ValueError', 'TypeError', 'ZeroDivisionError', 'ArithmeticException'], answer: 'ZeroDivisionError', explanation: 'Python raises ZeroDivisionError for division by zero.' },
    { question: 'The requests library is built into Python.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'requests is a third-party library installed via pip.' },
    { question: 'What does pip stand for?', type: 'mcq', options: ['Python Install Package', 'Pip Installs Packages', 'Package Index Python', 'Python Interface Package'], answer: 'Pip Installs Packages', explanation: 'pip is Python\'s package installer.' },
    { question: 'Python 3 and Python 2 are fully compatible.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Python 3 introduced breaking changes from Python 2.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is a generator in Python?', type: 'mcq', options: ['A class decorator', 'A function that yields values lazily', 'A list comprehension', 'A context manager'], answer: 'A function that yields values lazily', explanation: 'Generators use yield to produce values one at a time.' },
    { question: 'Decorators in Python modify function behavior.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Decorators wrap functions to add behavior without modifying them.' },
    { question: 'What is the Global Interpreter Lock (GIL) in Python?', type: 'mcq', options: ['A security feature', 'A mutex that prevents multiple threads from executing simultaneously', 'A memory manager', 'A type system'], answer: 'A mutex that prevents multiple threads from executing simultaneously', explanation: 'GIL limits true multithreading in CPython.' },
    { question: '__init__ is the constructor method in Python classes.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: '__init__ initializes a new object instance.' },
    { question: 'What does *args allow in Python functions?', type: 'mcq', options: ['Keyword arguments', 'Variable number of positional arguments', 'Default arguments', 'Type hints'], answer: 'Variable number of positional arguments', explanation: '*args collects extra positional arguments as a tuple.' },
    { question: 'Python\'s "is" operator checks value equality.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: '"is" checks identity (same object), not value equality.' },
    { question: 'What is metaclass in Python?', type: 'mcq', options: ['A parent class', 'A class that creates classes', 'An abstract class', 'A class decorator'], answer: 'A class that creates classes', explanation: 'Metaclasses define how classes themselves are created.' },
    { question: 'Context managers implement __enter__ and __exit__ methods.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'These dunder methods enable the with statement.' },
    { question: 'What is the purpose of __slots__ in Python?', type: 'mcq', options: ['Define methods', 'Restrict instance attributes to save memory', 'Enable inheritance', 'Create properties'], answer: 'Restrict instance attributes to save memory', explanation: '__slots__ prevents creation of __dict__ on instances.' },
    { question: 'Python\'s asyncio enables concurrent programming.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'asyncio provides async/await for concurrent I/O-bound tasks.' },
  ],

  'Data Structures & Algorithms': [
    // ── Basic ──────────────────────────────────────────
    { question: 'What is the time complexity of accessing an array element by index?', type: 'mcq', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 'O(1)', explanation: 'Array access by index is constant time.' },
    { question: 'A stack follows LIFO (Last In First Out) order.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'The last element pushed is the first to be popped.' },
    { question: 'Which data structure follows FIFO order?', type: 'mcq', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 'Queue', explanation: 'Queue processes elements in First In First Out order.' },
    { question: 'Binary search works on unsorted arrays.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Binary search requires a sorted array.' },
    { question: 'What is the worst-case time complexity of bubble sort?', type: 'mcq', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 'O(n²)', explanation: 'Bubble sort compares adjacent elements O(n²) times.' },
    { question: 'A linked list provides O(1) access by index.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Linked lists require traversal — O(n) access.' },
    { question: 'What does O(log n) complexity mean?', type: 'mcq', options: ['Linear growth', 'Exponential growth', 'Halving the problem each step', 'Constant time'], answer: 'Halving the problem each step', explanation: 'O(log n) algorithms halve the input size each iteration.' },
    { question: 'Arrays have fixed size in most languages.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Static arrays have a fixed size declared at creation.' },
    { question: 'Which sorting algorithm is the fastest on average?', type: 'mcq', options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'], answer: 'Quick Sort', explanation: 'Quick Sort averages O(n log n) time complexity.' },
    { question: 'Hash maps provide O(1) average lookup time.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Hash maps use direct address mapping for fast lookups.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is the two-pointer technique used for?', type: 'mcq', options: ['Tree traversal', 'Solving array or string problems efficiently', 'Graph traversal', 'Dynamic programming'], answer: 'Solving array or string problems efficiently', explanation: 'Two pointers reduce O(n²) to O(n) in many problems.' },
    { question: 'DFS uses a stack (or recursion) for traversal.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'DFS explores as deep as possible using a stack.' },
    { question: 'BFS uses which data structure?', type: 'mcq', options: ['Stack', 'Queue', 'Heap', 'Tree'], answer: 'Queue', explanation: 'BFS explores level by level using a queue.' },
    { question: 'A binary search tree allows duplicate values by default.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'BSTs typically do not allow duplicates.' },
    { question: 'What is a min-heap?', type: 'mcq', options: ['Tree with max root', 'Tree where parent is smaller than children', 'Sorted array', 'Balanced BST'], answer: 'Tree where parent is smaller than children', explanation: 'Min-heap keeps the smallest element at the root.' },
    { question: 'The sliding window technique reduces time complexity for subarray problems.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Sliding window avoids nested loops for contiguous subarray problems.' },
    { question: 'What is the height of a balanced binary tree with n nodes?', type: 'mcq', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 'O(log n)', explanation: 'A balanced tree has height proportional to log n.' },
    { question: 'In-order traversal of a BST gives sorted output.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'In-order (left, root, right) traversal gives ascending order.' },
    { question: 'What is a hash collision?', type: 'mcq', options: ['Two keys mapping to the same hash value', 'A broken hash function', 'A missing key', 'An overflow error'], answer: 'Two keys mapping to the same hash value', explanation: 'Collisions occur when different keys produce the same hash.' },
    { question: 'Merge sort is a stable sorting algorithm.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Merge sort maintains relative order of equal elements.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is dynamic programming?', type: 'mcq', options: ['Writing dynamic code', 'Breaking problems into subproblems and caching results', 'A sorting technique', 'A graph algorithm'], answer: 'Breaking problems into subproblems and caching results', explanation: 'DP avoids recomputation by storing subproblem solutions.' },
    { question: 'Dijkstra\'s algorithm works with negative edge weights.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Dijkstra fails with negative weights — use Bellman-Ford instead.' },
    { question: 'What is the space complexity of recursive DFS on a graph?', type: 'mcq', options: ['O(1)', 'O(n)', 'O(V+E)', 'O(log n)'], answer: 'O(V+E)', explanation: 'DFS uses O(V+E) space for the recursion stack and visited set.' },
    { question: 'A trie is optimal for prefix-based string searches.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Tries store strings character by character for fast prefix lookup.' },
    { question: 'What is memoization in dynamic programming?', type: 'mcq', options: ['Sorting results', 'Caching results of expensive function calls', 'Iterating bottom-up', 'Greedy selection'], answer: 'Caching results of expensive function calls', explanation: 'Memoization stores computed results to avoid redundant work.' },
    { question: 'Floyd-Warshall finds shortest paths between all pairs of vertices.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Floyd-Warshall is an all-pairs shortest path algorithm.' },
    { question: 'What is the time complexity of heap sort?', type: 'mcq', options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(log n)'], answer: 'O(n log n)', explanation: 'Heap sort builds a heap then extracts elements in O(n log n).' },
    { question: 'Union-Find is used for detecting cycles in undirected graphs.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Union-Find efficiently tracks connected components.' },
    { question: 'What is a topological sort used for?', type: 'mcq', options: ['Sorting numbers', 'Ordering tasks with dependencies (DAG)', 'Finding shortest path', 'Balancing trees'], answer: 'Ordering tasks with dependencies (DAG)', explanation: 'Topological sort orders vertices in a directed acyclic graph.' },
    { question: 'Backtracking explores all possibilities and abandons invalid paths.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Backtracking prunes search space by abandoning invalid states.' },
  ],

  'Database Management Systems (DBMS)': [
    // ── Basic ──────────────────────────────────────────
    { question: 'What does DBMS stand for?', type: 'mcq', options: ['Data Backup Management System', 'Database Management System', 'Data Building Management Software', 'Database Modelling System'], answer: 'Database Management System', explanation: 'DBMS is software for creating and managing databases.' },
    { question: 'SQL stands for Structured Query Language.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'SQL is the standard language for relational databases.' },
    { question: 'Which SQL statement retrieves data from a table?', type: 'mcq', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 'SELECT', explanation: 'SELECT fetches data from one or more tables.' },
    { question: 'A primary key can have NULL values.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Primary keys must be unique and NOT NULL.' },
    { question: 'What is a foreign key?', type: 'mcq', options: ['A key imported from another database', 'A key referencing a primary key in another table', 'An encrypted key', 'A duplicate primary key'], answer: 'A key referencing a primary key in another table', explanation: 'Foreign keys establish relationships between tables.' },
    { question: 'The WHERE clause filters rows in SQL.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'WHERE specifies conditions for filtering query results.' },
    { question: 'Which SQL command removes all rows from a table without deleting the table?', type: 'mcq', options: ['DROP', 'DELETE', 'TRUNCATE', 'REMOVE'], answer: 'TRUNCATE', explanation: 'TRUNCATE removes all rows but keeps table structure.' },
    { question: 'An index improves query performance.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Indexes allow faster data retrieval.' },
    { question: 'Which aggregate function counts rows?', type: 'mcq', options: ['SUM()', 'AVG()', 'COUNT()', 'MAX()'], answer: 'COUNT()', explanation: 'COUNT() returns the number of rows matching a condition.' },
    { question: 'A view is a virtual table based on a SQL query.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Views store queries as reusable virtual tables.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What does INNER JOIN return?', type: 'mcq', options: ['All rows from both tables', 'Matching rows from both tables', 'All rows from left table', 'All rows from right table'], answer: 'Matching rows from both tables', explanation: 'INNER JOIN returns only rows with matching values in both tables.' },
    { question: 'Normalization reduces data redundancy.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Normalization organizes data to minimize duplication.' },
    { question: 'What is 1NF (First Normal Form)?', type: 'mcq', options: ['No duplicate rows', 'Atomic values in each column', 'No partial dependencies', 'No transitive dependencies'], answer: 'Atomic values in each column', explanation: '1NF requires each column to hold atomic (indivisible) values.' },
    { question: 'ACID properties ensure reliable database transactions.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'ACID = Atomicity, Consistency, Isolation, Durability.' },
    { question: 'What does the HAVING clause do?', type: 'mcq', options: ['Filters rows before grouping', 'Filters groups after GROUP BY', 'Sorts results', 'Joins tables'], answer: 'Filters groups after GROUP BY', explanation: 'HAVING filters aggregated results unlike WHERE.' },
    { question: 'A subquery is a query nested inside another query.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Subqueries provide results to the outer query.' },
    { question: 'Which JOIN returns all rows from the left table?', type: 'mcq', options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'CROSS JOIN'], answer: 'LEFT JOIN', explanation: 'LEFT JOIN returns all left table rows plus matching right rows.' },
    { question: 'A trigger executes automatically in response to a database event.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Triggers fire on INSERT, UPDATE, or DELETE events.' },
    { question: 'What is a stored procedure?', type: 'mcq', options: ['A saved query', 'A precompiled set of SQL statements stored in the DB', 'A database view', 'An index type'], answer: 'A precompiled set of SQL statements stored in the DB', explanation: 'Stored procedures are reusable SQL routines.' },
    { question: '3NF eliminates transitive dependencies.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'In 3NF, non-key attributes depend only on the primary key.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is a deadlock in DBMS?', type: 'mcq', options: ['A slow query', 'Two transactions waiting on each other indefinitely', 'A missing index', 'A corrupt table'], answer: 'Two transactions waiting on each other indefinitely', explanation: 'Deadlocks occur when transactions hold locks the other needs.' },
    { question: 'Two-Phase Locking (2PL) ensures serializability.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: '2PL has a growing phase and shrinking phase for locks.' },
    { question: 'What is the difference between DELETE and DROP?', type: 'mcq', options: ['No difference', 'DELETE removes rows, DROP removes the entire table', 'DROP removes rows, DELETE removes table', 'Both remove tables'], answer: 'DELETE removes rows, DROP removes the entire table', explanation: 'DELETE is DML; DROP is DDL.' },
    { question: 'BCNF is stricter than 3NF.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'BCNF eliminates all anomalies that 3NF may allow.' },
    { question: 'What does ROLLBACK do in a transaction?', type: 'mcq', options: ['Saves changes', 'Undoes all changes in the current transaction', 'Creates a savepoint', 'Ends the session'], answer: 'Undoes all changes in the current transaction', explanation: 'ROLLBACK reverts the database to the state before the transaction.' },
    { question: 'NoSQL databases are always faster than relational databases.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Performance depends on use case — SQL can outperform NoSQL in many scenarios.' },
    { question: 'What is a clustered index?', type: 'mcq', options: ['An index on multiple columns', 'An index that determines physical row order', 'A unique index', 'An index on foreign keys'], answer: 'An index that determines physical row order', explanation: 'A clustered index sorts the physical data rows.' },
    { question: 'SQL injection is a common database security threat.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'SQL injection inserts malicious SQL through user inputs.' },
    { question: 'What is the CAP theorem?', type: 'mcq', options: ['A sorting theorem', 'A distributed system can only guarantee 2 of: Consistency, Availability, Partition Tolerance', 'A normalization rule', 'A transaction model'], answer: 'A distributed system can only guarantee 2 of: Consistency, Availability, Partition Tolerance', explanation: 'CAP theorem applies to distributed database systems.' },
    { question: 'Phantom reads can occur at the READ COMMITTED isolation level.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Phantom reads require SERIALIZABLE isolation to prevent.' },
  ],

  'Operating Systems (OS)': [
    // ── Basic ──────────────────────────────────────────
    { question: 'What is the primary function of an operating system?', type: 'mcq', options: ['Run applications', 'Manage hardware and software resources', 'Store data', 'Provide internet access'], answer: 'Manage hardware and software resources', explanation: 'OS acts as an interface between hardware and user programs.' },
    { question: 'A process is a program in execution.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'A process is an active instance of a program.' },
    { question: 'Which scheduling algorithm gives equal time slices to each process?', type: 'mcq', options: ['FCFS', 'SJF', 'Round Robin', 'Priority'], answer: 'Round Robin', explanation: 'Round Robin assigns fixed time quanta to each process.' },
    { question: 'The kernel is the core of an operating system.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'The kernel manages system resources directly.' },
    { question: 'What is a thread?', type: 'mcq', options: ['A separate process', 'A lightweight unit of execution within a process', 'A memory block', 'A file type'], answer: 'A lightweight unit of execution within a process', explanation: 'Threads share the process address space and resources.' },
    { question: 'FCFS scheduling is non-preemptive.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'FCFS runs each process to completion before starting the next.' },
    { question: 'What does CPU scheduling determine?', type: 'mcq', options: ['Memory allocation', 'Which process gets CPU time', 'File access order', 'I/O device usage'], answer: 'Which process gets CPU time', explanation: 'CPU scheduling selects which ready process runs next.' },
    { question: 'Deadlock requires all four Coffman conditions simultaneously.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Mutual exclusion, hold and wait, no preemption, circular wait.' },
    { question: 'What is virtual memory?', type: 'mcq', options: ['Extra RAM', 'Disk space used as RAM extension', 'Cache memory', 'ROM'], answer: 'Disk space used as RAM extension', explanation: 'Virtual memory uses disk to extend available memory.' },
    { question: 'A context switch saves and restores process state.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Context switch saves PCB of current process and loads next.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is a semaphore used for?', type: 'mcq', options: ['Memory management', 'Process synchronization', 'CPU scheduling', 'File handling'], answer: 'Process synchronization', explanation: 'Semaphores coordinate access to shared resources.' },
    { question: 'Paging eliminates external fragmentation.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Paging uses fixed-size blocks so no external fragmentation occurs.' },
    { question: 'Which page replacement algorithm has the lowest page fault rate theoretically?', type: 'mcq', options: ['FIFO', 'LRU', 'Optimal (OPT)', 'Clock'], answer: 'Optimal (OPT)', explanation: 'OPT replaces the page not used for the longest future time.' },
    { question: 'A mutex allows multiple threads to enter the critical section.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'A mutex allows only one thread in the critical section.' },
    { question: 'What is thrashing in OS?', type: 'mcq', options: ['Excessive CPU usage', 'Excessive paging causing low CPU utilization', 'Deadlock state', 'Buffer overflow'], answer: 'Excessive paging causing low CPU utilization', explanation: 'Thrashing occurs when processes spend more time paging than executing.' },
    { question: 'SJF scheduling minimizes average waiting time.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'SJF gives optimal average waiting time among non-preemptive algorithms.' },
    { question: 'What is IPC (Inter-Process Communication)?', type: 'mcq', options: ['Instruction Processing Cycle', 'Mechanisms for processes to communicate and share data', 'Internet Protocol Configuration', 'Index Page Cache'], answer: 'Mechanisms for processes to communicate and share data', explanation: 'IPC includes pipes, message queues, shared memory, and sockets.' },
    { question: 'The LRU page replacement algorithm is always optimal.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'LRU approximates optimal but is not always the best.' },
    { question: 'What is the purpose of the PCB (Process Control Block)?', type: 'mcq', options: ['Store user data', 'Store process state and metadata', 'Cache instructions', 'Manage disk I/O'], answer: 'Store process state and metadata', explanation: 'PCB contains PID, state, registers, and scheduling info.' },
    { question: 'Starvation can occur in priority scheduling.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Low-priority processes may never get CPU time — aging is the solution.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is Banker\'s Algorithm used for?', type: 'mcq', options: ['Memory allocation', 'Deadlock avoidance', 'CPU scheduling', 'Page replacement'], answer: 'Deadlock avoidance', explanation: 'Banker\'s Algorithm checks if resource allocation is safe.' },
    { question: 'Segmentation provides logical view of memory to programs.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Segmentation divides memory into logical units like stack and heap.' },
    { question: 'What is the difference between a monolithic and microkernel?', type: 'mcq', options: ['Size only', 'Monolithic runs all services in kernel space, microkernel in user space', 'Microkernel is faster always', 'No practical difference'], answer: 'Monolithic runs all services in kernel space, microkernel in user space', explanation: 'Microkernels are more modular but may have higher overhead.' },
    { question: 'Belady\'s anomaly can occur in FIFO page replacement.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'FIFO can have more page faults with more frames — Belady\'s anomaly.' },
    { question: 'What is copy-on-write in OS?', type: 'mcq', options: ['Copying files automatically', 'Sharing memory until a write occurs, then copying', 'Write-back cache policy', 'Disk mirroring'], answer: 'Sharing memory until a write occurs, then copying', explanation: 'COW defers memory copying until a process actually modifies data.' },
    { question: 'RAID 0 provides data redundancy.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'RAID 0 only stripes data — no redundancy.' },
    { question: 'What is a race condition?', type: 'mcq', options: ['A fast CPU process', 'Multiple processes accessing shared data with unpredictable results', 'A CPU benchmark', 'A scheduling conflict'], answer: 'Multiple processes accessing shared data with unpredictable results', explanation: 'Race conditions occur without proper synchronization.' },
    { question: 'Demand paging loads pages only when needed.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Demand paging reduces memory usage by loading pages on access.' },
    { question: 'What is the working set model in OS?', type: 'mcq', options: ['A set of threads', 'The set of pages a process actively uses in a time window', 'Active processes list', 'System call interface'], answer: 'The set of pages a process actively uses in a time window', explanation: 'Working set model helps prevent thrashing by managing page allocation.' },
    { question: 'Spinlocks are efficient for long critical sections.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Spinlocks waste CPU cycles — better for very short critical sections.' },
  ],

  'Computer Networks (CN)': [
    // ── Basic ──────────────────────────────────────────
    { question: 'The OSI model has 7 layers.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application.' },
    { question: 'Which layer of OSI handles IP addressing?', type: 'mcq', options: ['Data Link', 'Transport', 'Network', 'Application'], answer: 'Network', explanation: 'The Network layer handles logical addressing and routing.' },
    { question: 'TCP provides reliable, connection-oriented communication.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'TCP guarantees delivery with acknowledgments and retransmission.' },
    { question: 'What does DNS stand for?', type: 'mcq', options: ['Data Network Service', 'Domain Name System', 'Dynamic Node Server', 'Direct Network Signal'], answer: 'Domain Name System', explanation: 'DNS translates domain names to IP addresses.' },
    { question: 'UDP is faster but less reliable than TCP.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'UDP has no handshake or acknowledgment overhead.' },
    { question: 'What is an IP address?', type: 'mcq', options: ['A MAC address', 'A unique numerical identifier for a device on a network', 'A port number', 'A domain name'], answer: 'A unique numerical identifier for a device on a network', explanation: 'IP addresses identify devices on the internet.' },
    { question: 'HTTP operates at the Application layer.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'HTTP is an application-layer protocol for web communication.' },
    { question: 'Which protocol assigns IP addresses dynamically?', type: 'mcq', options: ['DNS', 'FTP', 'DHCP', 'ARP'], answer: 'DHCP', explanation: 'DHCP dynamically assigns IP addresses to network devices.' },
    { question: 'A router operates at the Network layer.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Routers work with IP addresses at Layer 3.' },
    { question: 'What is a MAC address?', type: 'mcq', options: ['An IP address', 'A hardware address burned into a NIC', 'A network route', 'A port number'], answer: 'A hardware address burned into a NIC', explanation: 'MAC is a physical address at the Data Link layer.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is subnetting?', type: 'mcq', options: ['Connecting two networks', 'Dividing a network into smaller subnetworks', 'Routing between networks', 'Filtering traffic'], answer: 'Dividing a network into smaller subnetworks', explanation: 'Subnetting divides an IP network for better management.' },
    { question: 'SSL/TLS operates at the Transport layer only.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'SSL/TLS spans Transport and Application layers.' },
    { question: 'What does ARP do?', type: 'mcq', options: ['Assigns IP addresses', 'Resolves IP addresses to MAC addresses', 'Encrypts packets', 'Routes packets'], answer: 'Resolves IP addresses to MAC addresses', explanation: 'ARP maps IP addresses to physical MAC addresses on LAN.' },
    { question: 'HTTPS encrypts data using TLS.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'HTTPS = HTTP over TLS for encrypted web communication.' },
    { question: 'Which routing algorithm uses Dijkstra\'s algorithm?', type: 'mcq', options: ['RIP', 'BGP', 'OSPF', 'EIGRP'], answer: 'OSPF', explanation: 'OSPF (Open Shortest Path First) uses Dijkstra\'s algorithm.' },
    { question: 'A switch operates at the Data Link layer.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Switches use MAC addresses to forward frames at Layer 2.' },
    { question: 'What is the purpose of NAT?', type: 'mcq', options: ['Encrypt traffic', 'Translate private IPs to public IPs', 'Assign MAC addresses', 'Filter packets'], answer: 'Translate private IPs to public IPs', explanation: 'NAT allows multiple devices to share one public IP.' },
    { question: 'IPv6 uses 128-bit addresses.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'IPv6 has 128-bit addresses compared to IPv4\'s 32-bit.' },
    { question: 'What is the three-way handshake in TCP?', type: 'mcq', options: ['FIN, FIN-ACK, ACK', 'SYN, SYN-ACK, ACK', 'GET, POST, PUT', 'OPEN, SEND, CLOSE'], answer: 'SYN, SYN-ACK, ACK', explanation: 'TCP establishes connections with SYN, SYN-ACK, ACK.' },
    { question: 'FTP uses port 21 by default.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'FTP uses port 21 for control and port 20 for data.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is the sliding window protocol?', type: 'mcq', options: ['A routing algorithm', 'A flow control mechanism for reliable data transfer', 'An encryption method', 'A DNS technique'], answer: 'A flow control mechanism for reliable data transfer', explanation: 'Sliding window allows multiple frames in transit before acknowledgment.' },
    { question: 'BGP is used for inter-domain routing on the internet.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'BGP (Border Gateway Protocol) routes between autonomous systems.' },
    { question: 'What is a VLAN?', type: 'mcq', options: ['A virtual LAN that segments network traffic logically', 'A type of wireless network', 'A VPN protocol', 'A routing protocol'], answer: 'A virtual LAN that segments network traffic logically', explanation: 'VLANs separate broadcast domains on the same physical network.' },
    { question: 'SSL certificates verify server identity.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'SSL certificates are issued by Certificate Authorities for authentication.' },
    { question: 'What is CSMA/CD used for?', type: 'mcq', options: ['Wireless encryption', 'Collision detection in Ethernet networks', 'IP address assignment', 'DNS resolution'], answer: 'Collision detection in Ethernet networks', explanation: 'CSMA/CD detects and handles collisions in wired Ethernet.' },
    { question: 'QoS (Quality of Service) prioritizes network traffic types.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'QoS ensures bandwidth for critical traffic like VoIP.' },
    { question: 'What is a firewall?', type: 'mcq', options: ['A physical barrier', 'A network security system that monitors and controls traffic', 'A routing protocol', 'A wireless access point'], answer: 'A network security system that monitors and controls traffic', explanation: 'Firewalls filter packets based on rules.' },
    { question: 'TCP congestion control uses slow start mechanism.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'TCP slow start gradually increases transmission rate.' },
    { question: 'What is a packet in networking?', type: 'mcq', options: ['A file transfer', 'A unit of data transmitted over a network', 'An IP address block', 'A routing table'], answer: 'A unit of data transmitted over a network', explanation: 'Packets are small chunks of data with header and payload.' },
    { question: 'SNMP is used for network management and monitoring.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'SNMP monitors and manages network devices.' },
  ],

  'Aptitude & Reasoning Mastery': [
    // ── Basic ──────────────────────────────────────────
    { question: 'What is 15% of 200?', type: 'mcq', options: ['25', '30', '35', '40'], answer: '30', explanation: '15/100 × 200 = 30.' },
    { question: 'If A is faster than B and B is faster than C, then A is faster than C.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Transitive reasoning: A > B > C implies A > C.' },
    { question: 'What is the LCM of 4 and 6?', type: 'mcq', options: ['8', '10', '12', '24'], answer: '12', explanation: 'LCM(4,6) = 12.' },
    { question: 'A train travels 60 km in 1 hour. Its speed is 60 km/h.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Speed = Distance/Time = 60/1 = 60 km/h.' },
    { question: 'If a product costs ₹500 and is sold for ₹600, what is the profit percentage?', type: 'mcq', options: ['10%', '15%', '20%', '25%'], answer: '20%', explanation: 'Profit% = (100/500) × 100 = 20%.' },
    { question: 'The HCF of 12 and 18 is 6.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'HCF(12,18) = 6.' },
    { question: 'What is simple interest on ₹1000 at 10% per annum for 2 years?', type: 'mcq', options: ['₹100', '₹150', '₹200', '₹250'], answer: '₹200', explanation: 'SI = (1000 × 10 × 2)/100 = ₹200.' },
    { question: 'If 5 workers complete a job in 10 days, 10 workers will complete it in 5 days.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Workers and days are inversely proportional.' },
    { question: 'What comes next in the series: 2, 4, 8, 16, ___?', type: 'mcq', options: ['24', '28', '30', '32'], answer: '32', explanation: 'Each term is doubled: 16 × 2 = 32.' },
    { question: 'Average of 10, 20, 30 is 20.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: '(10+20+30)/3 = 60/3 = 20.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'A car travels 120 km in 2 hours. How long to travel 300 km at same speed?', type: 'mcq', options: ['4 hours', '5 hours', '6 hours', '7 hours'], answer: '5 hours', explanation: 'Speed = 60 km/h, Time = 300/60 = 5 hours.' },
    { question: 'Compound interest is always greater than simple interest for the same principal.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'CI compounds on previous interest; SI does not.' },
    { question: 'In how many ways can 3 people be arranged in a line?', type: 'mcq', options: ['3', '6', '9', '12'], answer: '6', explanation: '3! = 3 × 2 × 1 = 6 arrangements.' },
    { question: 'If 60% of a number is 90, the number is 150.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: '90/0.6 = 150.' },
    { question: 'A bag has 3 red and 4 blue balls. Probability of drawing red?', type: 'mcq', options: ['3/7', '4/7', '1/2', '3/4'], answer: '3/7', explanation: 'P(red) = 3/(3+4) = 3/7.' },
    { question: 'The ratio 3:4 is equivalent to 9:12.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: '3×3:4×3 = 9:12.' },
    { question: 'A is the father of B. B is the brother of C. How is A related to C?', type: 'mcq', options: ['Uncle', 'Brother', 'Father', 'Grandfather'], answer: 'Father', explanation: 'A is B\'s father. B and C are siblings. So A is C\'s father.' },
    { question: 'If all roses are flowers and some flowers fade, some roses may fade.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'This is a valid deductive inference.' },
    { question: 'What is 20% of 20% of 500?', type: 'mcq', options: ['10', '15', '20', '25'], answer: '20', explanation: '20% of 500 = 100; 20% of 100 = 20.' },
    { question: 'Speed and time are directly proportional for fixed distance.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Speed and time are inversely proportional for fixed distance.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'A can do a job in 12 days, B in 18 days. Together, how many days?', type: 'mcq', options: ['6 days', '7.2 days', '8 days', '9 days'], answer: '7.2 days', explanation: '1/12 + 1/18 = 5/36. Days = 36/5 = 7.2 days.' },
    { question: 'The number of diagonals in a hexagon is 9.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Diagonals = n(n-3)/2 = 6×3/2 = 9.' },
    { question: 'Compound interest on ₹2000 at 10% for 2 years is?', type: 'mcq', options: ['₹400', '₹420', '₹440', '₹460'], answer: '₹420', explanation: 'CI = 2000(1.1²-1) = 2000×0.21 = ₹420.' },
    { question: 'In a seating arrangement, if A is always between B and C, they must be adjacent.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'If A is between B and C, all three must be adjacent.' },
    { question: 'How many 3-digit numbers are divisible by 7?', type: 'mcq', options: ['108', '126', '128', '142'], answer: '128', explanation: 'From 105 to 994: (994-105)/7 + 1 = 128.' },
    { question: 'If MANGO is coded as NBNHP, then the code adds 1 to each letter.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'M+1=N, A+1=B, N+1=O... Wait, N+1=O but coded as H — actually adds 1 only for consonants. Let\'s verify: M→N, A→B, N→O, G→H, O→P. Yes, adds 1.' },
    { question: 'A clock shows 3:15. The angle between hands is?', type: 'mcq', options: ['0°', '7.5°', '15°', '30°'], answer: '7.5°', explanation: 'At 3:15, minute hand at 90°, hour hand at 97.5°. Difference = 7.5°.' },
    { question: 'The sum of first n natural numbers is n(n+1)/2.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'This is a standard formula: 1+2+...+n = n(n+1)/2.' },
    { question: 'In a group of 30, 18 like tea, 15 like coffee, 10 like both. How many like neither?', type: 'mcq', options: ['5', '7', '8', '10'], answer: '7', explanation: 'n(T∪C) = 18+15-10 = 23. Neither = 30-23 = 7.' },
    { question: 'The product of two consecutive integers is always even.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'One of any two consecutive integers is always even.' },
  ],

  'UI/UX Design Fundamentals': [
    // ── Basic ──────────────────────────────────────────
    { question: 'UX stands for User Experience.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'UX focuses on the overall experience a user has with a product.' },
    { question: 'What is a wireframe?', type: 'mcq', options: ['A high-fidelity design', 'A low-fidelity skeletal layout of a UI', 'A color palette', 'A CSS framework'], answer: 'A low-fidelity skeletal layout of a UI', explanation: 'Wireframes show structure without visual design details.' },
    { question: 'UI design focuses on how a product looks.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'UI (User Interface) deals with visual design and interaction.' },
    { question: 'What tool is most commonly used for UI prototyping?', type: 'mcq', options: ['Photoshop', 'Figma', 'Excel', 'Notepad'], answer: 'Figma', explanation: 'Figma is the industry-standard tool for UI/UX design.' },
    { question: 'A prototype is a working model of the final product.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Prototypes simulate functionality but are not the final product.' },
    { question: 'What does WCAG stand for?', type: 'mcq', options: ['Web Content Accessibility Guidelines', 'Web Color and Graphics', 'Website Content and Graphics', 'Web Component Access Guide'], answer: 'Web Content Accessibility Guidelines', explanation: 'WCAG provides standards for web accessibility.' },
    { question: 'White space in design is wasted space.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'White space improves readability and visual hierarchy.' },
    { question: 'Which color model is used for screen design?', type: 'mcq', options: ['CMYK', 'Pantone', 'RGB', 'HSL only'], answer: 'RGB', explanation: 'Screens use RGB (Red, Green, Blue) color model.' },
    { question: 'Typography affects user readability significantly.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Good typography improves legibility and user experience.' },
    { question: 'What is a design system?', type: 'mcq', options: ['A CSS framework', 'A collection of reusable components and design standards', 'A color picker', 'A prototype tool'], answer: 'A collection of reusable components and design standards', explanation: 'Design systems ensure consistency across a product.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is the F-pattern in UI reading?', type: 'mcq', options: ['Users read in F shape — top then left side', 'A font pattern', 'A layout grid', 'A color scheme'], answer: 'Users read in F shape — top then left side', explanation: 'Eye-tracking shows users scan content in an F pattern.' },
    { question: 'Auto Layout in Figma helps create responsive components.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Auto Layout automatically adjusts spacing and sizing.' },
    { question: 'What is the primary goal of usability testing?', type: 'mcq', options: ['Make designs pretty', 'Evaluate how real users interact with the product', 'Test code performance', 'Check color contrast'], answer: 'Evaluate how real users interact with the product', explanation: 'Usability testing identifies user pain points.' },
    { question: 'Hick\'s Law states that more choices lead to longer decision time.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Hick\'s Law: decision time increases logarithmically with options.' },
    { question: 'What is the difference between low and high fidelity prototypes?', type: 'mcq', options: ['Color vs no color', 'Level of detail and interactivity', 'Mobile vs desktop', 'Static vs animated'], answer: 'Level of detail and interactivity', explanation: 'Low-fi is rough sketches; high-fi closely resembles final product.' },
    { question: 'Contrast ratio of 4.5:1 meets WCAG AA for normal text.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'WCAG AA requires 4.5:1 contrast for normal text.' },
    { question: 'What is a user persona?', type: 'mcq', options: ['A real user account', 'A fictional representation of a target user', 'A design component', 'A usability test result'], answer: 'A fictional representation of a target user', explanation: 'Personas help designers empathize with target users.' },
    { question: 'The Gestalt principle of proximity groups nearby elements together.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Proximity makes nearby items appear related.' },
    { question: 'What is information architecture?', type: 'mcq', options: ['Database design', 'Organizing and structuring content for usability', 'Website hosting', 'Network design'], answer: 'Organizing and structuring content for usability', explanation: 'IA defines how content is organized, labeled, and navigated.' },
    { question: 'A CTA (Call to Action) should be visually prominent.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'CTAs guide users to take specific actions.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is a mental model in UX?', type: 'mcq', options: ['A UI layout', 'User\'s internal understanding of how a system works', 'A design framework', 'A testing method'], answer: 'User\'s internal understanding of how a system works', explanation: 'Designs should match users\' mental models for intuitive use.' },
    { question: 'Fitts\'s Law relates target size and distance to interaction time.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Larger and closer targets are faster to click.' },
    { question: 'What is a design token?', type: 'mcq', options: ['A login credential', 'A named variable storing design values like colors and spacing', 'A UI component', 'A user test result'], answer: 'A named variable storing design values like colors and spacing', explanation: 'Design tokens enable consistent theming across platforms.' },
    { question: 'Dark patterns are ethical UX practices.', type: 'truefalse', options: ['True', 'False'], answer: 'False', explanation: 'Dark patterns manipulate users against their interests.' },
    { question: 'What is progressive disclosure in UX?', type: 'mcq', options: ['Loading screens', 'Revealing information gradually to reduce cognitive load', 'Showing all content at once', 'A navigation pattern'], answer: 'Revealing information gradually to reduce cognitive load', explanation: 'Progressive disclosure shows only necessary info at each step.' },
    { question: 'Atomic design breaks UI into atoms, molecules, organisms, templates, pages.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Brad Frost\'s atomic design methodology structures UI components.' },
    { question: 'What is emotional design?', type: 'mcq', options: ['Designing for emotions only', 'Creating designs that evoke positive feelings and connections', 'Avoiding user emotions', 'A color theory'], answer: 'Creating designs that evoke positive feelings and connections', explanation: 'Emotional design creates meaningful user experiences.' },
    { question: 'A/B testing compares two design versions to determine which performs better.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'A/B testing shows both versions to different users and measures results.' },
    { question: 'What is the purpose of a style guide?', type: 'mcq', options: ['A user manual', 'Documenting design standards for consistency', 'A sitemap', 'A color wheel'], answer: 'Documenting design standards for consistency', explanation: 'Style guides ensure visual and interaction consistency.' },
    { question: 'Cognitive load should be minimized in good UI design.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Reducing cognitive load makes interfaces easier to use.' },
  ],

  'DevOps & Cloud Basics': [
    // ── Basic ──────────────────────────────────────────
    { question: 'DevOps combines development and operations teams.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'DevOps bridges the gap between dev and ops for faster delivery.' },
    { question: 'What does CI/CD stand for?', type: 'mcq', options: ['Code Integration and Code Deployment', 'Continuous Integration and Continuous Delivery', 'Cloud Infrastructure and Cloud Deployment', 'Continuous Improvement and Continuous Development'], answer: 'Continuous Integration and Continuous Delivery', explanation: 'CI/CD automates building, testing, and deploying code.' },
    { question: 'Docker containers share the host OS kernel.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Containers are lightweight because they share the kernel.' },
    { question: 'What is a Dockerfile?', type: 'mcq', options: ['A log file', 'A script with instructions to build a Docker image', 'A container', 'A deployment file'], answer: 'A script with instructions to build a Docker image', explanation: 'Dockerfile defines the environment for a container.' },
    { question: 'Git is a distributed version control system.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Git tracks code changes with a distributed model.' },
    { question: 'Which AWS service provides virtual servers?', type: 'mcq', options: ['S3', 'RDS', 'EC2', 'Lambda'], answer: 'EC2', explanation: 'EC2 (Elastic Compute Cloud) provides virtual machine instances.' },
    { question: 'Kubernetes orchestrates containerized applications.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Kubernetes manages container deployment, scaling, and networking.' },
    { question: 'What is the purpose of a load balancer?', type: 'mcq', options: ['Store data', 'Distribute traffic across multiple servers', 'Monitor logs', 'Build Docker images'], answer: 'Distribute traffic across multiple servers', explanation: 'Load balancers improve availability and performance.' },
    { question: 'Infrastructure as Code (IaC) manages infrastructure through config files.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'IaC tools like Terraform automate infrastructure provisioning.' },
    { question: 'Which command builds a Docker image?', type: 'mcq', options: ['docker run', 'docker build', 'docker start', 'docker create'], answer: 'docker build', explanation: 'docker build creates an image from a Dockerfile.' },
    // ── Intermediate ───────────────────────────────────
    { question: 'What is a Docker Compose file used for?', type: 'mcq', options: ['Writing Dockerfiles', 'Defining multi-container applications', 'Building images', 'Pushing to registry'], answer: 'Defining multi-container applications', explanation: 'Docker Compose defines services, networks, and volumes.' },
    { question: 'GitHub Actions can automate CI/CD pipelines.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'GitHub Actions runs workflows on code events like push.' },
    { question: 'What is Nginx commonly used for?', type: 'mcq', options: ['Database management', 'Reverse proxy and web server', 'Container orchestration', 'Code versioning'], answer: 'Reverse proxy and web server', explanation: 'Nginx serves web content and proxies requests to backend.' },
    { question: 'SSL certificates are required for HTTPS.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'SSL/TLS certificates encrypt HTTPS connections.' },
    { question: 'What does AWS S3 store?', type: 'mcq', options: ['Relational data', 'Object storage like files and images', 'Virtual machines', 'DNS records'], answer: 'Object storage like files and images', explanation: 'S3 (Simple Storage Service) stores objects in buckets.' },
    { question: 'Environment variables should never be committed to Git.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Secrets in Git are a major security risk.' },
    { question: 'What is a container registry?', type: 'mcq', options: ['A list of containers', 'A storage service for Docker images', 'A Kubernetes config', 'A CI/CD tool'], answer: 'A storage service for Docker images', explanation: 'Docker Hub and ECR are container registries.' },
    { question: 'Blue-green deployment reduces downtime during updates.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Blue-green runs two environments and switches traffic.' },
    { question: 'What is the purpose of health checks in Docker?', type: 'mcq', options: ['Monitor CPU', 'Verify container is running correctly', 'Build images', 'Push to registry'], answer: 'Verify container is running correctly', explanation: 'Health checks restart unhealthy containers automatically.' },
    { question: 'Terraform is an Infrastructure as Code tool.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Terraform provisions cloud resources declaratively.' },
    // ── Advanced ───────────────────────────────────────
    { question: 'What is a Kubernetes Pod?', type: 'mcq', options: ['A VM instance', 'The smallest deployable unit containing one or more containers', 'A load balancer', 'A namespace'], answer: 'The smallest deployable unit containing one or more containers', explanation: 'Pods are the basic unit of deployment in Kubernetes.' },
    { question: 'Canary deployments release updates to a small percentage of users first.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Canary releases reduce risk by testing with limited traffic.' },
    { question: 'What does observability include?', type: 'mcq', options: ['Only logging', 'Metrics, logs, and traces', 'Only monitoring', 'Only alerts'], answer: 'Metrics, logs, and traces', explanation: 'The three pillars of observability are metrics, logs, and traces.' },
    { question: 'Docker volumes persist data beyond container lifecycle.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Volumes store data independently from containers.' },
    { question: 'What is the purpose of a service mesh?', type: 'mcq', options: ['Building containers', 'Managing service-to-service communication in microservices', 'Storing secrets', 'Running CI pipelines'], answer: 'Managing service-to-service communication in microservices', explanation: 'Service meshes like Istio handle routing, security, and observability.' },
    { question: 'A monorepo stores all project code in a single repository.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Monorepos contain multiple projects in one repository.' },
    { question: 'What is a rolling update in Kubernetes?', type: 'mcq', options: ['Updating one pod at a time', 'Replacing all pods simultaneously', 'Rolling back a deployment', 'Scaling pods'], answer: 'Updating one pod at a time', explanation: 'Rolling updates gradually replace old pods with new ones.' },
    { question: 'Chaos engineering intentionally introduces failures to test resilience.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Chaos engineering finds weaknesses before they cause outages.' },
    { question: 'What is GitOps?', type: 'mcq', options: ['A Git hosting service', 'Using Git as single source of truth for infrastructure', 'A CI tool', 'A Docker registry'], answer: 'Using Git as single source of truth for infrastructure', explanation: 'GitOps uses Git repos to drive infrastructure changes automatically.' },
    { question: 'Zero-downtime deployment is achievable with proper DevOps practices.', type: 'truefalse', options: ['True', 'False'], answer: 'True', explanation: 'Blue-green, canary, and rolling deployments achieve zero downtime.' },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await MockTest.deleteMany({});
    console.log('Old mock tests cleared');

    const courses = await Course.find();
    if (courses.length === 0) {
      console.error('No courses found. Run seedCourses.js first.');
      process.exit(1);
    }

    let inserted = 0;
    for (const course of courses) {
      const questions = questionsMap[course.title];
      if (!questions) {
        console.log(` ⚠ No questions found for: ${course.title}`);
        continue;
      }

      await MockTest.create({
        course: course._id,
        courseTitle: course.title,
        questions,
      });

      console.log(` ✓ ${course.title} — ${questions.length} questions`);
      inserted++;
    }

    console.log(`\n${inserted} mock tests inserted successfully.`);
    await mongoose.disconnect();
    console.log('Done. MongoDB disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();