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
Request Body
<code>
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "admin" // optional, defaults to "user"
}
</code>
Response
<code>
{
  "token": "Bearer <JWT_TOKEN>",
  "user": { ... }
}
</code>
The returned token must be sent in the Authorization header for protected routes.
<h4>Login User</h4>
<h4>POST</h4>
/api/auth/login
Request Body
<code>
{
  "email": "string",
  "password": "string"
}
</code>
Response
<code>
{
  "token": "Bearer <JWT_TOKEN>",
  "user": { ... }
}

<h3> Products </h3>
Create Product (Admin Only)
<b>POST</b>
/api/products
<b>AUTHORIZATION</b>
<code>Bearer <ADMIN_TOKEN></code>
Request Body
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
<b>Update or delete Product (Admin Only)</b>
<b>PUT/DELETE</b>
<code>/api/products/:PRODUCT_ID</code>
<b>AUTHORIZATION</b>
<code>Bearer <ADMIN_TOKEN></code>

<h3> CART</h3>
<b>Get / Cart</b>
<b>POST / Add to Cart</b>
<code>/api/cart</code>
<b>AUTHORIZATION</b>
<code>Bearer <USER_TOKEN></code>

<b> Update or Remove Item from Cart</b>
<b> PUT / DELETE</b>
<code>/api/cart/:PRODUCT_ID</code>
<b>AUTHORIZATION</b>
<code>Bearer <USER_TOKEN></code>


<h3> 📑 Orders</h3>
<b>Create Order (Convert Cart → Order)</b>
<b>POST</b>
<code>/api/orders</code>
<b>AUTHORIZATION</b>
<code>Bearer <USER_TOKEN></code>

<b>Get User Orders</b> 
<b>Get</b>
<code>/api/orders/my-orders</code>
<b>AUTHORIZATION</b>
<code>Bearer <USER_TOKEN></code>

<b>Cancel Order (Pending Only)</b> 
<b>PATCH</b>
<code>/api/orders/:ORDER_ID/cancel</code>
<b>AUTHORIZATION</b>
<code>Bearer <USER_TOKEN></code>
Only orders with status = pending can be canceled.
Canceled orders automatically restock products.

<h2> Challenges Faced</h2>
<b>Error Encountered</b>
<code>throw new TypeError('argument handler must be a function')</code>
 This error caused the application to crash during product update operations.
 <b>Root Cause</b>
 A typographical error in the route middleware definition:
 <code>router.put('/:id', protect.adminOnly, controller.updateProduct);</code> <br></br>
 <b>Correct</b>
 <code>router.put('/:id', protect, adminOnly, controller.updateProduct);</code>

 <b>Resolution</b>
 <li>Carefully reviewed the stack trace to identify the faulty route.</li>
 <li>Corrected middleware usage.</li>
 <li>Fixed additional callback mistakes such as using (res, res) instead of (req, res).</li>

 <h3>🚀 Future Improvements</h3>
 <li>Payment integration (Stripe)</li>
 <li>Order status tracking</li>
 <li>Admin dashboard</li>
 <li>API documentation with Swagger</li>
 <li>API documentation with Swagger</li>
