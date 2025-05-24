import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManagePages = () => {
  const [title, setTitle] = useState('');
  const [subPages, setSubPages] = useState([{ title: '', content: '' }]);
  const [pages, setPages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showOnHome, setShowOnHome] = useState(false);
  const [order, setOrder] = useState(0);
  const [image, setImage] = useState(null);

  const handleAddSubPage = () => {
    setSubPages([...subPages, { title: '', content: '', videoUrl: '' }]);
  };

  const handleSubPageChange = (index, field, value) => {
    const updated = [...subPages];
    updated[index][field] = value;
    setSubPages(updated);
  };

  const handleEdit = (page) => {
    setEditId(page._id);
    setTitle(page.title);
    setSubPages(page.subPages);
    setShowOnHome(page.showOnHome || false);
    setOrder(page.order || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("showOnHome", showOnHome);
      formData.append("order", order);
      formData.append("subPages", JSON.stringify(subPages));
      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        await axios.put(`https://mental-backend-8ia0.onrender.com/api/pages/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ تم التعديل بنجاح");
      } else {
        await axios.post("https://mental-backend-8ia0.onrender.com/api/pages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ تم الحفظ بنجاح");
      }

      resetForm();
      fetchPages();
    } catch (err) {
      console.error("❌ خطأ أثناء الإرسال:", err);
      alert("❌ حدث خطأ أثناء حفظ البيانات");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setSubPages([{ title: '', content: '', videoUrl: '' }]);
    setShowOnHome(false);
    setOrder(0);
    setImage(null);
  };

  const fetchPages = async () => {
    const res = await axios.get('https://mental-backend-8ia0.onrender.com/api/pages');
    setPages(res.data);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="manage-container">
      <h2>{editId ? "تعديل العنوان" : "إضافة عنوان جديد"}</h2>
      <form className="manage-form" onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان الرئيسي" required />

      <div className="form-inline-row">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={showOnHome}
      onChange={(e) => setShowOnHome(e.target.checked)}
    />
    عرض في الصفحة الرئيسية
  </label>

  <input
    type="number"
    value={order}
    onChange={(e) => setOrder(Number(e.target.value))}
    placeholder="ترتيب العرض"
    className="order-input"
  />
</div>


        <label>
          صورة (اختياري):
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </label>

        {subPages.map((sp, i) => (
          <div key={i}>
            <input
              placeholder="عنوان فرعي"
              value={sp.title}
              onChange={(e) => handleSubPageChange(i, 'title', e.target.value)}
            />
            <textarea
              placeholder="المحتوى"
              value={sp.content}
              onChange={(e) => handleSubPageChange(i, 'content', e.target.value)}
            />
            <input
              placeholder="رابط الفيديو (يوتيوب مثلاً)"
              value={sp.videoUrl || ''}
              onChange={(e) => handleSubPageChange(i, 'videoUrl', e.target.value)}
            />

            <button type="button" onClick={() => {
              const updated = [...subPages];
              updated.splice(i, 1);
              setSubPages(updated);
            }}>🗑️ حذف العنصر</button>
          </div>
        ))}

        <button type="button" onClick={handleAddSubPage}>+ قائمة جديدة</button>
        <button type="submit">💾 {editId ? "حفظ التعديلات" : "حفظ جديد"}</button>
      </form>

      <h3>📚 العناوين الحالية</h3>
      {pages.map((p) => (
        <div key={p._id} className="page-card">
          <strong>{p.title}</strong>
          <ul>
            {p.subPages.map((sp, i) => (
              <li key={i}>
                {sp.title}
                <Link
                  to={`/admin/edit-subpage/${p._id}/${i}`}
                  style={{ marginRight: 10, color: "#1e3a8a", textDecoration: "underline" }}
                >
                  ✏️ تحرير المحتوى
                </Link>
                <button
                  onClick={async () => {
                    const confirm = window.confirm("هل أنت متأكد من حذف هذا العنصر الفرعي؟");
                    if (confirm) {
                      await axios.put(`https://mental-backend-8ia0.onrender.com/api/pages/${p._id}/remove-subpage`, {
                        subPageIndex: i,
                      });
                      fetchPages();
                    }
                  }}
                >
                  🗑️ حذف
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleEdit(p)}>✏️ تعديل</button>
          <button
            onClick={async () => {
              const confirm = window.confirm("هل أنت متأكد من حذف هذا العنوان بالكامل؟");
              if (confirm) {
                await axios.delete(`https://mental-backend-8ia0.onrender.com/api/pages/${p._id}`);
                fetchPages();
              }
            }}
          >
            🗑️ حذف العنوان
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManagePages;
