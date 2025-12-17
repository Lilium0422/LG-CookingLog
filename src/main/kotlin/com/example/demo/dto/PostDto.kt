package com.example.demo.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

data class PostCreateRequest(
    @field:NotBlank(message = "게시글 제목은 필수입니다")
    val title: String,
    
    @field:NotBlank(message = "카테고리는 필수입니다")
    val category: String,
    
    @field:NotBlank(message = "내용은 필수입니다")
    val content: String,
    
    val imageUrl: String? = null,
    
    val mainIngredients: List<String> = emptyList(),
    
    val seasonings: List<String> = emptyList(),
    
    val tags: List<String> = emptyList(),
    
    @field:Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @field:Max(value = 5, message = "별점은 5점 이하여야 합니다")
    val rating: Int,
    
    @field:NotBlank(message = "사용자 닉네임은 필수입니다")
    val userNickname: String
)

data class PostUpdateRequest(
    val title: String? = null,
    val category: String? = null,
    val content: String? = null,
    val imageUrl: String? = null,
    val mainIngredients: List<String>? = null,
    val seasonings: List<String>? = null,
    val tags: List<String>? = null,
    
    @field:Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @field:Max(value = 5, message = "별점은 5점 이하여야 합니다")
    val rating: Int? = null
)

data class PostResponse(
    val id: Long,
    val title: String,
    val category: String,
    val content: String,
    val imageUrl: String?,
    val mainIngredients: List<String>,
    val seasonings: List<String>,
    val tags: List<String>,
    val rating: Int,
    val userNickname: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)