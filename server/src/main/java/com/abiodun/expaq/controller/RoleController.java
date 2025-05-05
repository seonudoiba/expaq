package com.abiodun.expaq.controller;

import com.abiodun.expaq.exception.RoleAlreadyExistException;
import com.abiodun.expaq.model.Role;
import com.abiodun.expaq.model.User;
import com.abiodun.expaq.service.impl.RoleServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.FOUND;

@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleServiceImpl roleService;
    public RoleController(RoleServiceImpl roleService) {
        this.roleService = roleService;
    }


    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Role>> getAllRoles(){
        System.out.println("running getAllRoles");
        return new ResponseEntity<>(roleService.getRoles(), FOUND);

    }

    @PostMapping("/create-new-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createRole(@RequestBody Role theRole){
        try{
            roleService.createRole(theRole);
            return ResponseEntity.ok("New role created successfully!");
        }catch(RoleAlreadyExistException re){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(re.getMessage());

        }
    }
    @DeleteMapping("/delete/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRole(@PathVariable("roleId") UUID roleId){
        roleService.deleteRole(roleId);
    }
    @PostMapping("/remove-all-users-from-role/{roleId}")
    public Role removeAllUsersFromRole(@PathVariable("roleId") UUID roleId){
        return roleService.removeAllUsersFromRole(roleId);
    }

    @PostMapping("/remove-user-from-role")
    @PreAuthorize("hasRole('ADMIN')")
    public User removeUserFromRole(
            @RequestParam("userId") UUID userId,
            @RequestParam("roleId") UUID roleId){
        return roleService.removeUserFromRole(userId, roleId);
    }


    @PostMapping("/assign-user-to-role")
    @PreAuthorize("hasRole('ADMIN')")
    public User assignUserToRole(
            @RequestParam("userId") UUID userId,
            @RequestParam("role") User.UserRole userRole){
        return roleService.assignRoleToUser(userId, userRole);
    }
}
