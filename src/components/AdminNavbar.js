import React from 'react';
import './AdminNavbar.css'; // تأكد من استيراد ملف CSS

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__content">
        <span className="admin-navbar__title">لوحة التحكم</span>
        <button className="admin-navbar__logout" onClick={handleLogout}>
          🚪 تسجيل الخروج
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
