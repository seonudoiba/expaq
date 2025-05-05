package com.abiodun.expaq.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReviewPageResponse {
    private List<ReviewResponse> reviews;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
    private ReviewStatistics statistics;

    public ReviewPageResponse(List<ReviewResponse> reviews, int currentPage, int totalPages,
                            long totalElements, int pageSize, ReviewStatistics statistics) {
        this.reviews = reviews;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
        this.hasNext = currentPage < totalPages;
        this.hasPrevious = currentPage > 1;
        this.statistics = statistics;
    }
} 