package com.example.demo.controller

import com.example.demo.dto.PostCreateRequest
import com.example.demo.dto.PostResponse
import com.example.demo.dto.PostUpdateRequest
import com.example.demo.service.PostService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(
    origins = ["*"],
    methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS],
    allowedHeaders = ["*"]
)
class PostController(
    private val postService: PostService
) {
    
    @PostMapping
    fun createPost(@Valid @RequestBody request: PostCreateRequest): ResponseEntity<Any> {
        return try {
            val response = postService.createPost(request)
            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
    
    @PostMapping("/with-image", consumes = ["multipart/form-data"])
    fun createPostWithImage(
        @RequestParam("title", required = false) title: String?,
        @RequestParam("category", required = false) category: String?,
        @RequestParam("content", required = false) content: String?,
        @RequestParam("mainIngredients", required = false, defaultValue = "[]") mainIngredients: String,
        @RequestParam("seasonings", required = false, defaultValue = "[]") seasonings: String,
        @RequestParam("tags", required = false, defaultValue = "[]") tags: String,
        @RequestParam("rating", required = false) rating: Int?,
        @RequestParam("userNickname", required = false) userNickname: String?,
        @RequestParam("imageFile", required = false) imageFile: MultipartFile?
    ): ResponseEntity<Any> {
        return try {
            // 필수 파라미터 검증
            if (title.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "제목은 필수입니다"))
            }
            if (category.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "카테고리는 필수입니다"))
            }
            if (content.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "내용은 필수입니다"))
            }
            if (rating == null || rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(mapOf("error" to "별점은 1-5 사이여야 합니다"))
            }
            if (userNickname.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "사용자 닉네임은 필수입니다"))
            }
            
            val response = postService.createPostWithImage(
                title = title,
                category = category,
                content = content,
                mainIngredients = mainIngredients,
                seasonings = seasonings,
                tags = tags,
                rating = rating,
                userNickname = userNickname,
                imageFile = imageFile
            )
            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to (e.message ?: "게시글 작성 중 오류가 발생했습니다")))
        }
    }
    
    @GetMapping
    fun getAllPosts(): ResponseEntity<List<PostResponse>> {
        val posts = postService.getAllPosts()
        return ResponseEntity.ok(posts)
    }
    
    @GetMapping("/{id}")
    fun getPostById(@PathVariable id: Long): ResponseEntity<PostResponse> {
        val post = postService.getPostById(id)
        return if (post != null) {
            ResponseEntity.ok(post)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/user/{userNickname}")
    fun getPostsByUser(@PathVariable userNickname: String): ResponseEntity<List<PostResponse>> {
        val posts = postService.getPostsByUser(userNickname)
        return ResponseEntity.ok(posts)
    }
    
    @GetMapping("/rating/{rating}")
    fun getPostsByRating(@PathVariable rating: Int): ResponseEntity<List<PostResponse>> {
        val posts = postService.getPostsByRating(rating)
        return ResponseEntity.ok(posts)
    }
    
    @GetMapping("/tag/{tag}")
    fun getPostsByTag(@PathVariable tag: String): ResponseEntity<List<PostResponse>> {
        val posts = postService.getPostsByTag(tag)
        return ResponseEntity.ok(posts)
    }
    
    @GetMapping("/search")
    fun searchPosts(@RequestParam keyword: String): ResponseEntity<List<PostResponse>> {
        val posts = postService.searchPosts(keyword)
        return ResponseEntity.ok(posts)
    }
    
    @GetMapping("/top-rated")
    fun getTopRatedPosts(): ResponseEntity<List<PostResponse>> {
        val posts = postService.getPostsByRatingDesc()
        return ResponseEntity.ok(posts)
    }
    
    @PutMapping("/{id}")
    fun updatePost(
        @PathVariable id: Long,
        @Valid @RequestBody request: PostUpdateRequest
    ): ResponseEntity<Any> {
        return try {
            val response = postService.updatePost(id, request)
            if (response != null) {
                ResponseEntity.ok(response)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
    
    @DeleteMapping("/{id}")
    fun deletePost(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            postService.deletePost(id)
            ResponseEntity.ok().build()
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
    
    @PutMapping("/with-image/{id}", consumes = ["multipart/form-data"])
    fun updatePostWithImage(
        @PathVariable id: Long,
        @RequestParam("title", required = false) title: String?,
        @RequestParam("category", required = false) category: String?,
        @RequestParam("content", required = false) content: String?,
        @RequestParam("mainIngredients", required = false, defaultValue = "[]") mainIngredients: String,
        @RequestParam("seasonings", required = false, defaultValue = "[]") seasonings: String,
        @RequestParam("tags", required = false, defaultValue = "[]") tags: String,
        @RequestParam("rating", required = false) rating: Int?,
        @RequestParam("userNickname", required = false) userNickname: String?,
        @RequestParam("imageFile", required = false) imageFile: MultipartFile?
    ): ResponseEntity<Any> {
        return try {
            // 필수 파라미터 검증
            if (title.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "제목은 필수입니다"))
            }
            if (category.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "카테고리는 필수입니다"))
            }
            if (content.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "내용은 필수입니다"))
            }
            if (rating == null || rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(mapOf("error" to "별점은 1-5 사이여야 합니다"))
            }
            if (userNickname.isNullOrBlank()) {
                return ResponseEntity.badRequest().body(mapOf("error" to "사용자 닉네임은 필수입니다"))
            }
            
            val response = postService.updatePostWithImage(
                id = id,
                title = title,
                category = category,
                content = content,
                mainIngredients = mainIngredients,
                seasonings = seasonings,
                tags = tags,
                rating = rating,
                userNickname = userNickname,
                imageFile = imageFile
            )
            
            if (response != null) {
                ResponseEntity.ok(response)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to (e.message ?: "게시글 수정 중 오류가 발생했습니다")))
        }
    }
    
    @PostMapping("/upload-image")
    fun uploadImage(@RequestParam("imageFile") imageFile: MultipartFile): ResponseEntity<Any> {
        return try {
            val imageUrl = postService.saveImageFile(imageFile)
            ResponseEntity.ok(mapOf("imageUrl" to imageUrl))
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}