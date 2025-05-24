import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate} from "react-router-dom";

const EditSubPage = () => {
  const { pageId, subIndex } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSubPage = async () => {
      const res = await axios.get("https://mental-backend-8ia0.onrender.com/api/pages");
      const page = res.data.find((p) => p._id === pageId);
      if (page && page.subPages[subIndex]) {
        setPageTitle(page.subPages[subIndex].title);
        setBlocks(page.subPages[subIndex].contentBlocks || []);
      }
    };
    fetchSubPage();
  }, [pageId, subIndex]);

  const addBlock = (type) => {
    setBlocks([...blocks, { type, data: "" }]);
  };

  const updateBlock = (index, value) => {
    const updated = [...blocks];
    updated[index].data = value;
    setBlocks(updated);
  };

  const handleImageUpload = async (index, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("https://mental-backend-8ia0.onrender.com/api/upload", formData);
    updateBlock(index, res.data.path);
  };

  const handleVideoUpload = async (index, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("https://mental-backend-8ia0.onrender.com/api/upload", formData);
    updateBlock(index, res.data.path);
  };

  const deleteBlock = (index) => {
    const updated = [...blocks];
    updated.splice(index, 1);
    setBlocks(updated);
  };

  const saveContent = async () => {
  try {
    await axios.put(`https://mental-backend-8ia0.onrender.com/api/pages/${pageId}`, {
      subIndex: parseInt(subIndex),
      contentBlocks: blocks,
    });
    alert("✅ تم حفظ المحتوى بنجاح");
    navigate("/manage-pages"); // ✅ العودة إلى لوحة التحكم
  } catch (err) {
    alert("❌ حدث خطأ أثناء الحفظ");
    console.error(err);
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>✏️ تحرير: {pageTitle}</h2>

      <div>
        {blocks.map((block, i) => (
          <div key={i} style={{ marginBottom: 20, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
            <strong>نوع المحتوى: {block.type}</strong>
            <div style={{ marginTop: 10 }}>
              {block.type === "text" && (
                <textarea
                  value={block.data}
                  onChange={(e) => updateBlock(i, e.target.value)}
                  placeholder="أدخل النص هنا"
                  rows={4}
                  style={{ width: "100%" }}
                />
              )}

              {block.type === "image" && (
                <>
                  {block.data && (
                    <img
                      src={`http://localhost:5000/${block.data}`}
                      alt=""
                      style={{ maxWidth: "100%", marginBottom: 10 }}
                    />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e.target.files[0])} />
                </>
              )}

              {block.type === "video" && (
                <>
                  {block.data && (
                    <video
                      controls
                      src={`http://localhost:5000/${block.data}`}
                      style={{ width: "100%", marginBottom: 10 }}
                    ></video>
                  )}
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(i, e.target.files[0])} />
                </>
              )}
            </div>

            <button onClick={() => deleteBlock(i)} style={{ marginTop: 10, color: "red" }}>
              🗑️ حذف البلوك
            </button>
          </div>
        ))}

        <div style={{ marginTop: 30 }}>
          <button onClick={() => addBlock("text")}>➕ إضافة نص</button>
          <button onClick={() => addBlock("image")} style={{ marginLeft: 10 }}>🖼️ إضافة صورة</button>
          <button onClick={() => addBlock("video")} style={{ marginLeft: 10 }}>🎥 إضافة فيديو</button>
        </div>

        <div style={{ marginTop: 30 }}>
          <button onClick={saveContent} style={{ padding: "10px 20px", backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: 5 }}>
            💾 حفظ المحتوى
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubPage;
