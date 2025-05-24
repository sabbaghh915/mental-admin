import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mental-backend-8ia0.onrender.com/api/auth/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        alert("✅ تسجيل الدخول ناجح");
        navigate("/manage-pages");
      } else {
        alert("❌ لم يتم استلام التوكن من السيرفر");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ فشل تسجيل الدخول: تأكد من صحة البيانات");
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
