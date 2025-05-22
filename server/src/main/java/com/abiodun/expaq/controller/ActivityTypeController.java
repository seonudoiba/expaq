package com.abiodun.expaq.controller;

import com.abiodun.expaq.dto.ActivityTypeDTO;
import com.abiodun.expaq.service.IActivityTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activity-types")
@Tag(name = "Activity Types", description = "API for managing activity types")
public class ActivityTypeController {

    private final IActivityTypeService activityTypeService;

    @GetMapping
    @Operation(summary = "Get all activity types")
    public ResponseEntity<List<ActivityTypeDTO>> getAllActivityTypes() {
        log.debug("REST request to get all activity types");
        List<ActivityTypeDTO> activityTypes = activityTypeService.getAllActivityTypes();
        return ResponseEntity.ok(activityTypes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get activity type by ID")
    public ResponseEntity<ActivityTypeDTO> getActivityTypeById(@PathVariable UUID id) {
        log.debug("REST request to get activity type by id: {}", id);
        return ResponseEntity.ok(activityTypeService.getActivityTypeById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new activity type")
    public ResponseEntity<ActivityTypeDTO> createActivityType(
            @Valid @RequestBody ActivityTypeDTO activityTypeDTO) {
        log.debug("REST request to create activity type: {}", activityTypeDTO);
        ActivityTypeDTO createdActivityType = activityTypeService.createActivityType(activityTypeDTO);
        return new ResponseEntity<>(createdActivityType, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing activity type")
    public ResponseEntity<ActivityTypeDTO> updateActivityType(
            @PathVariable UUID id,
            @Valid @RequestBody ActivityTypeDTO activityTypeDTO) {
        log.debug("REST request to update activity type with id {}: {}", id, activityTypeDTO);
        ActivityTypeDTO updatedActivityType = activityTypeService.updateActivityType(id, activityTypeDTO);
        return ResponseEntity.ok(updatedActivityType);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an activity type")
    public ResponseEntity<Void> deleteActivityType(@PathVariable UUID id) {
        log.debug("REST request to delete activity type with id: {}", id);
        activityTypeService.deleteActivityType(id);
        return ResponseEntity.noContent().build();
    }
}
