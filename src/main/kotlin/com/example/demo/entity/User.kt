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
    @field:NotBlank(message = "사용자 아이디는 필수입니다")
    val userId: String,
    
    @Column(unique = true, nullable = false)
    @field:NotBlank(message = "닉네임은 필수입니다")
    val nickname: String,
    
    @Column(unique = true, nullable = false)
    @field:Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다")
    val phoneNumber: String,
    
    @Column(nullable = false)
    @field:NotBlank(message = "비밀번호는 필수입니다")
    val password: String,
    
    // 마이페이지 추가 필드들
    @Column(length = 150)
    val bio: String? = null,
    
    @Column(columnDefinition = "TEXT")
    val survey: String? = null, // JSON 형태로 저장
    
    @Column
    val profileImageUrl: String? = null
)