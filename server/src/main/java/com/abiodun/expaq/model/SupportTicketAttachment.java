package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "support_ticket_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketAttachment {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "support_ticket_id", nullable = false)
    private SupportTicket supportTicket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id")
    private SupportTicketMessage message;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;
    
    @Column(name = "original_filename", nullable = false)
    private String originalFilename;
    
    @Column(name = "stored_filename", nullable = false)
    private String storedFilename;
    
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "content_type", nullable = false)
    private String contentType;
    
    @Column(name = "file_hash")
    private String fileHash;
    
    @Column(name = "download_count")
    private Integer downloadCount = 0;
    
    @Column(name = "is_image", nullable = false)
    private Boolean isImage = false;
    
    @Column(name = "thumbnail_path")
    private String thumbnailPath;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        
        // Determine if file is an image
        if (contentType != null) {
            isImage = contentType.startsWith("image/");
        }
    }
    
    // Helper methods
    
    public void incrementDownloadCount() {
        this.downloadCount = (this.downloadCount == null ? 0 : this.downloadCount) + 1;
    }
    
    public String getFileExtension() {
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        }
        return "";
    }
    
    public String getDisplaySize() {
        if (fileSize == null) return "0 B";
        
        long size = fileSize;
        String[] units = {"B", "KB", "MB", "GB"};
        int unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return size + " " + units[unitIndex];
    }
    
    public boolean isDocument() {
        String extension = getFileExtension();
        return extension.matches("pdf|doc|docx|txt|rtf");
    }
    
    public boolean isArchive() {
        String extension = getFileExtension();
        return extension.matches("zip|rar|7z|tar|gz");
    }
    
    public boolean isSpreadsheet() {
        String extension = getFileExtension();
        return extension.matches("xls|xlsx|csv");
    }
}