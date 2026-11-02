import React from "react";
import '../style/signup.css';

export default function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Welcome</h1>
        <p className="subtitle">Sign up to your account</p>

        <form>
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Enter Email" id="email" name="email" required />

          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password" name="password" required />

          <label htmlFor="password">Confirm Password</label>
          <input type="password" placeholder="Enter password" id="password" name="password" required />


          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>
          <button type="submit">Signup</button>
        </form>


        <p className="login-link">
          Already have an account? <a href="/login">login</a>
        </p>
      </div>
    </div>
  );
}
