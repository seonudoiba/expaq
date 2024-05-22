package com.abiodun.expaq.services.impl;

import com.abiodun.expaq.models.BlogModel;
import com.abiodun.expaq.repository.BlogRepository;
import com.abiodun.expaq.dto.response.BlogResponse;
import com.abiodun.expaq.services.BlogService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {

    public BlogRepository blogRepository;

    public BlogServiceImpl(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @Override
    public BlogResponse addBlog(BlogModel blogModel, MultipartFile blogImage) {
        BlogResponse BlogResponse = new BlogResponse();
        try {

            if (blogModel != null && !blogImage.isEmpty()) {

                // file upload start
                File savFile = new ClassPathResource("static/blogImages").getFile();
                Path path = Paths.get(savFile.getAbsolutePath() + File.separator + blogImage.getOriginalFilename());
                Files.copy(blogImage.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                // file upload end

                BlogModel blogModel2 = new BlogModel();
                blogModel2.setBlogTitle(blogModel.getBlogTitle());
                blogModel2.setBlogDescription(blogModel.getBlogDescription());
                blogModel2.setBlogImage(blogImage.getOriginalFilename());

                BlogModel b = blogRepository.save(blogModel2);

                BlogResponse.setData(b);
                BlogResponse.setMessage("Blog added successfully");
                BlogResponse.setStatus(true);

            } else {
                BlogResponse.setMessage("Blog addtion failed!");
                BlogResponse.setStatus(false);
            }
        } catch (Exception e) {
            BlogResponse.setMessage(e.getMessage());
            BlogResponse.setStatus(false);
        }
        return BlogResponse;
    }

    @Override
    public BlogResponse getAllBlogs() {
        BlogResponse BlogResponse = new BlogResponse();
        try {
            List<BlogModel> allBlogs = blogRepository.findAll();
            if (!allBlogs.isEmpty()) {
                BlogResponse.setData(allBlogs);
                BlogResponse.setMessage("All Blogs");
                BlogResponse.setStatus(true);
            } else {
                BlogResponse.setMessage("No Blogs");
                BlogResponse.setStatus(false);
            }
        } catch (Exception e) {
            BlogResponse.setMessage(e.getMessage());
            BlogResponse.setStatus(false);
        }
        return BlogResponse;
    }

    @Override
    public BlogResponse getBlogById(int id) {
        BlogResponse BlogResponse = new BlogResponse();
        try {

            Optional<BlogModel> myBlog = blogRepository.findById(id);
            if (myBlog.isPresent()) {
                BlogModel blogModel = myBlog.get();
                BlogResponse.setData(blogModel);
                BlogResponse.setMessage("Blog details");
                BlogResponse.setStatus(true);
            } else {
                BlogResponse.setMessage("No blog details");
                BlogResponse.setStatus(false);
            }
        } catch (Exception e) {
            BlogResponse.setMessage(e.getMessage());
            BlogResponse.setStatus(false);
        }
        return BlogResponse;
    }

    @Override
    public BlogResponse updateBlog(BlogModel blogModel, MultipartFile blogImage) {
        BlogResponse BlogResponse = new BlogResponse();
        try {
            Optional<BlogModel> checkBlog = blogRepository.findById(blogModel.getBlogId());
            if (checkBlog.isPresent()) {
                BlogModel b = checkBlog.get();

                // file upload start
                File savFile = new ClassPathResource("static/blogImages").getFile();
                Path path = Paths.get(savFile.getAbsolutePath() + File.separator + blogImage.getOriginalFilename());
                Files.copy(blogImage.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                // file upload end

                b.setBlogTitle(blogModel.getBlogTitle());
                b.setBlogDescription(blogModel.getBlogDescription());
                b.setBlogImage(blogImage.getOriginalFilename());

                BlogModel blogModel2 = blogRepository.save(b);

                BlogResponse.setData(blogModel2);
                BlogResponse.setMessage("Blog updated successfully");
                BlogResponse.setStatus(true);

            } else {
                BlogResponse.setMessage("Blog updation failed!");
                BlogResponse.setStatus(false);
            }
        } catch (Exception e) {
            BlogResponse.setMessage(e.getMessage());
            BlogResponse.setStatus(false);
        }
        return BlogResponse;
    }

    @Override
    public BlogResponse deleteBlogById(int id) {
        BlogResponse BlogResponse = new BlogResponse();
        try {
            Optional<BlogModel> checkBlog = blogRepository.findById(id);
            if (checkBlog.isPresent()) {
                BlogModel blogModel = checkBlog.get();
                blogRepository.delete(blogModel);
                BlogResponse.setData(blogModel);
                BlogResponse.setMessage("Blog deleted successfully");
                BlogResponse.setStatus(true);
            } else {
                BlogResponse.setMessage("Blog deletion failed");
                BlogResponse.setStatus(false);
            }
        } catch (Exception e) {
            BlogResponse.setMessage(e.getMessage());
            BlogResponse.setStatus(false);
        }
        return BlogResponse;
    }

}
