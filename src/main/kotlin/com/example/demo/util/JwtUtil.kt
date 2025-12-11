package com.example.demo.util

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*

@Component
class JwtUtil {
    
    private val secretKey: Key = Keys.secretKeyFor(SignatureAlgorithm.HS256)
    private val expiration = 86400000 // 24시간 (밀리초)
    
    fun generateToken(nickname: String): String {
        return Jwts.builder()
            .setSubject(nickname)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + expiration))
            .signWith(secretKey)
            .compact()
    }
    
    fun extractNickname(token: String): String {
        return extractClaim(token, Claims::getSubject)
    }
    
    fun extractExpiration(token: String): Date {
        return extractClaim(token, Claims::getExpiration)
    }
    
    fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }
    
    private fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .body
    }
    
    fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }
    
    fun validateToken(token: String, nickname: String): Boolean {
        val extractedNickname = extractNickname(token)
        return extractedNickname == nickname && !isTokenExpired(token)
    }
}