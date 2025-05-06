//package com.abiodun.expaq.config;
//
//import com.abiodun.expaq.model.Activity;
//import com.abiodun.expaq.model.Review;
//import com.abiodun.expaq.model.Role;
//import com.abiodun.expaq.model.User;
//import com.abiodun.expaq.repository.ActivityRepository;
//import com.abiodun.expaq.repository.ReviewRepository;
//import com.abiodun.expaq.repository.RoleRepository;
//import com.abiodun.expaq.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.Arrays;
//import java.util.List;
//
////@Component
////@RequiredArgsConstructor
//public class DataInitializer implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//    private final ActivityRepository activityRepository;
//    private final ReviewRepository reviewRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    @Transactional
//    public void run(String... args) {
//        // Only initialize if no users exist
//        if (userRepository.count() == 0) {
//            initializeRoles();
//            List<User> users = initializeUsers();
//            initializeActivities(users);
//        }
//    }
//
//    private void initializeRoles() {
//        // Create roles if they don't exist
//        Arrays.stream(User.UserRole.values()).forEach(userRole -> {
//            if (!roleRepository.existsByName(userRole.name())) {
//                Role role = new Role(userRole.name());
//                roleRepository.save(role);
//            }
//        });
//    }
//
//    private List<User> initializeUsers() {
//        // Create admin user
//        User adminUser = new User();
//        adminUser.setEmail("admin@expaq.com");
//        adminUser.setUsername("admin");
//        adminUser.setPassword(passwordEncoder.encode("admin123"));
//        adminUser.setFirstName("Admin");
//        adminUser.setLastName("User");
//        adminUser.setRole(User.UserRole.ADMIN);
//        adminUser.setVerified(true);
//        adminUser.setActive(true);
//        adminUser.setCreatedAt(LocalDateTime.now());
//        adminUser.setLastLoginAt(LocalDateTime.now());
//
//        // Create tourist user
//        User touristUser = new User();
//        touristUser.setEmail("tourist@expaq.com");
//        touristUser.setUsername("tourist");
//        touristUser.setPassword(passwordEncoder.encode("tourist123"));
//        touristUser.setFirstName("Tourist");
//        touristUser.setLastName("User");
//        touristUser.setRole(User.UserRole.TOURIST);
//        touristUser.setVerified(true);
//        touristUser.setActive(true);
//        touristUser.setCreatedAt(LocalDateTime.now());
//        touristUser.setLastLoginAt(LocalDateTime.now());
//
//        // Create host user
//        User hostUser = new User();
//        hostUser.setEmail("host@expaq.com");
//        hostUser.setUsername("host");
//        hostUser.setPassword(passwordEncoder.encode("host123"));
//        hostUser.setFirstName("Host");
//        hostUser.setLastName("User");
//        hostUser.setRole(User.UserRole.HOST);
//        hostUser.setVerified(true);
//        hostUser.setActive(true);
//        hostUser.setCreatedAt(LocalDateTime.now());
//        hostUser.setLastLoginAt(LocalDateTime.now());
//
//        // Save all users
//        return userRepository.saveAll(Arrays.asList(adminUser, touristUser, hostUser));
//    }
//
//    private void initializeActivities(List<User> users) {
//        User hostUser = users.stream()
//                .filter(user -> user.getRole() == User.UserRole.HOST)
//                .findFirst()
//                .orElseThrow();
//
//        User touristUser = users.stream()
//                .filter(user -> user.getRole() == User.UserRole.TOURIST)
//                .findFirst()
//                .orElseThrow();
//
//        // Create sample activities
//        Activity activity1 = new Activity();
//        activity1.setTitle("Mountain Hiking Adventure");
//        activity1.setDescription("Experience the thrill of mountain hiking with experienced guides.");
//        activity1.setPrice(new BigDecimal("99.99"));
//        activity1.setLocation("Mount Everest Base Camp");
//        activity1.setDuration(4);
//        activity1.setMaxParticipants(10);
//        activity1.setCategory(Activity.ActivityCategory.ADVENTURE);
//        activity1.setHost(hostUser);
//        activity1.setActive(true);
//        activity1 = activityRepository.save(activity1);
//
//        Activity activity2 = new Activity();
//        activity2.setTitle("Cultural Food Tour");
//        activity2.setDescription("Explore local cuisine and cooking traditions.");
//        activity2.setPrice(new BigDecimal("79.99"));
//        activity2.setLocation("Local Market");
//        activity2.setDuration(3);
//        activity2.setMaxParticipants(8);
//        activity2.setCategory(Activity.ActivityCategory.FOOD_AND_DRINK);
//        activity2.setHost(hostUser);
//        activity2.setActive(true);
//        activity2 = activityRepository.save(activity2);
//
//        // Create sample reviews
//        Review review1 = new Review();
//        review1.setUser(touristUser);
//        review1.setActivity(activity1);
//        review1.setRating(5);
//        review1.setComment("Amazing experience! The guides were very knowledgeable.");
//        review1.setVerified(true);
//        reviewRepository.save(review1);
//
//        Review review2 = new Review();
//        review2.setUser(touristUser);
//        review2.setActivity(activity2);
//        review2.setRating(4);
//        review2.setComment("Great food tour! Learned a lot about local cuisine.");
//        review2.setVerified(true);
//        reviewRepository.save(review2);
//    }
//}