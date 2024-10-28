package com.abiodun.expaq.dto;

public enum RoleName {
    ADMIN("ADMIN"),
    HOST("HOST"),
    GUEST("GUEST"),
    MODERATOR("MODERATOR");

    private final String name;

    RoleName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}