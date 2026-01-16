import { NextRequest, NextResponse } from 'next/server';
import { getTimeSlots, isDayOpen } from '@/lib/availability';
import { mockServices } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');
  const serviceId = searchParams.get('serviceId');

  if (!dateParam || !serviceId) {
    return NextResponse.json(
      { error: 'Missing date or serviceId parameter' },
      { status: 400 }
    );
  }

  const date = new Date(dateParam);
  const service = mockServices.find((s) => s.id === serviceId);

  if (!service) {
    return NextResponse.json(
      { error: 'Service not found' },
      { status: 404 }
    );
  }

  const isOpen = isDayOpen(date);

  if (!isOpen) {
    return NextResponse.json({
      date: dateParam,
      isOpen: false,
      slots: [],
    });
  }

  const slots = getTimeSlots(date, service);

  return NextResponse.json({
    date: dateParam,
    isOpen: true,
    slots,
    availableCount: slots.filter((s) => s.available).length,
  });
}
