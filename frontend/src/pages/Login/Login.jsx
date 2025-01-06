import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Login-Register.scss";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handles change events for the login form. Updates the formData state
   * with the new values from the form fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
/******  930b8648-183d-4fd8-a332-5ffb6b64cd6d  *******/  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
    <Link className="back-button" to={"/"}>Back</Link>
      <div className="auth-container">
        <h2>Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form__group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="form__button">
            Login
          </button>
          <div className="form__link">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
