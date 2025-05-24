import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("✅ تسجيل الدخول ناجح");
      window.location.href = "/manage-pages";
    } catch (err) {
      alert("❌ فشل تسجيل الدخول");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>تسجيل دخول الأدمن</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  );
};

export default Login;
