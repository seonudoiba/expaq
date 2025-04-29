export const generateBookingConfirmationEmail = (
  bookingDetails: {
    confirmationCode: string;
    activityTitle: string;
    date: string;
    numAdults: number;
    numChildren: number;
    guestName: string;
    totalAmount: number;
    location: string;
  }
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7b35fc; text-align: center;">Booking Confirmation</h1>
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px; margin-top: 20px;">
        <h2 style="color: #333;">Thank you for your booking, ${bookingDetails.guestName}!</h2>
        <p>Your booking has been confirmed for:</p>
        <h3 style="color: #7b35fc;">${bookingDetails.activityTitle}</h3>
        
        <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px;">
          <p><strong>Booking Reference:</strong> ${bookingDetails.confirmationCode}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Location:</strong> ${bookingDetails.location}</p>
          <p><strong>Number of Adults:</strong> ${bookingDetails.numAdults}</p>
          <p><strong>Number of Children:</strong> ${bookingDetails.numChildren}</p>
          <p><strong>Total Amount:</strong> $${bookingDetails.totalAmount}</p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
          <h4 style="color: #333;">Important Information:</h4>
          <ul style="padding-left: 20px;">
            <li>Please arrive 15 minutes before the scheduled time</li>
            <li>Bring a valid ID for verification</li>
            <li>Save this confirmation email for your records</li>
          </ul>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <p>Need to modify or cancel your booking?</p>
          <p>Contact us at <a href="mailto:support@expaq.com" style="color: #7b35fc;">support@expaq.com</a></p>
        </div>
      </div>
    </div>
  `;
};