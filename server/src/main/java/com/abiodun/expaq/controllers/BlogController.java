package com.abiodun.expaq.controllers;

import com.abiodun.expaq.models.BlogModel;
import com.abiodun.expaq.dto.response.BlogResponse;
import com.abiodun.expaq.services.BlogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class BlogController {

    public BlogService blogService;
    ObjectMapper objectMapper;
    
    public BlogController(BlogService blogService, ObjectMapper mapper) {
        this.blogService = blogService;
        this.objectMapper = mapper;
    }

    @PostMapping("/addBlog")
    public ResponseEntity<BlogResponse> addBlog(
        @RequestParam("blog_image") MultipartFile blogImage,
        @RequestParam("blog_data") String blogData
    ){
        BlogResponse BlogResponse = new BlogResponse();
        try {
            BlogModel blogModel = null;
            blogModel = objectMapper.readValue(blogData, BlogModel.class);
            BlogResponse = blogService.addBlog(blogModel,blogImage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(BlogResponse,HttpStatus.OK);
    }

    @GetMapping("/allBlogs")
    public ResponseEntity<BlogResponse> getAllBlogs(){
        BlogResponse BlogResponse = new BlogResponse();
        try {
            BlogResponse = blogService.getAllBlogs();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(BlogResponse,HttpStatus.OK);
    }

    @GetMapping("/allBlogs/{id}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable int id){
        BlogResponse BlogResponse = new BlogResponse();
        try {
            BlogResponse = blogService.getBlogById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(BlogResponse,HttpStatus.OK);
    }

    @PostMapping("/updateBlog")
    public ResponseEntity<BlogResponse> updateBlog(
        @RequestParam("blog_image") MultipartFile blogImage,
        @RequestParam("blog_data") String blogData
    ){
        BlogResponse BlogResponse = new BlogResponse();
        try {
            BlogModel blogModel = null;
            blogModel = objectMapper.readValue(blogData, BlogModel.class);
            BlogResponse = blogService.updateBlog(blogModel,blogImage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(BlogResponse,HttpStatus.OK);
    }


    @GetMapping("/deleteBlogById/{id}")
    public ResponseEntity<BlogResponse> deleteBlogById(@PathVariable int id){
        BlogResponse BlogResponse = new BlogResponse();
        try {
            BlogResponse = blogService.deleteBlogById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(BlogResponse,HttpStatus.OK);
    }

}
