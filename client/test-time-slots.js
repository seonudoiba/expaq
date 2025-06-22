// Test file to demonstrate correct TimeSlotDTO format

// This is the correct format that should work with the backend
const correctActivityData = {
  // Other fields...
  schedule: {
    availableDays: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    timeZone: "America/New_York",
    timeSlots: [
      {
        maxParticipants: 10, 
        // No isAvailable field
        startTime: "2025-06-30T10:00:00",
        endTime: "2025-06-30T12:00:00"
      }
    ]
  }
};

console.log("Correct timeSlots format:", JSON.stringify(correctActivityData.schedule.timeSlots, null, 2));

// You can delete this file after reviewing
