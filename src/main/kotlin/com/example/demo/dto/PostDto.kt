package com.example.demo.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

data class PostCreateRequest(
    @field:NotBlank(message = "게시글 제목은 필수입니다")
    val title: String,
    
    val subtitle: String? = null,
    
    val imageUrl: String? = null,
    
    @field:Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @field:Max(value = 5, message = "별점은 5점 이하여야 합니다")
    val rating: Int,
    
    val tags: String? = null,
    
    @field:NotBlank(message = "사용자 닉네임은 필수입니다")
    val userNickname: String
)

data class PostUpdateRequest(
    val title: String? = null,
    val subtitle: String? = null,
    val imageUrl: String? = null,
    
    @field:Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @field:Max(value = 5, message = "별점은 5점 이하여야 합니다")
    val rating: Int? = null,
    
    val tags: String? = null
)

data class PostResponse(
    val id: Long,
    val title: String,
    val subtitle: String?,
    val imageUrl: String?,
    val rating: Int,
    val tags: String?,
    val userNickname: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)