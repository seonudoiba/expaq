package com.abiodun.expaq.response;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class HostResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;

    public HostResponse(UUID id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

