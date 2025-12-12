package com.example.demo.service

import com.example.demo.dto.PostCreateRequest
import com.example.demo.dto.PostResponse
import com.example.demo.dto.PostUpdateRequest
import com.example.demo.entity.Post
import com.example.demo.repository.PostRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PostService(
    private val postRepository: PostRepository
) {
    
    fun createPost(request: PostCreateRequest): PostResponse {
        val post = Post(
            title = request.title,
            subtitle = request.subtitle,
            imageUrl = request.imageUrl,
            rating = request.rating,
            tags = request.tags,
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
        return postRepository.findByTitleOrSubtitleContaining(keyword)
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
            subtitle = request.subtitle ?: existingPost.subtitle,
            imageUrl = request.imageUrl ?: existingPost.imageUrl,
            rating = request.rating ?: existingPost.rating,
            tags = request.tags ?: existingPost.tags
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
            subtitle = post.subtitle,
            imageUrl = post.imageUrl,
            rating = post.rating,
            tags = post.tags,
            userNickname = post.userNickname,
            createdAt = post.createdAt,
            updatedAt = post.updatedAt
        )
    }
}