package com.example.demo.repository

import com.example.demo.entity.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostRepository : JpaRepository<Post, Long> {
    
    fun findByUserNickname(userNickname: String): List<Post>
    
    fun findByRating(rating: Int): List<Post>
    
    @Query("SELECT p FROM Post p WHERE p.tags LIKE %:tag%")
    fun findByTagsContaining(tag: String): List<Post>
    
    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.subtitle LIKE %:keyword%")
    fun findByTitleOrSubtitleContaining(keyword: String): List<Post>
    
    fun findAllByOrderByCreatedAtDesc(): List<Post>
    
    fun findAllByOrderByRatingDesc(): List<Post>
}