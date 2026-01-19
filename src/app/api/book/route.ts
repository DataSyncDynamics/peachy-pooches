import { NextRequest, NextResponse } from 'next/server';

// For demo purposes, this simulates booking creation
// In production, this would:
// 1. Create appointment in Supabase
// 2. Send confirmation email via Resend
// 3. Return success/error response

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { service, date, time, pet, client, stylist_id } = body;

    // Validate required fields
    if (!service || !date || !time || !pet || !client) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate database creation
    const appointmentId = `apt_${Date.now()}`;

    // In production, you would:
    // 1. Create client if doesn't exist
    // 2. Create or link pet to client
    // 3. Create appointment record
    // 4. Send confirmation email

    // Example Resend integration (commented out for demo):
    /*
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Peachy Pooches <bookings@peachypooches.com>',
      to: client.email,
      subject: `Appointment Confirmed for ${pet.name}!`,
      html: `
        <h1>Your appointment is confirmed!</h1>
        <p>Hi ${client.firstName},</p>
        <p>We're excited to see ${pet.name} for their ${service.name} appointment.</p>
        <h2>Appointment Details</h2>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Service:</strong> ${service.name}</li>
          <li><strong>Pet:</strong> ${pet.name} (${pet.breed})</li>
          <li><strong>Price:</strong> $${service.price}</li>
        </ul>
        <p>If you need to reschedule or cancel, please visit our client portal.</p>
        <p>See you soon!</p>
        <p>The Peachy Pooches Team</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      appointmentId,
      message: 'Appointment booked successfully',
      data: {
        id: appointmentId,
        service: service.name,
        date,
        time,
        pet: pet.name,
        client: `${client.firstName} ${client.lastName}`,
        total: service.price,
        stylist_id: stylist_id || null,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
