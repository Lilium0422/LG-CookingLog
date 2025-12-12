package com.example.demo.entity

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "posts")
data class Post(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    @field:NotBlank(message = "게시글 제목은 필수입니다")
    val title: String,
    
    @Column(nullable = true)
    val subtitle: String? = null,
    
    @Column(nullable = true)
    val imageUrl: String? = null,
    
    @Column(nullable = false)
    @field:Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @field:Max(value = 5, message = "별점은 5점 이하여야 합니다")
    val rating: Int,
    
    @Column(nullable = true)
    val tags: String? = null, // JSON 형태로 저장하거나 쉼표로 구분
    
    @Column(nullable = false)
    @field:NotBlank(message = "사용자 닉네임은 필수입니다")
    val userNickname: String,
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @UpdateTimestamp
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)