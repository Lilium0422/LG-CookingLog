package com.example.demo.controller

import com.example.demo.dto.PostCreateRequest
import com.example.demo.dto.PostResponse
import com.example.demo.dto.PostUpdateRequest
import com.example.demo.service.PostService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = ["*"])
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
}