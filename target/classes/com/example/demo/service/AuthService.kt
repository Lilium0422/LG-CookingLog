package com.example.demo.service

import com.example.demo.dto.LoginRequest
import com.example.demo.dto.LoginResponse
import com.example.demo.dto.UserResponse
import com.example.demo.repository.UserRepository
import com.example.demo.util.JwtUtil
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil
) {
    
    fun login(request: LoginRequest): LoginResponse {
        val user = userRepository.findByUserId(request.userId)
            ?: throw RuntimeException("존재하지 않는 사용자입니다")
        
        if (!passwordEncoder.matches(request.password, user.password)) {
            throw RuntimeException("비밀번호가 일치하지 않습니다")
        }
        
        val token = jwtUtil.generateToken(user.userId)
        val userResponse = UserResponse(
            id = user.id,
            userId = user.userId,
            nickname = user.nickname,
            phoneNumber = user.phoneNumber
        )
        
        return LoginResponse(token = token, user = userResponse)
    }
}