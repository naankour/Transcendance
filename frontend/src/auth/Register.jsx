import { useState } from "react";

export function Register({ onSwitchToLogin, triggerToast }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || "Registration failed";
        throw new Error(errorMessage);
      }

      if (triggerToast) {
        triggerToast("Account created ദ്ദി ˉ͈̀꒳ˉ͈́ )✧ heehee...", "✨");
      }
      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || "Something went wrong", "⚠️");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        disabled={loading}
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="link-btn"
          disabled={loading}
        >
          Login
        </button>
      </p>
    </form>
  );
}
