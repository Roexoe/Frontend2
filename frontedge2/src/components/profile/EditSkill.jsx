import React, { useState } from "react";

const EditSkill = ({ skill, onSave, onCancel, onMediaChange, media, setMedia }) => {
  const [title, setTitle] = useState(skill.title || "");
  const [description, setDescription] = useState(skill.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media preview (voor 1 afbeelding/video)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    const newMedia = [{ url, type, file }];
    setMedia(newMedia);
    if (onMediaChange) onMediaChange(newMedia);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      ...skill,
      title,
      description,
      media,
    });
    setIsSubmitting(false);
  };

  return (
    <form className="edit-skill-form" onSubmit={handleSubmit}>
      <h3>Vaardigheid bewerken</h3>
      <div className="form-group">
        <label>Titel</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Beschrijving</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>
      <div className="form-group">
        <label>Media</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        <div className="media-preview">
          {media && media.length > 0 && (
            media[0].type === "image" ? (
              <img
                src={media[0].url}
                alt="Preview"
                className="media-preview-item"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            ) : (
              <video
                src={media[0].url}
                controls
                className="media-preview-item"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            )
          )}
        </div>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Annuleren
        </button>
        <button type="submit" className="primary" disabled={isSubmitting}>
          Opslaan
        </button>
      </div>
    </form>
  );
};

export default EditSkill;