package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.User;
import com.abiodun.expaq.repository.UserRepository;
import com.abiodun.expaq.request.LoginRequest;
import com.abiodun.expaq.response.AuthResponse;
import com.abiodun.expaq.service.UserService;
import com.abiodun.expaq.service.logout.BlackList;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;
    private final BlackList blackList;

    public UserController(UserRepository userRepository, UserService userService, BlackList blackList) {
        this.userService = userService;
        this.blackList = blackList;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest user) {
        return userService.verify(user);
    }
    @PostMapping("/logout")
    @PreAuthorize("hasAuthority('USER_ROLES') or hasAuthority('ADMIN_ROLES')")
    public String logoutUser(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        String authToken= null;
        if(authHeader !=null && authHeader.startsWith("Bearer")){
            authToken = authHeader.substring(7);
        }
        blackList.blacKListToken(authToken);
        System.out.println(request);
        return "You have successfully logged out !!";
    }

//    @GetMapping("/getUsers")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    public List<ExpaqUserDetails> getAllUsers(){
//        return userService.getAllUser();
//    }
//    @GetMapping("/getUsers/{id}")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_USER')")
//    public ExpaqUserDetails getAllUsers(@PathVariable Integer id){
//        return userService.getUser(id);
//    }


//    @PostMapping("/user/logout")
//    public String logout(@RequestHeader("Authorization") String authHeader) {
//        String token = authHeader.substring(7); // Remove "Bearer " prefix
//        System.out.println(token);
//        // Add token to blacklist
//        BlacklistedToken blacklistedToken = new BlacklistedToken();
//        blacklistedToken.setToken(token);
//        blacklistedToken.setExpiryDate(Instant.now().plusSeconds(3600)); // Set expiry date
//        blacklistedTokenRepository.save(blacklistedToken);
//
//        // Clear the security context
//        SecurityContextHolder.clearContext();
//
//        return "Logged out successfully";
//    }

}
