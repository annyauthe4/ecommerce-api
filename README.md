<h1>E-Commerce API</h1>

An e-commerce backend application built with Node.js and Express.js, providing authentication, product management, cart handling, and order processing.

<h2>🛠️ Core Features & Middleware</h2>
<h3>Validation</h3>

<li>Uses express-validator to validate incoming requests.</li>

<li>Prevents empty product titles, invalid emails, and negative prices.</li>

<h3>Logging</h3>

<li>Uses morgan to log incoming HTTP requests during development and production.</li>

<h3>Security</h3>

<li>Uses helmet to set secure HTTP headers and reduce common web vulnerabilities.</li>

<li>JWT-based authentication for protected routes.</li>

<h2>Base URL</h2>
<a href="https://ecommerce-api-bgwl.onrender.com">https://ecommerce-api-bgwl.onrender.com</a>

All endpoints are prefixed with: /api

<h3> Authentication </h3>
<h4>Register User</h4>
<h4>POST</h4>
/api/auth/register
<h5>Request Body</h5>
<code>
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "admin" // optional, defaults to "user"
}
</code>
<h5>Response</h5>

<code>
{
  "token": "Bearer <JWT_TOKEN>",
  "user": { ... }
}
</code>
<h5>The returned token must be sent in the Authorization header for protected routes.</h5>
<h4>Login User</h4>
<h4>POST</h4>
/api/auth/login
<h5>Request Body</h5>
<code>
{
  "email": "string",
  "password": "string"
}
</code>
<h5>Response</h5>

<code>
{
  "token": "Bearer <JWT_TOKEN>",
  "user": { ... }
}

<h3> Products </h3>
<h4>Create Product (Admin Only)</h4>
<h4>POST</h4>
/api/products
<h4>AUTHORIZATION</h4>
<code>Bearer <ADMIN_TOKEN></code>
<h5>Request Body</h5>
<code>
{
  "title": "string",
  "description": "string",
  "price": 1000,
  "stock": 20,
  "category": "string",
  "images": ["string"] // optional
}
</code>

<h4>Update or delete Product (Admin Only)</h4>
<h4>PUT/DELETE</h4>
<code>/api/products/:PRODUCT_ID</code>
<h4>AUTHORIZATION</h4>
<code>Bearer <ADMIN_TOKEN></code>

<h3> CART</h3>
<h4>Get / Cart</h4>
<h4>POST / Add to Cart</h4>
<code>/api/cart</code>
<h4>AUTHORIZATION</h4>

<code>Bearer <USER_TOKEN></code>

<h4> Update or Remove Item from Cart</h4>
<h4> PUT / DELETE</h4>
<code>/api/cart/:PRODUCT_ID</code>
<h4>AUTHORIZATION</h4>

<code>Bearer <USER_TOKEN></code>


<h3> 📑 Orders</h3>
<h4>Create Order (Convert Cart → Order)</h4>
<h4>POST</h4>
<code>/api/orders</code>
<h4>AUTHORIZATION</h4>
<code>Bearer <USER_TOKEN></code>

<h4>Get User Orders</h4> 
<h4>Get</h4>
<code>/api/orders/my-orders</code>
<h4>AUTHORIZATION</h4>
<code>Bearer <USER_TOKEN></code>

<h4>Cancel Order (Pending Only)</h4> 
<h4>PATCH</h4>
<code>/api/orders/:ORDER_ID/cancel</code>
<h4>AUTHORIZATION</h4>
<code>Bearer <USER_TOKEN></code>
Only orders with status = pending can be canceled.
Canceled orders automatically restock products.

<h2> Challenges Faced</h2>
<h5>Error Encountered</h5>
<code>throw new TypeError('argument handler must be a function')</code>
 This error caused the application to crash during product update operations.
 <h5>Root Cause</h5>
 A typographical error in the route middleware definition:
 <code>router.put('/:id', protect.adminOnly, controller.updateProduct);</code> <br></br>
 <h3>Correct</h3>
 <code>router.put('/:id', protect, adminOnly, controller.updateProduct);</code>

 <h3>Resolution</h3>
 <li>Carefully reviewed the stack trace to identify the faulty route.</li>
 <li>Corrected middleware usage.</li>
 <li>Fixed additional callback mistakes such as using (res, res) instead of (req, res).</li>

 <h3>🚀 Future Improvements</h3>
 <li>Payment integration (Stripe)</li>
 <li>Order status tracking</li>
 <li>Admin dashboard</li>
 <li>API documentation with Swagger</li>
 <li>API documentation with Swagger</li>
