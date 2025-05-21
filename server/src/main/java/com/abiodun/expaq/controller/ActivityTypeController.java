package com.abiodun.expaq.controller;

import com.abiodun.expaq.model.ActivityType;
import com.abiodun.expaq.service.IActivityTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activity-types")
public class ActivityTypeController {
    @Autowired
    private IActivityTypeService activityTypeService;

    @GetMapping
    public List<ActivityType> getAllActivityTypes() {
        return activityTypeService.findAll();
    }

    @GetMapping("/{id}")
    public ActivityType getActivityTypeById(@PathVariable UUID id) {
        return activityTypeService.findById(id).orElse(null);
    }

    @PostMapping
    public ActivityType createActivityType(@RequestBody ActivityType activityType) {
        return activityTypeService.save(activityType);
    }

    @PutMapping("/{id}")
    public ActivityType updateActivityType(@PathVariable UUID id, @RequestBody ActivityType activityType) {
        return activityTypeService.update(id, activityType);
    }

    @DeleteMapping("/{id}")
    public void deleteActivityType(@PathVariable UUID id) {
        activityTypeService.deleteById(id);
    }
}
