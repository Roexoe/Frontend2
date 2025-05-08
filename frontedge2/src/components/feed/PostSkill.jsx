import React, { useState } from "react";

const PostSkill = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    alert(`Skill Posted: ${title}`);
  };

  return (
    <form onSubmit={handlePost} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>Post a New Skill</h3>
      <input
        type="text"
        placeholder="Skill Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "0.5rem", width: "100%" }}
      />
      <textarea
        placeholder="Skill Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "0.5rem", width: "100%" }}
      />
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>Post</button>
    </form>
  );
};

export default PostSkill;