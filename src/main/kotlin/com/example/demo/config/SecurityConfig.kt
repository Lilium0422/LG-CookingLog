package com.example.demo.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
    
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { authz ->
                authz
                    .requestMatchers("/").permitAll() // 루트 경로 허용
                    .requestMatchers("/error").permitAll() // 에러 페이지 허용
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/users").permitAll() // 회원가입 허용
                    .requestMatchers("/api/users/**").permitAll() // 사용자 관련 모든 API 허용
                    .requestMatchers("/api/posts/**").permitAll() // 게시글 관련 허용 (이미지 업로드 포함)
                    .requestMatchers("/uploads/**").permitAll() // 업로드된 파일 접근 허용
                    .anyRequest().authenticated()
            }
        
        return http.build()
    }
}