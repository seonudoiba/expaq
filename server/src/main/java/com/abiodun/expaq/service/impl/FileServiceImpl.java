package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.service.IFileService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements IFileService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file, UUID userId, String type) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "expaq/" + type + "/" + userId,
                            "resource_type", "auto"
                    ));
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public List<String> uploadMultipleFiles(List<MultipartFile> files, UUID userId, String type) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(uploadFile(file, userId, type));
        }
        return urls;
    }

    @Override
    public byte[] getFile(UUID fileId) {
        // Implementation depends on storage solution
        // For Cloudinary, we would need to download the file
        throw new UnsupportedOperationException("Direct file download not implemented");
    }

    @Override
    public String getFileUrl(UUID fileId) {
        // Implementation depends on storage solution
        throw new UnsupportedOperationException("File URL retrieval not implemented");
    }

    @Override
    public void deleteFile(UUID fileId, UUID userId) {
        // Implementation depends on storage solution
        throw new UnsupportedOperationException("File deletion not implemented");
    }

    @Override
    public List<String> getUserFiles(UUID userId) {
        // Implementation depends on storage solution
        throw new UnsupportedOperationException("User files retrieval not implemented");
    }

    @Override
    public List<String> getActivityFiles(UUID activityId) {
        // Implementation depends on storage solution
        throw new UnsupportedOperationException("Activity files retrieval not implemented");
    }

    @Override
    public List<String> uploadActivityFiles(UUID activityId, List<MultipartFile> files, UUID userId) {
        return uploadMultipleFiles(files, userId, "activities/" + activityId);
    }

    @Override
    public String uploadProfileImage(MultipartFile file, UUID userId) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "expaq/profiles/" + userId,
                            "resource_type", "image",
                            "transformation", "c_fill,w_200,h_200"
                    ));
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image", e);
        }
    }

    @Override
    public void deleteProfileImage(UUID userId) {
        try {
            cloudinary.uploader().destroy("expaq/profiles/" + userId + "/profile",
                    ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete profile image", e);
        }
    }

    @Override
    public String uploadActivityCoverImage(UUID activityId, MultipartFile file, UUID userId) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "expaq/activities/" + activityId,
                            "resource_type", "image",
                            "transformation", "c_fill,w_1200,h_400"
                    ));
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload activity cover image", e);
        }
    }

    @Override
    public void deleteActivityCoverImage(UUID activityId, UUID userId) {
        try {
            cloudinary.uploader().destroy("expaq/activities/" + activityId + "/cover",
                    ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete activity cover image", e);
        }
    }

    @Override
    public List<String> uploadActivityGalleryImages(UUID activityId, List<MultipartFile> files, UUID userId) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "expaq/activities/" + activityId + "/gallery",
                                "resource_type", "image",
                                "transformation", "c_fill,w_800,h_600"
                        ));
                urls.add((String) uploadResult.get("url"));
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload gallery image", e);
            }
        }
        return urls;
    }

    @Override
    public void deleteActivityGalleryImage(UUID activityId, String imageUrl, UUID userId) {
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete gallery image", e);
        }
    }

    @Override
    public List<String> getActivityGalleryImages(UUID activityId) {
        // Implementation depends on storage solution
        throw new UnsupportedOperationException("Gallery images retrieval not implemented");
    }

    @Override
    public List<String> uploadReviewImages(UUID reviewId, List<MultipartFile> files, UUID userId) {
        return uploadMultipleFiles(files, userId, "reviews/" + reviewId);
    }

    @Override
    public List<String> getReviewImages(UUID reviewId) {
        // Implementation depends on storage solution
        throw new UnsupportedOperationException("Review images retrieval not implemented");
    }

    @Override
    public void deleteReviewImage(UUID reviewId, String imageUrl, UUID userId) {
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete review image", e);
        }
    }

    private String extractPublicId(String imageUrl) {
        // Extract public ID from Cloudinary URL
        // This is a simplified implementation
        String[] parts = imageUrl.split("/");
        return parts[parts.length - 1].split("\\.")[0];
    }
} 