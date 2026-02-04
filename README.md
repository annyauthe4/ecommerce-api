An e-commerce web application built on Node.js with Express.js

<h3><li> Validation: I used <code>express-validator</code> to ensure users don't send empty product names or negative prices.</li></h3>

<h3><li>Logging: I used <code>morgan</code> to log incoming requests to your console.</li></h3>

<h3><li>Security: I used <code>helmet</code> to set secure HTTP headers.</li></h3>

<h2>API base URL</h2>
https://ecommerce-api-bgwl.onrender.com/api/auth/register: 
This takes three arguments with 4th arg being optional (role: admin) default: user: 
<code>"name": str, "email": str, "password": str</code>
This returns a Bearer Token which will be used in the Authorization header
<code>https://ecommerce-api-bgwl.onrender.com/api/auth/login</code>
It takes two arguments: email and password

<code>https://ecommerce-api-bgwl.onrender.com/api/products</code>
This offers product creation only for admin users.
Use Bearer Authorization token as an admin to create.
Arguments: title: str, description: str, price: Number, stock: Number,
images(optional): arrays of str, category: str

<code>https://ecommerce-api-bgwl.onrender.com/api/products/PRODUCT_ID</code>
To delete and update product, use Bearer token in the Authorization header

<code>https://ecommerce-api-bgwl.onrender.com/api/cart</code>
Use user token for Authorization

<code>https://ecommerce-api-bgwl.onrender.com/api/cart/PRODUCT_ID</code>
To update and delete product from cart

<code>https://ecommerce-api-bgwl.onrender.com/api/orders</code>
Use user Authorization token in the header

<code>https://ecommerce-api-bgwl.onrender.com/api/orders/my-orders</code>
To get user order

<code>https://ecommerce-api-bgwl.onrender.com/api/orders/:ORDER_ID/cancel</code>
To cancel pending order only

<h2> Challenges</h2>
<code>throw new TypeError('argument handler must be a function')</code>
 The error was crashing the app simply because of some typographical errors in the router I used to edit product.
 <h3>How I fixed it</h3>
 After reading the error message, I was able to trace the line of code that caused the crash i.e 
 <code>router.put('/:id', protect.adminOnly, controller.updateProduct);</code> <br></br>
 instead of <code>router.put('/:id', protect, adminOnly, controller.updateProduct);</code>

 Why did that happen? I was already feeling sleepy the night I implemented the update and delete product. In fact, it was when I discovered I was typing nonsense that I had to hibernate my system that night.
 I tried testing the logic the next day and saw that I had (res, res) in one of the callback functions instead of (req, res).
