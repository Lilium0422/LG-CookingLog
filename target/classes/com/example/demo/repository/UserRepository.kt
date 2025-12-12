package com.example.demo.repository

import com.example.demo.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUserId(userId: String): User?
    fun findByNickname(nickname: String): User?
    fun findByPhoneNumber(phoneNumber: String): User?
    fun existsByUserId(userId: String): Boolean
    fun existsByNickname(nickname: String): Boolean
    fun existsByPhoneNumber(phoneNumber: String): Boolean
}