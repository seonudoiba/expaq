package com.abiodun.expaq.services;

import com.abiodun.expaq.models.User;
import java.util.List;

public interface IUserService {
    User registerUser(User user);
    User updateUserHostStatus(Long userId, String hostStatus);
    List<User> getUsers();
    List<User> findPendingHosts();
    void deleteUser(String email);
    User getUser(String email);
}
