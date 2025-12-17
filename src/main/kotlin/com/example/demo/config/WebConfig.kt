package com.example.demo.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        // /uploads/** 경로를 uploads/ 폴더에 매핑
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/")
    }
}