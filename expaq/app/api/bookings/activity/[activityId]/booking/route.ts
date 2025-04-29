import { NextResponse } from 'next/server';
import { generateBookingConfirmationEmail } from '@/app/lib/emailTemplates';
import { sendEmail } from '@/app/lib/email';

export async function POST(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const { activityId } = params;
    const body = await request.json();

    // Call the backend API to create the booking
    const response = await fetch(`${process.env.API_URL}/bookings/activity/${activityId}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkInDate: body.checkInDate,
        numOfAdults: body.numOfAdults,
        numOfChildren: body.numOfChildren,
        guestFullName: body.guestFullName,
        guestEmail: body.guestEmail
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const bookingData = await response.json();

    // Get activity details for the email
    const activityResponse = await fetch(`${process.env.API_URL}/activities/activity/${activityId}`);
    if (!activityResponse.ok) {
      throw new Error('Failed to fetch activity details');
    }
    const activityData = await activityResponse.json();

    // Send confirmation email
    const emailHtml = generateBookingConfirmationEmail({
      confirmationCode: bookingData.bookingConfirmationCode,
      activityTitle: activityData.title,
      date: new Date(body.checkInDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      numAdults: body.numOfAdults,
      numChildren: body.numOfChildren,
      guestName: body.guestFullName,
      totalAmount: (body.numOfAdults + body.numOfChildren) * activityData.price,
      location: `${activityData.city}, ${activityData.country}`
    });

    const emailResult = await sendEmail({
      to: body.guestEmail,
      subject: 'Your Expaq Booking Confirmation',
      html: emailHtml
    });

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error);
      // Don't throw error here, as booking was successful
    }

    return NextResponse.json({
      ...bookingData,
      message: 'Booking confirmed successfully'
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create booking',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}