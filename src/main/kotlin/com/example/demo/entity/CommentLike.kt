package com.example.demo.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(
    name = "comment_likes",
    uniqueConstraints = [UniqueConstraint(columnNames = ["comment_id", "user_nickname"])]
)
data class CommentLike(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    val commentId: Long,
    
    @Column(nullable = false)
    val userNickname: String,
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)