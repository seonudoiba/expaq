package com.abiodun.expaq.dto.response;

import java.util.List;

import lombok.*;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
public class HostResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;

    public HostResponse(Long id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

