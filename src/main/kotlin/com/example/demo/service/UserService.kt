package com.example.demo.service

import com.example.demo.dto.UserCreateRequest
import com.example.demo.dto.UserResponse
import com.example.demo.dto.UserUpdateRequest
import com.example.demo.entity.User
import com.example.demo.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    
    fun createUser(request: UserCreateRequest): UserResponse {
        // 중복 체크
        if (userRepository.existsByUserId(request.userId)) {
            throw RuntimeException("이미 존재하는 사용자 아이디입니다")
        }
        
        if (userRepository.existsByNickname(request.nickname)) {
            throw RuntimeException("이미 존재하는 닉네임입니다")
        }
        
        if (userRepository.existsByPhoneNumber(request.phoneNumber)) {
            throw RuntimeException("이미 존재하는 전화번호입니다")
        }
        
        // 비밀번호 암호화
        val encodedPassword = passwordEncoder.encode(request.password)
        
        val user = User(
            userId = request.userId,
            nickname = request.nickname,
            phoneNumber = request.phoneNumber,
            password = encodedPassword
        )
        
        val savedUser = userRepository.save(user)
        
        return UserResponse(
            id = savedUser.id,
            userId = savedUser.userId,
            nickname = savedUser.nickname,
            phoneNumber = savedUser.phoneNumber,
            bio = savedUser.bio,
            survey = savedUser.survey,
            profileImageUrl = savedUser.profileImageUrl
        )
    }
    
    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll().map { user ->
            UserResponse(
                id = user.id,
                userId = user.userId,
                nickname = user.nickname,
                phoneNumber = user.phoneNumber,
                bio = user.bio,
                survey = user.survey,
                profileImageUrl = user.profileImageUrl
            )
        }
    }
    
    @Transactional(readOnly = true)
    fun getUserById(id: Long): UserResponse? {
        return userRepository.findById(id).orElse(null)?.let { user ->
            UserResponse(
                id = user.id,
                userId = user.userId,
                nickname = user.nickname,
                phoneNumber = user.phoneNumber,
                bio = user.bio,
                survey = user.survey,
                profileImageUrl = user.profileImageUrl
            )
        }
    }
    
    @Transactional(readOnly = true)
    fun getUserByNickname(nickname: String): UserResponse? {
        return userRepository.findByNickname(nickname)?.let { user ->
            UserResponse(
                id = user.id,
                userId = user.userId,
                nickname = user.nickname,
                phoneNumber = user.phoneNumber,
                bio = user.bio,
                survey = user.survey,
                profileImageUrl = user.profileImageUrl
            )
        }
    }
    
    fun updateUser(id: Long, request: UserUpdateRequest): UserResponse? {
        val existingUser = userRepository.findById(id).orElse(null) ?: return null
        
        val updatedUser = existingUser.copy(
            bio = request.bio ?: existingUser.bio,
            survey = request.survey ?: existingUser.survey,
            profileImageUrl = request.profileImageUrl ?: existingUser.profileImageUrl
        )
        
        val savedUser = userRepository.save(updatedUser)
        
        return UserResponse(
            id = savedUser.id,
            userId = savedUser.userId,
            nickname = savedUser.nickname,
            phoneNumber = savedUser.phoneNumber,
            bio = savedUser.bio,
            survey = savedUser.survey,
            profileImageUrl = savedUser.profileImageUrl
        )
    }
    
    fun updateUserProfile(id: Long, bio: String?, survey: String?, imageFile: MultipartFile?): UserResponse? {
        val existingUser = userRepository.findById(id).orElse(null) ?: return null
        
        // 이미지 파일 처리
        var profileImageUrl = existingUser.profileImageUrl
        if (imageFile != null && !imageFile.isEmpty) {
            profileImageUrl = saveImageFile(imageFile)
        }
        
        val updatedUser = existingUser.copy(
            bio = bio ?: existingUser.bio,
            survey = survey ?: existingUser.survey,
            profileImageUrl = profileImageUrl
        )
        
        val savedUser = userRepository.save(updatedUser)
        
        return UserResponse(
            id = savedUser.id,
            userId = savedUser.userId,
            nickname = savedUser.nickname,
            phoneNumber = savedUser.phoneNumber,
            bio = savedUser.bio,
            survey = savedUser.survey,
            profileImageUrl = savedUser.profileImageUrl
        )
    }
    
    private fun saveImageFile(imageFile: MultipartFile): String {
        // 파일 저장 로직 (간단한 예시)
        val uploadDir = "uploads/profiles/"
        val fileName = "${UUID.randomUUID()}_${imageFile.originalFilename}"
        val filePath = Paths.get(uploadDir + fileName)
        
        // 디렉토리 생성
        Files.createDirectories(filePath.parent)
        
        // 파일 저장
        Files.copy(imageFile.inputStream, filePath)
        
        return "/uploads/profiles/$fileName"
    }
    
    fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) {
            throw RuntimeException("존재하지 않는 사용자입니다")
        }
        userRepository.deleteById(id)
    }
}