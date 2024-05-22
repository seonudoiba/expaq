package com.abiodun.expaq.services;

import com.abiodun.expaq.models.BlogModel;
import com.abiodun.expaq.dto.response.BlogResponse;
import org.springframework.web.multipart.MultipartFile;

public interface BlogService {

    BlogResponse addBlog(BlogModel blogModel, MultipartFile blogImage);

    BlogResponse getAllBlogs();

    BlogResponse getBlogById(int id);

    BlogResponse updateBlog(BlogModel blogModel, MultipartFile blogImage);

    BlogResponse deleteBlogById(int id);
    
}
