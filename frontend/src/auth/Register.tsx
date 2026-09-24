import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Register({ onSwitchToLogin, triggerToast }) {
  const { t } = useTranslation();
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
          data.error || data.message || t("auth.registerFailed");
        throw new Error(errorMessage);
      }

      if (triggerToast) {
        triggerToast(t("auth.registerSuccess"), "✨");
      }
      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
    } catch (err) {
      if (triggerToast) {
        triggerToast(err.message || t("auth.somethingWrong"), "⚠️");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{t("auth.createAccount")}</h2>

      <input
        type="text"
        placeholder={t("auth.username")}
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        disabled={loading}
      />

      <input
        type="email"
        placeholder={t("auth.email")}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={loading}
      />

      <input
        type="password"
        placeholder={t("auth.password")}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? t("auth.creatingAccount") : t("auth.signUp")}
      </button>

      <p>
        {t("auth.haveAccount")}{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="link-btn"
          disabled={loading}
        >
          {t("auth.login")}
        </button>
      </p>
    </form>
  );
}