package com.example.demo.controller

import com.example.demo.dto.UserCreateRequest
import com.example.demo.dto.UserResponse
import com.example.demo.dto.UserUpdateRequest
import com.example.demo.dto.UserProfileUpdateRequest
import com.example.demo.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["*"])
class UserController(
    private val userService: UserService
) {
    
    @PostMapping
    fun createUser(@Valid @RequestBody request: UserCreateRequest): ResponseEntity<Any> {
        return try {
            val response = userService.createUser(request)
            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
    
    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserResponse>> {
        val users = userService.getAllUsers()
        return ResponseEntity.ok(users)
    }
    
    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserResponse> {
        val user = userService.getUserById(id)
        return if (user != null) {
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/nickname/{nickname}")
    fun getUserByNickname(@PathVariable nickname: String): ResponseEntity<UserResponse> {
        val user = userService.getUserByNickname(nickname)
        return if (user != null) {
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PutMapping("/{id}")
    fun updateUser(
        @PathVariable id: Long,
        @Valid @RequestBody request: UserUpdateRequest
    ): ResponseEntity<Any> {
        return try {
            val response = userService.updateUser(id, request)
            if (response != null) {
                ResponseEntity.ok(response)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
    
    @PutMapping("/{id}/profile")
    fun updateUserProfile(
        @PathVariable id: Long,
        @RequestParam("bio") bio: String?,
        @RequestParam("survey") survey: String?,
        @RequestParam("imageFile") imageFile: MultipartFile?
    ): ResponseEntity<Any> {
        return try {
            val response = userService.updateUserProfile(id, bio, survey, imageFile)
            if (response != null) {
                ResponseEntity.ok(response)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
    
    @GetMapping("/check-userid/{userId}")
    fun checkUserIdDuplicate(@PathVariable userId: String): ResponseEntity<Map<String, Any>> {
        val isDuplicate = userService.isUserIdDuplicate(userId)
        return ResponseEntity.ok(mapOf(
            "isDuplicate" to isDuplicate,
            "message" to if (isDuplicate) "이미 사용 중인 아이디입니다" else "사용 가능한 아이디입니다"
        ))
    }
    
    @GetMapping("/check-nickname/{nickname}")
    fun checkNicknameDuplicate(@PathVariable nickname: String): ResponseEntity<Map<String, Any>> {
        val isDuplicate = userService.isNicknameDuplicate(nickname)
        return ResponseEntity.ok(mapOf(
            "isDuplicate" to isDuplicate,
            "message" to if (isDuplicate) "이미 사용 중인 닉네임입니다" else "사용 가능한 닉네임입니다"
        ))
    }
    
    @GetMapping("/check-phone/{phoneNumber}")
    fun checkPhoneNumberDuplicate(@PathVariable phoneNumber: String): ResponseEntity<Map<String, Any>> {
        val isDuplicate = userService.isPhoneNumberDuplicate(phoneNumber)
        return ResponseEntity.ok(mapOf(
            "isDuplicate" to isDuplicate,
            "message" to if (isDuplicate) "이미 사용 중인 전화번호입니다" else "사용 가능한 전화번호입니다"
        ))
    }
    
    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            userService.deleteUser(id)
            ResponseEntity.ok().build()
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}