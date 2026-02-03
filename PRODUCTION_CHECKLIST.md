<h1>E-COMMERCE API – PRODUCTION CHECKLIST (NO PAYMENTS)</h1>
<code>Project: E-commerce REST API</code>
<code>Scope: Auth, Products, Cart, Orders (No Payment)</code>
<code>Stack: Node.js, Express, MongoDB</code>
<code>Owner: Otetumo Oluwaseun Ayodele</code>
<code>Deployment Date:</code>


<h2> ENVIRONMENT & CONFIGURATION</h2>
<code>.env</code file excluded from Git
<code>NODE_ENV=production</code>
<code>PORT</code> set
<code>JWT_SECRET</code> strong and secure
<code>MONGO_URI</code> points to production DB
No test credentials in production

<h2>Folder Organization</h2>
<ul>
<li>Clear separation of concerns</li>
<li>Controllers thin (request/response only</li>
<li>Services handle business logic</li>
<li>Models validate schema rules</li>
<li>Middlewares reusable </li>
</ul>
src/
 |__ controllers/
 |__ services/
 |__ models/
 |__ routes/
 |__ middlewares/
 |__ utils/
 |__ app.js

 <h3>Core Middleware</h3>
 <code>express.json()</code>
 <code>cors()</code>
 <code>helmet()</code>
 <code>morgan()</code>

 <h3>Registered Routes</h3>
<code>'/api/auth/register'</code> To register new user
<code>'/api/products'</code>
<code>'/api/cart'</code>
<code>'/api/orders'</code>


<h3> Error Handling</h3>
<li>Global error handler present</li>
<li>Proper HTTP status codes used</li>
<li>Stack traces hidden in production</li>


<h3> Data Integrity</h3>
<li>Product stock enforced</li>
<li>Cart is unique per user</li>
<li>Orders are immutable after creation</li>
<li>Indexes added for performance</li>

<h3> AUTHENTICATION & SECURITY</h3>
<h4> Authentication</h4>
<li>Passwords hashed with <code>bcrypt</code></li>
<li>JWT generated correctly</li>
<li>Token expiry configured</li>
<li>Sensitive fields excluded from responses</li>

<h4>Authorization</h4>
<li>Carts routes protected</li>
<li>Order routes protected</li>
<li>Admin-only product management</li>

