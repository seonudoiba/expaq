package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.UserDTO;
import com.abiodun.expaq.dto.request.BecomeHostRequest;
import com.abiodun.expaq.model.ExpaqUserDetails;
import com.abiodun.expaq.service.HostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/host")
public class HostController {

    @Autowired
    private HostService hostService;

    @PostMapping("/apply")
    public ResponseEntity<UserDTO> applyToBecomeHost(
            @Valid @RequestBody BecomeHostRequest request,
            @AuthenticationPrincipal ExpaqUserDetails currentUser) {
        
        UserDTO response = hostService.applyToBecomeHost(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
