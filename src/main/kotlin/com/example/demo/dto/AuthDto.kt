package com.example.demo.dto

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank(message = "사용자 아이디는 필수입니다")
    val userId: String,
    
    @field:NotBlank(message = "비밀번호는 필수입니다")
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: UserResponse
)