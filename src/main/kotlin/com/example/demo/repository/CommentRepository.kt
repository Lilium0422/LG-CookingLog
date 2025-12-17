package com.example.demo.repository

import com.example.demo.entity.Comment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentRepository : JpaRepository<Comment, Long> {
    fun findByPostIdOrderByCreatedAtAsc(postId: Long): List<Comment>
    fun findByParentCommentIdOrderByCreatedAtAsc(parentCommentId: Long): List<Comment>
    fun countByPostId(postId: Long): Long
    fun deleteByPostId(postId: Long)
}