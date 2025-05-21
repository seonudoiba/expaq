package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
public class ActivityType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String image;

    // In ActivityType.java
    @OneToMany(mappedBy = "activityType")
    private List<Activity> activities;
}