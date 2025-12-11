package com.example.demo.service

import com.example.demo.dto.UserCreateRequest
import com.example.demo.dto.UserResponse
import com.example.demo.entity.User
import com.example.demo.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    
    fun createUser(request: UserCreateRequest): UserResponse {
        // 중복 체크
        if (userRepository.existsByNickname(request.nickname)) {
            throw RuntimeException("이미 존재하는 닉네임입니다")
        }
        
        if (userRepository.existsByPhoneNumber(request.phoneNumber)) {
            throw RuntimeException("이미 존재하는 전화번호입니다")
        }
        
        // 비밀번호 암호화
        val encodedPassword = passwordEncoder.encode(request.password)
        
        val user = User(
            nickname = request.nickname,
            phoneNumber = request.phoneNumber,
            password = encodedPassword
        )
        
        val savedUser = userRepository.save(user)
        
        return UserResponse(
            id = savedUser.id,
            nickname = savedUser.nickname,
            phoneNumber = savedUser.phoneNumber
        )
    }
    
    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll().map { user ->
            UserResponse(
                id = user.id,
                nickname = user.nickname,
                phoneNumber = user.phoneNumber
            )
        }
    }
    
    @Transactional(readOnly = true)
    fun getUserById(id: Long): UserResponse? {
        return userRepository.findById(id).orElse(null)?.let { user ->
            UserResponse(
                id = user.id,
                nickname = user.nickname,
                phoneNumber = user.phoneNumber
            )
        }
    }
    
    @Transactional(readOnly = true)
    fun getUserByNickname(nickname: String): UserResponse? {
        return userRepository.findByNickname(nickname)?.let { user ->
            UserResponse(
                id = user.id,
                nickname = user.nickname,
                phoneNumber = user.phoneNumber
            )
        }
    }
    
    fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) {
            throw RuntimeException("존재하지 않는 사용자입니다")
        }
        userRepository.deleteById(id)
    }
}