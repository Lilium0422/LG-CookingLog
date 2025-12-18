package com.example.demo.entity

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "comments")
data class Comment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    @field:NotBlank(message = "댓글 내용은 필수입니다")
    val content: String,
    
    @Column(nullable = false)
    val postId: Long,
    
    @Column(nullable = false)
    @field:NotBlank(message = "사용자 닉네임은 필수입니다")
    val userNickname: String,
    
    @Column(nullable = true)
    @field:Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @field:Max(value = 5, message = "별점은 5점 이하여야 합니다")
    val rating: Int? = null, // 대댓글인 경우 null
    
    @Column(nullable = true)
    val likeCount: Int? = null, // 대댓글인 경우 null
    
    @Column(nullable = true)
    val parentCommentId: Long? = null, // 대댓글을 위한 필드
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @UpdateTimestamp
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)