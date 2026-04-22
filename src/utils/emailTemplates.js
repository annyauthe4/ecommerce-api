exports.welcomeEmailTemplate = (name) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #333;">Welcome to KataKara E-Commerce Store, ${name}!</h2>
      <p>We're thrilled to have you here. You can now start browsing our latest products and adding them to your cart.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/products" 
           style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
           Start Shopping
        </a>
      </div>
      <p style="font-size: 12px; color: #777;">If you didn't create this account, please ignore this email.</p>
    </div>
  `;
};