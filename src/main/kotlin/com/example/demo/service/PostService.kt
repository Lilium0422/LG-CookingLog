package com.example.demo.service

import com.example.demo.dto.PostCreateRequest
import com.example.demo.dto.PostResponse
import com.example.demo.dto.PostUpdateRequest
import com.example.demo.entity.Post
import com.example.demo.repository.PostRepository
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*

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
    
    fun createPostWithImage(
        title: String,
        category: String,
        content: String,
        mainIngredients: String,
        seasonings: String,
        tags: String,
        rating: Int,
        userNickname: String,
        imageFile: MultipartFile?
    ): PostResponse {
        // 이미지 파일 저장
        val imageUrl = imageFile?.let { saveImageFile(it) }
        
        // JSON 문자열을 List로 파싱
        val mainIngredientsList = try {
            objectMapper.readValue(mainIngredients, List::class.java) as List<String>
        } catch (e: Exception) {
            mainIngredients.split(",").map { it.trim() }
        }
        
        val seasoningsList = try {
            objectMapper.readValue(seasonings, List::class.java) as List<String>
        } catch (e: Exception) {
            seasonings.split(",").map { it.trim() }
        }
        
        val tagsList = try {
            objectMapper.readValue(tags, List::class.java) as List<String>
        } catch (e: Exception) {
            tags.split(",").map { it.trim() }
        }
        
        val post = Post(
            title = title,
            category = category,
            content = content,
            imageUrl = imageUrl,
            mainIngredients = objectMapper.writeValueAsString(mainIngredientsList),
            seasonings = objectMapper.writeValueAsString(seasoningsList),
            tags = objectMapper.writeValueAsString(tagsList),
            rating = rating,
            userNickname = userNickname
        )
        
        val savedPost = postRepository.save(post)
        return convertToResponse(savedPost)
    }
    
    fun updatePostWithImage(
        id: Long,
        title: String,
        category: String,
        content: String,
        mainIngredients: String,
        seasonings: String,
        tags: String,
        rating: Int,
        userNickname: String,
        imageFile: MultipartFile?
    ): PostResponse? {
        val existingPost = postRepository.findById(id).orElse(null)
            ?: throw RuntimeException("존재하지 않는 게시글입니다")
        
        // 새 이미지가 있으면 저장, 없으면 기존 이미지 유지
        val imageUrl = imageFile?.let { saveImageFile(it) } ?: existingPost.imageUrl
        
        // JSON 문자열을 List로 파싱
        val mainIngredientsList = try {
            objectMapper.readValue(mainIngredients, List::class.java) as List<String>
        } catch (e: Exception) {
            mainIngredients.split(",").map { it.trim() }
        }
        
        val seasoningsList = try {
            objectMapper.readValue(seasonings, List::class.java) as List<String>
        } catch (e: Exception) {
            seasonings.split(",").map { it.trim() }
        }
        
        val tagsList = try {
            objectMapper.readValue(tags, List::class.java) as List<String>
        } catch (e: Exception) {
            tags.split(",").map { it.trim() }
        }
        
        val updatedPost = existingPost.copy(
            title = title,
            category = category,
            content = content,
            imageUrl = imageUrl,
            mainIngredients = objectMapper.writeValueAsString(mainIngredientsList),
            seasonings = objectMapper.writeValueAsString(seasoningsList),
            tags = objectMapper.writeValueAsString(tagsList),
            rating = rating
        )
        
        val savedPost = postRepository.save(updatedPost)
        return convertToResponse(savedPost)
    }
    
    fun saveImageFile(imageFile: MultipartFile): String {
        if (imageFile.isEmpty) {
            throw RuntimeException("이미지 파일이 비어있습니다")
        }
        
        // 허용된 이미지 타입 확인
        val allowedTypes = listOf("image/jpeg", "image/jpg", "image/png", "image/gif")
        if (imageFile.contentType !in allowedTypes) {
            throw RuntimeException("지원하지 않는 이미지 형식입니다")
        }
        
        // 파일 크기 제한 (5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
            throw RuntimeException("이미지 파일 크기는 5MB를 초과할 수 없습니다")
        }
        
        val fileName = "${UUID.randomUUID()}_${imageFile.originalFilename}"
        val uploadDir = Paths.get("uploads/posts")
        val filePath = uploadDir.resolve(fileName)
        
        // 디렉토리 생성
        Files.createDirectories(filePath.parent)
        
        // 파일 저장
        Files.copy(imageFile.inputStream, filePath)
        
        return "/uploads/posts/$fileName"
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