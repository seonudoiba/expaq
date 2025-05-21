package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.model.ActivityType;
import com.abiodun.expaq.repository.ActivityTypeRepository;
import com.abiodun.expaq.service.IActivityTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ActivityTypeServiceImpl implements IActivityTypeService {
    private final ActivityTypeRepository activityTypeRepository;

    @Autowired
    public ActivityTypeServiceImpl(ActivityTypeRepository activityTypeRepository) {
        this.activityTypeRepository = activityTypeRepository;
    }

    @Override
    public ActivityType save(ActivityType activityType) {
        return activityTypeRepository.save(activityType);
    }

    @Override
    public Optional<ActivityType> findById(UUID id) {
        return activityTypeRepository.findById(id);
    }

    @Override
    public List<ActivityType> findAll() {
        return activityTypeRepository.findAll();
    }

    @Override
    public ActivityType update(UUID id, ActivityType activityType) {
        return activityTypeRepository.findById(id)
                .map(existing -> {
                    existing.setName(activityType.getName());
                    existing.setImage(activityType.getImage());
                    return activityTypeRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("ActivityType not found"));
    }

    @Override
    public void deleteById(UUID id) {
        activityTypeRepository.deleteById(id);
    }
}
