package com.abiodun.expaq.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blogs")
@Entity
public class BlogModel {
    
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "blog_id")
    private int blogId;

    @Column(name = "blog_title")
    private String blogTitle;

    @Column(name = "blog_description")
    private String blogDescription;

    @Column(name = "blog_image")
    private String blogImage;

}
