import React from "react";
import '../style/login.css';

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome back</h1>
        <p className="subtitle">Log in to your account</p>

        <form>
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Enter Email" id="email" name="email" required />

          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password" name="password" required />

          <button type="submit">Log in</button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
