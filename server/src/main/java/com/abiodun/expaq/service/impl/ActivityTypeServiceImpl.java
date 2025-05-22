package com.abiodun.expaq.service.impl;

import com.abiodun.expaq.dto.ActivityTypeDTO;
import com.abiodun.expaq.exception.ResourceNotFoundException;
import com.abiodun.expaq.model.ActivityType;
import com.abiodun.expaq.repository.ActivityTypeRepository;
import com.abiodun.expaq.service.IActivityTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityTypeServiceImpl implements IActivityTypeService {

    private final ActivityTypeRepository activityTypeRepository;

    @Override
    @Transactional
    public ActivityTypeDTO createActivityType(ActivityTypeDTO activityTypeDTO) {
        log.debug("Creating new activity type: {}", activityTypeDTO.getName());
        
        ActivityType activityType = new ActivityType();
        activityType.setName(activityTypeDTO.getName());
        activityType.setImage(activityTypeDTO.getImage());
        
        ActivityType savedActivityType = activityTypeRepository.save(activityType);
        log.info("Created activity type with id: {}", savedActivityType.getId());
        
        return ActivityTypeDTO.fromActivityType(savedActivityType);
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityTypeDTO getActivityTypeById(UUID id) {
        log.debug("Fetching activity type with id: {}", id);
        
        List<Object[]> result = activityTypeRepository.findByIdWithActivityCount(id);
        if (result.isEmpty()) {
            log.error("ActivityType not found with id: {}", id);
            throw new ResourceNotFoundException("ActivityType not found with id: " + id);
        }
        
        Object[] row = result.get(0);
        ActivityType activityType = (ActivityType) row[0];
        Long activityCount = (Long) row[1];
        
        return ActivityTypeDTO.fromActivityTypeWithCount(activityType, activityCount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityTypeDTO> getAllActivityTypes() {
        log.debug("Fetching all activity types with activity counts");
        
        return activityTypeRepository.findAllWithActivityCount().stream()
                .map(row -> {
                    ActivityType activityType = (ActivityType) row[0];
                    Long activityCount = (Long) row[1];
                    return ActivityTypeDTO.fromActivityTypeWithCount(activityType, activityCount);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ActivityTypeDTO updateActivityType(UUID id, ActivityTypeDTO activityTypeDTO) {
        log.debug("Updating activity type with id: {}", id);
        
        return activityTypeRepository.findById(id)
                .map(existing -> {
                    existing.setName(activityTypeDTO.getName());
                    existing.setImage(activityTypeDTO.getImage());
                    
                    ActivityType updatedActivityType = activityTypeRepository.save(existing);
                    log.info("Updated activity type with id: {}", id);
                    
                    return ActivityTypeDTO.fromActivityType(updatedActivityType);
                })
                .orElseThrow(() -> {
                    log.error("Cannot update. ActivityType not found with id: {}", id);
                    return new ResourceNotFoundException("ActivityType not found with id: " + id);
                });
    }

    @Override
    @Transactional
    public void deleteActivityType(UUID id) {
        log.debug("Deleting activity type with id: {}", id);
        
        if (!activityTypeRepository.existsById(id)) {
            log.error("Cannot delete. ActivityType not found with id: {}", id);
            throw new ResourceNotFoundException("ActivityType not found with id: " + id);
        }
        
        activityTypeRepository.deleteById(id);
        log.info("Deleted activity type with id: {}", id);
    }
}
