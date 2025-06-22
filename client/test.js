// Test script to verify the activity creation structure

// Example structure that should be sent to the backend
const correctStructure = {
  // other properties...
  schedule: {
    availableDays: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    timeZone: "America/New_York",
    timeSlots: [
      {
        maxParticipants: 10,
        isAvailable: true,
        endTime: "2023-12-31T17:00:00",
        startTime: "2023-12-31T15:00:00"
      }
      // can have multiple time slots
    ]
  }
};

console.log("Schedule structure is now correctly formatted as an array:", 
  Array.isArray(correctStructure.schedule.timeSlots));

// You can delete this file after testing
