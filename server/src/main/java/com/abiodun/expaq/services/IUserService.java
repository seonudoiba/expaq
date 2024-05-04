package com.abiodun.expaq.services;

import com.abiodun.expaq.models.User;
import java.util.List;

public interface IUserService {
    User registerUser(User user);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);
}
