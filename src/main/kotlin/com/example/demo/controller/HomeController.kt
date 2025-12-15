package com.example.demo.controller

import com.example.demo.repository.UserRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HomeController(
    private val userRepository: UserRepository
) {
    
    @GetMapping("/")
    fun home(): Map<String, Any> {
        return mapOf(
            "message" to "CookingLog API Server is running!",
            "status" to "OK",
            "endpoints" to mapOf(
                "login_info" to "GET /api/auth/login",
                "login" to "POST /api/auth/login",
                "signup" to "POST /api/users",
                "users" to "GET /api/users",
                "db_test" to "GET /api/db-test"
            )
        )
    }
    
    @GetMapping("/api/db-test")
    fun dbTest(): Map<String, Any> {
        return try {
            // 간단한 쿼리로 연결 테스트
            val userCount = userRepository.count()
            val users = userRepository.findAll().map { it.userId }
            
            mapOf(
                "database" to "connected",
                "userCount" to userCount,
                "userIds" to users
            )
        } catch (e: Exception) {
            mapOf(
                "database" to "error",
                "error" to (e.message ?: "Unknown error")
            )
        }
    }
}