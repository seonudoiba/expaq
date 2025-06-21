package com.abiodun.expaq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activity_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeSlot> timeSlots = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "available_days", joinColumns = @JoinColumn(name = "schedule_id"))
    @Column(name = "day")
    private List<String> availableDays = new ArrayList<>();

    @Column(nullable = false)
    private String timeZone;

    @OneToOne(mappedBy = "schedule")
    private Activity activity;
}