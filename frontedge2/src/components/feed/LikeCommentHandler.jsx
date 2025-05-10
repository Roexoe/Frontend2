"use client"

import { useState } from "react"
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore"

const LikeCommentHandler = ({ skillId }) => {
  const [comment, setComment] = useState("")
  const db = getFirestore()

  const handleLike = async () => {
    const skillRef = doc(db, "skills", skillId)
    await updateDoc(skillRef, { likes: arrayUnion("currentUserId") })
  }

  const handleComment = async () => {
    const skillRef = doc(db, "skills", skillId)
    await updateDoc(skillRef, { comments: arrayUnion(comment) })
    setComment("")
  }

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" />
      <button onClick={handleComment}>Comment</button>
    </div>
  )
}

export default LikeCommentHandler
