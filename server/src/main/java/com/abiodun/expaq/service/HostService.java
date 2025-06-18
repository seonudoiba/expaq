package com.abiodun.expaq.service;

import com.abiodun.expaq.dto.UserDTO;
import com.abiodun.expaq.dto.request.BecomeHostRequest;

import java.util.UUID;

public interface HostService {
    UserDTO applyToBecomeHost(BecomeHostRequest request, UUID userId);
}
