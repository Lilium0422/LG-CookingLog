package com.example.demo.dto

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank(message = "닉네임은 필수입니다")
    val nickname: String,
    
    @field:NotBlank(message = "비밀번호는 필수입니다")
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: UserResponse
)