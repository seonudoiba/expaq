package com.abiodun.expaq.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "roles")  // Changed to plural for consistency
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)  // Use UUID strategy instead of IDENTITY
    private UUID id;

    @Column(unique = true)  // Add uniqueness constraint
    private String name;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }

    public void removeUserFromRole(User user){
        user.getRoles().remove(this);
        this.getUsers().remove(user);
    }

    public void removeAllUsersFromRole(){
        if (this.getUsers() != null){
            this.getUsers().stream().toList().forEach(this::removeUserFromRole);
        }
    }

}