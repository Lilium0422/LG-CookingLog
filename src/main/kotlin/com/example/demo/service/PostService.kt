package com.example.demo.service

import com.example.demo.dto.PostCreateRequest
import com.example.demo.dto.PostResponse
import com.example.demo.dto.PostUpdateRequest
import com.example.demo.entity.Post
import com.example.demo.repository.PostRepository
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PostService(
    private val postRepository: PostRepository
) {
    private val objectMapper = jacksonObjectMapper()
    
    fun createPost(request: PostCreateRequest): PostResponse {
        val post = Post(
            title = request.title,
            category = request.category,
            content = request.content,
            imageUrl = request.imageUrl,
            mainIngredients = objectMapper.writeValueAsString(request.mainIngredients),
            seasonings = objectMapper.writeValueAsString(request.seasonings),
            tags = objectMapper.writeValueAsString(request.tags),
            rating = request.rating,
            userNickname = request.userNickname
        )
        
        val savedPost = postRepository.save(post)
        return convertToResponse(savedPost)
    }
    
    @Transactional(readOnly = true)
    fun getAllPosts(): List<PostResponse> {
        return postRepository.findAllByOrderByCreatedAtDesc()
            .map { convertToResponse(it) }
    }
    
    @Transactional(readOnly = true)
    fun getPostById(id: Long): PostResponse? {
        return postRepository.findById(id).orElse(null)?.let {
            convertToResponse(it)
        }
    }
    
    @Transactional(readOnly = true)
    fun getPostsByUser(userNickname: String): List<PostResponse> {
        return postRepository.findByUserNickname(userNickname)
            .map { convertToResponse(it) }
    }
    
    @Transactional(readOnly = true)
    fun getPostsByRating(rating: Int): List<PostResponse> {
        return postRepository.findByRating(rating)
            .map { convertToResponse(it) }
    }
    
    @Transactional(readOnly = true)
    fun getPostsByTag(tag: String): List<PostResponse> {
        return postRepository.findByTagsContaining(tag)
            .map { convertToResponse(it) }
    }
    
    @Transactional(readOnly = true)
    fun searchPosts(keyword: String): List<PostResponse> {
        return postRepository.findByTitleOrContentContaining(keyword)
            .map { convertToResponse(it) }
    }
    
    @Transactional(readOnly = true)
    fun getPostsByRatingDesc(): List<PostResponse> {
        return postRepository.findAllByOrderByRatingDesc()
            .map { convertToResponse(it) }
    }
    
    fun updatePost(id: Long, request: PostUpdateRequest): PostResponse? {
        val existingPost = postRepository.findById(id).orElse(null)
            ?: throw RuntimeException("존재하지 않는 게시글입니다")
        
        val updatedPost = existingPost.copy(
            title = request.title ?: existingPost.title,
            category = request.category ?: existingPost.category,
            content = request.content ?: existingPost.content,
            imageUrl = request.imageUrl ?: existingPost.imageUrl,
            mainIngredients = request.mainIngredients?.let { objectMapper.writeValueAsString(it) } ?: existingPost.mainIngredients,
            seasonings = request.seasonings?.let { objectMapper.writeValueAsString(it) } ?: existingPost.seasonings,
            tags = request.tags?.let { objectMapper.writeValueAsString(it) } ?: existingPost.tags,
            rating = request.rating ?: existingPost.rating
        )
        
        val savedPost = postRepository.save(updatedPost)
        return convertToResponse(savedPost)
    }
    
    fun deletePost(id: Long) {
        if (!postRepository.existsById(id)) {
            throw RuntimeException("존재하지 않는 게시글입니다")
        }
        postRepository.deleteById(id)
    }
    
    private fun convertToResponse(post: Post): PostResponse {
        return PostResponse(
            id = post.id,
            title = post.title,
            category = post.category,
            content = post.content,
            imageUrl = post.imageUrl,
            mainIngredients = objectMapper.readValue(post.mainIngredients, List::class.java) as List<String>,
            seasonings = objectMapper.readValue(post.seasonings, List::class.java) as List<String>,
            tags = objectMapper.readValue(post.tags, List::class.java) as List<String>,
            rating = post.rating,
            userNickname = post.userNickname,
            createdAt = post.createdAt,
            updatedAt = post.updatedAt
        )
    }
}