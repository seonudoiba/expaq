package com.abiodun.expaq.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator; // Import for UUID generation

import java.time.LocalDateTime; // Import for timestamps
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.UUID; // Import UUID

@Entity
@Table(name = "users") // Use conventional plural name and correct quotes
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator // Use UUID generator
    private UUID id; // Changed type to UUID

    private String userName;

    private String passwordHash; // Renamed from password

    private String firstName;

    private String lastName;

    @Column(unique = true) // Added unique constraint based on documentation ERD
    private String email;

    private String bio; // Added bio field based on documentation

    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST,
                    CascadeType.MERGE, CascadeType.DETACH})
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy="host", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    @CreationTimestamp // Automatically set on creation
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Added created_at

    @UpdateTimestamp // Automatically set on update
    @Column(nullable = false)
    private LocalDateTime updatedAt; // Added updated_at
}
