package com.abiodun.expaq.controller;

import com.abiodun.expaq.service.IFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final IFileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestAttribute("userId") UUID userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(fileService.uploadFile(file, userId, type));
    }

    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadMultipleFiles(
            @RequestAttribute("userId") UUID userId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(fileService.uploadMultipleFiles(files, userId, type));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<byte[]> getFile(
            @PathVariable UUID fileId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileService.getFile(fileId));
    }

    @GetMapping("/url/{fileId}")
    public ResponseEntity<String> getFileUrl(
            @PathVariable UUID fileId) {
        return ResponseEntity.ok(fileService.getFileUrl(fileId));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID fileId) {
        fileService.deleteFile(fileId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public ResponseEntity<List<String>> getUserFiles(
            @RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(fileService.getUserFiles(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<String>> getActivityFiles(
            @PathVariable UUID activityId) {
        return ResponseEntity.ok(fileService.getActivityFiles(activityId));
    }

    @PostMapping(value = "/activity/{activityId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadActivityFiles(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID activityId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(fileService.uploadActivityFiles(activityId, files, userId));
    }

    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadProfileImage(
            @RequestAttribute("userId") UUID userId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(fileService.uploadProfileImage(file, userId));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfileImage(
            @RequestAttribute("userId") UUID userId) {
        fileService.deleteProfileImage(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/activity/{activityId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadActivityCoverImage(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID activityId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(fileService.uploadActivityCoverImage(activityId, file, userId));
    }

    @DeleteMapping("/activity/{activityId}/cover")
    public ResponseEntity<Void> deleteActivityCoverImage(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID activityId) {
        fileService.deleteActivityCoverImage(activityId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/activity/{activityId}/gallery", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadActivityGalleryImages(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID activityId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(fileService.uploadActivityGalleryImages(activityId, files, userId));
    }

    @DeleteMapping("/activity/{activityId}/gallery/{imageUrl}")
    public ResponseEntity<Void> deleteActivityGalleryImage(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID activityId,
            @PathVariable String imageUrl) {
        fileService.deleteActivityGalleryImage(activityId, imageUrl, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activity/{activityId}/gallery")
    public ResponseEntity<List<String>> getActivityGalleryImages(
            @PathVariable UUID activityId) {
        return ResponseEntity.ok(fileService.getActivityGalleryImages(activityId));
    }

    @PostMapping(value = "/review/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadReviewImages(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID reviewId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(fileService.uploadReviewImages(reviewId, files, userId));
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<String>> getReviewImages(
            @PathVariable UUID reviewId) {
        return ResponseEntity.ok(fileService.getReviewImages(reviewId));
    }

    @DeleteMapping("/review/{reviewId}/{imageUrl}")
    public ResponseEntity<Void> deleteReviewImage(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID reviewId,
            @PathVariable String imageUrl) {
        fileService.deleteReviewImage(reviewId, imageUrl, userId);
        return ResponseEntity.ok().build();
    }
} 