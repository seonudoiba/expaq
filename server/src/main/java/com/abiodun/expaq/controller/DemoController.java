package com.abiodun.expaq.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

//    {{base_url}}/roles/assign-user-to-role?userId=2&roleId=1
    @GetMapping("/demo")
    public String demo() {
        return "Hello from secured url";
    }

    @GetMapping("/admin-demo")
    @PreAuthorize("hasRole('ADMIN')")
    public String Ademo() {
        return "Hello from admin url";
    }


    @GetMapping("/csrf")
    public CsrfToken getCsrfToken( HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");
    }
}

