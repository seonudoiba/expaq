package com.abiodun.expaq.config;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    String schemeName = "bearerAuth";
    String bearerFormat = "JWT";
    String scheme = "bearer";

    @Bean
    public OpenAPI caseOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement()
                        .addList(schemeName))
                .components(new Components()
                        .addSecuritySchemes(
                                schemeName, new SecurityScheme()
                                        .name(schemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .bearerFormat(bearerFormat)
                                        .in(SecurityScheme.In.HEADER)
                                        .scheme(scheme)
                        )
                )
                .info(new Info()
                        .title("Expaq API Documentation")
                        .description("This API exposes endpoints to manage Expaq.")
                        .contact(new Contact()
                                .name("Abiodun Igbehinadun")
                                .email("abiodunstarr@gmail.com")
                                .url("(link unavailable)")
                        )
                        .version("1.0")
                )
                .tags(List.of(
                        new Tag().name("Experiences").description("Endpoints for managing cultural exchange experiences"),
                        new Tag().name("Users").description("Endpoints for managing users and authentication"),
                        new Tag().name("Ratings").description("Endpoints for managing ratings"),
                        new Tag().name("Bookings").description("Endpoints for managing bookings"),
                        new Tag().name("Roles").description("Endpoints for managing roles")
                ))
                // Add endpoint descriptions and parameters
                .path("/ratings/activity/{activityId}/ratings/{id}",
                        new PathItem().get(new Operation().summary("Get rating by ID").description("Retrieve a rating by its ID")))
                .path("/ratings/activity/{activityId}/ratings",
                        new PathItem().get(new Operation().summary("Get all ratings for an activity").description("Retrieve all ratings for a specific activity")))
                .path("/activities/update/{activityId}",
                        new PathItem().put(new Operation().summary("Update an activity").description("Update an existing activity")))
                .path("/activities/add/new-activities",
                        new PathItem().post(new Operation().summary("Create a new activity").description("Add a new cultural exchange activity")))
                // ... and so on for each endpoint

                // Define request and response body schemas
                .schema("RatingResponse", new Schema().description("Rating response schema"))
                .schema("ActivityResponse", new Schema().description("Activity response schema"))
                .schema("BookingResponse", new Schema().description("Booking response schema"))
                .schema("HostResponse", new Schema().description("Host response schema"))
                .schema("Role", new Schema().description("Role schema"))
                .schema("User", new Schema().description("User schema"))
                .schema("Activity", new Schema().description("Activity schema"))
                .schema("BookedActivity", new Schema().description("Booked activity schema"))
                .schema("Rating", new Schema().description("Rating schema"))
                .schema("LoginRequest", new Schema().description("Login request schema"));
    }
}