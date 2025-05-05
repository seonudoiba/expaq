package com.abiodun.expaq.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface IFileService {
    String uploadFile(MultipartFile file, UUID userId, String type);
    List<String> uploadMultipleFiles(List<MultipartFile> files, UUID userId, String type);
    byte[] getFile(UUID fileId);
    String getFileUrl(UUID fileId);
    void deleteFile(UUID fileId, UUID userId);
    List<String> getUserFiles(UUID userId);
    List<String> getActivityFiles(UUID activityId);
    List<String> uploadActivityFiles(UUID activityId, List<MultipartFile> files, UUID userId);
    String uploadProfileImage(MultipartFile file, UUID userId);
    void deleteProfileImage(UUID userId);
    String uploadActivityCoverImage(UUID activityId, MultipartFile file, UUID userId);
    void deleteActivityCoverImage(UUID activityId, UUID userId);
    List<String> uploadActivityGalleryImages(UUID activityId, List<MultipartFile> files, UUID userId);
    void deleteActivityGalleryImage(UUID activityId, String imageUrl, UUID userId);
    List<String> getActivityGalleryImages(UUID activityId);
    List<String> uploadReviewImages(UUID reviewId, List<MultipartFile> files, UUID userId);
    List<String> getReviewImages(UUID reviewId);
    void deleteReviewImage(UUID reviewId, String imageUrl, UUID userId);
} 