package com.example.demo.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class UserCreateRequest(
    @field:NotBlank(message = "사용자 아이디는 필수입니다")
    val userId: String,
    
    @field:NotBlank(message = "닉네임은 필수입니다")
    val nickname: String,
    
    @field:Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다")
    val phoneNumber: String,
    
    @field:NotBlank(message = "비밀번호는 필수입니다")
    val password: String
)

data class UserResponse(
    val id: Long,
    val userId: String,
    val nickname: String,
    val phoneNumber: String,
    val bio: String? = null,
    val survey: String? = null,
    val profileImageUrl: String? = null
)

data class UserUpdateRequest(
    @field:Size(max = 150, message = "자기소개는 150자 이하여야 합니다")
    val bio: String? = null,
    
    val survey: String? = null, // JSON 형태: {"level": "string", "interest": ["string"], "frequency": "string", "ingredient": ["string"]}
    
    val profileImageUrl: String? = null
)

// 파일 업로드용 별도 DTO (FormData 처리용)
data class UserProfileUpdateRequest(
    @field:Size(max = 150, message = "자기소개는 150자 이하여야 합니다")
    val bio: String? = null,
    
    val survey: String? = null // JSON string으로 받음
    // imageFile은 MultipartFile로 별도 처리
)