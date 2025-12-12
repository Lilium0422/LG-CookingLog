package com.example.demo.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

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
    val phoneNumber: String
)