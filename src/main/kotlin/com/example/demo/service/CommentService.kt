package com.example.demo.service

import com.example.demo.dto.CommentCreateRequest
import com.example.demo.dto.CommentResponse
import com.example.demo.dto.CommentUpdateRequest
import com.example.demo.entity.Comment
import com.example.demo.entity.CommentLike
import com.example.demo.repository.CommentRepository
import com.example.demo.repository.CommentLikeRepository
import com.example.demo.repository.PostRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class CommentService(
    private val commentRepository: CommentRepository,
    private val commentLikeRepository: CommentLikeRepository,
    private val postRepository: PostRepository,
    private val userRepository: com.example.demo.repository.UserRepository
) {
    
    fun createComment(postId: Long, userNickname: String, request: CommentCreateRequest): CommentResponse {
        // 게시글 존재 확인
        if (!postRepository.existsById(postId)) {
            throw RuntimeException("존재하지 않는 게시글입니다")
        }
        
        // 부모 댓글 존재 확인 (대댓글인 경우)
        if (request.parentCommentId != null) {
            val parentComment = commentRepository.findById(request.parentCommentId)
                .orElseThrow { RuntimeException("존재하지 않는 댓글입니다") }
            
            // 부모 댓글이 같은 게시글에 속하는지 확인
            if (parentComment.postId != postId) {
                throw RuntimeException("잘못된 댓글 참조입니다")
            }
        }
        
        // 대댓글인지 확인
        val isReply = request.parentCommentId != null
        
        val comment = Comment(
            content = request.content,
            postId = postId,
            userNickname = userNickname,
            rating = if (isReply) null else request.rating, // 대댓글이면 별점 없음
            likeCount = if (isReply) null else 0, // 대댓글이면 좋아요 없음
            parentCommentId = request.parentCommentId
        )
        
        val savedComment = commentRepository.save(comment)
        
        // 사용자 프로필 이미지 조회
        val user = userRepository.findByNickname(userNickname)
        
        return CommentResponse(
            id = savedComment.id,
            content = savedComment.content,
            postId = savedComment.postId,
            userNickname = savedComment.userNickname,
            userProfileImageUrl = user?.profileImageUrl,
            rating = savedComment.rating,
            likeCount = savedComment.likeCount,
            parentCommentId = savedComment.parentCommentId,
            createdAt = savedComment.createdAt,
            updatedAt = savedComment.updatedAt
        )
    }
    
    @Transactional(readOnly = true)
    fun getCommentsByPostId(postId: Long, currentUserNickname: String? = null): List<CommentResponse> {
        val allComments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
        
        // 부모 댓글들만 먼저 가져오기
        val parentComments = allComments.filter { it.parentCommentId == null }
        
        // 각 부모 댓글에 대댓글들 추가
        return parentComments.map { parentComment ->
            val replies = allComments
                .filter { it.parentCommentId == parentComment.id }
                .map { reply ->
                    // 대댓글 작성자 프로필 이미지 조회
                    val replyUser = userRepository.findByNickname(reply.userNickname)
                    
                    CommentResponse(
                        id = reply.id,
                        content = reply.content,
                        postId = reply.postId,
                        userNickname = reply.userNickname,
                        userProfileImageUrl = replyUser?.profileImageUrl,
                        rating = null, // 대댓글은 별점 없음
                        likeCount = null, // 대댓글은 좋아요 없음
                        isLikedByUser = null, // 대댓글은 좋아요 없음
                        parentCommentId = reply.parentCommentId,
                        createdAt = reply.createdAt,
                        updatedAt = reply.updatedAt
                    )
                }
            
            val isLikedByUser = currentUserNickname?.let { 
                commentLikeRepository.existsByCommentIdAndUserNickname(parentComment.id, it) 
            } ?: false
            
            // 부모 댓글 작성자 프로필 이미지 조회
            val parentUser = userRepository.findByNickname(parentComment.userNickname)
            
            CommentResponse(
                id = parentComment.id,
                content = parentComment.content,
                postId = parentComment.postId,
                userNickname = parentComment.userNickname,
                userProfileImageUrl = parentUser?.profileImageUrl,
                rating = parentComment.rating,
                likeCount = parentComment.likeCount,
                isLikedByUser = isLikedByUser,
                parentCommentId = parentComment.parentCommentId,
                replies = replies,
                createdAt = parentComment.createdAt,
                updatedAt = parentComment.updatedAt
            )
        }
    }
    
    fun updateComment(commentId: Long, userNickname: String, request: CommentUpdateRequest): CommentResponse {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { RuntimeException("존재하지 않는 댓글입니다") }
        
        // 댓글 작성자 확인
        if (comment.userNickname != userNickname) {
            throw RuntimeException("댓글 수정 권한이 없습니다")
        }
        
        // 대댓글인지 확인
        val isReply = comment.parentCommentId != null
        
        val updatedComment = comment.copy(
            content = request.content,
            rating = if (isReply) null else request.rating // 대댓글이면 별점 수정 안함
        )
        val savedComment = commentRepository.save(updatedComment)
        
        // 사용자 프로필 이미지 조회
        val user = userRepository.findByNickname(userNickname)
        
        return CommentResponse(
            id = savedComment.id,
            content = savedComment.content,
            postId = savedComment.postId,
            userNickname = savedComment.userNickname,
            userProfileImageUrl = user?.profileImageUrl,
            rating = savedComment.rating,
            likeCount = savedComment.likeCount,
            parentCommentId = savedComment.parentCommentId,
            createdAt = savedComment.createdAt,
            updatedAt = savedComment.updatedAt
        )
    }
    
    fun deleteComment(commentId: Long, userNickname: String) {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { RuntimeException("존재하지 않는 댓글입니다") }
        
        // 댓글 작성자 확인
        if (comment.userNickname != userNickname) {
            throw RuntimeException("댓글 삭제 권한이 없습니다")
        }
        
        // 대댓글이 있는 경우 함께 삭제
        if (comment.parentCommentId == null) {
            val replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(commentId)
            commentRepository.deleteAll(replies)
        }
        
        commentRepository.deleteById(commentId)
    }
    
    @Transactional(readOnly = true)
    fun getCommentCount(postId: Long): Long {
        return commentRepository.countByPostId(postId)
    }
    
    fun toggleCommentLike(commentId: Long, userNickname: String): Map<String, Any> {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { RuntimeException("존재하지 않는 댓글입니다") }
        
        // 대댓글인 경우 좋아요 기능 사용 불가
        if (comment.parentCommentId != null) {
            throw RuntimeException("대댓글에는 좋아요 기능이 없습니다")
        }
        
        val existingLike = commentLikeRepository.findByCommentIdAndUserNickname(commentId, userNickname)
        val currentLikeCount = comment.likeCount ?: 0
        
        return if (existingLike != null) {
            // 좋아요 취소
            commentLikeRepository.deleteByCommentIdAndUserNickname(commentId, userNickname)
            val newLikeCount = currentLikeCount - 1
            val updatedComment = comment.copy(likeCount = newLikeCount)
            commentRepository.save(updatedComment)
            
            mapOf(
                "isLiked" to false,
                "likeCount" to newLikeCount,
                "message" to "좋아요를 취소했습니다"
            )
        } else {
            // 좋아요 추가
            val commentLike = CommentLike(
                commentId = commentId,
                userNickname = userNickname
            )
            commentLikeRepository.save(commentLike)
            
            val newLikeCount = currentLikeCount + 1
            val updatedComment = comment.copy(likeCount = newLikeCount)
            commentRepository.save(updatedComment)
            
            mapOf(
                "isLiked" to true,
                "likeCount" to newLikeCount,
                "message" to "좋아요를 눌렀습니다"
            )
        }
    }
}