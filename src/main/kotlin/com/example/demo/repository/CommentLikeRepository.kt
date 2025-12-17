package com.example.demo.repository

import com.example.demo.entity.CommentLike
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentLikeRepository : JpaRepository<CommentLike, Long> {
    fun existsByCommentIdAndUserNickname(commentId: Long, userNickname: String): Boolean
    fun findByCommentIdAndUserNickname(commentId: Long, userNickname: String): CommentLike?
    fun countByCommentId(commentId: Long): Long
    fun deleteByCommentIdAndUserNickname(commentId: Long, userNickname: String)
    fun deleteByCommentId(commentId: Long)
}