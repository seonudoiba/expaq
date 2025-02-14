package com.abiodun.expaq.request;//package com.abiodun.expaq.request;
//
//
//import jakarta.validation.constraintsLog.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.Positive;
//import lombok.*;
//
//import java.math.BigDecimal;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//public class newActivity {
//
//
//    @NotBlank(message = "Activity type is required")
//    private String activityType;
//
//    @NotBlank(message = "Title is required")
//    private String title;
//
//    @NotBlank(message = "Description is required")
//    private String description;
//
//    @NotNull
//    @Positive(message = "Price must be positive")
//    private BigDecimal price;
//
//    @NotBlank(message = "Country is required")
//    private String country;
//
//    @NotBlank(message = "City is required")
//    private String city;
//
//    @NotBlank(message = "Address is required")
//    private String address;
//
//    @NotNull
//    @Positive(message = "Capacity must be positive")
//    private Integer capacity;
//}
