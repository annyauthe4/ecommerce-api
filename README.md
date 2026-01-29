An e-commerce web application built on Node.js with Express.js

<h3><li> Validation: I used <code>express-validator</code> to ensure users don't send empty product names or negative prices.</li></h3>

<h3><li>Logging: I used <code>morgan</code> to log incoming requests to your console.</li></h3>

<h3><li>Security: I used <code>helmet</code> to set secure HTTP headers.</li></h3>


<code>throw new TypeError('argument handler must be a function')</code>
 The error was crashing my app simply because of some typographical errors in the router I used to edit product.
 <h3>How I fixed it</h3>
 After reading the error message, I was able to trace the line of code that caused the crash i.e 
 <code>router.put('/:id', protect.adminOnly, controller.updateProduct);</code> <br></br>
 instead of <code>router.put('/:id', protect, adminOnly, controller.updateProduct);</code>

 Why did that happen? I was already feeling sleepy the night I implemented the update and delete product. In fact, it was when I discovered I was typing nonsense that I had to hibernate my system that night.
 I tried testing the logic the next day and saw that I had (res, res) in one of the callback functions instead of (req, res).
