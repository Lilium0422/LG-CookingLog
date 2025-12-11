package com.example.demo.entity

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(unique = true, nullable = false)
    @field:NotBlank(message = "닉네임은 필수입니다")
    val nickname: String,
    
    @Column(unique = true, nullable = false)
    @field:Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다")
    val phoneNumber: String,
    
    @Column(nullable = false)
    @field:NotBlank(message = "비밀번호는 필수입니다")
    val password: String
)