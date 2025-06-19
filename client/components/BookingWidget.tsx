import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/store/auth';
import { CalendarIcon, Users, Clock, Star } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { bookingService } from '@/services/booking';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingWidgetProps } from '@/types';

const BookingWidget = ({ activity }: BookingWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use the mutation directly here for more control
  const { mutate: createBooking, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedTime) {
        throw new Error('Please select a date and time');
      }
      
      // Parse the time string (e.g., "09:00 AM") to get hours and minutes
      const timeParts = selectedTime.match(/(\d+):(\d+)\s?(AM|PM)/i);
      if (!timeParts) {
        throw new Error('Invalid time format');
      }
      
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = timeParts[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      // Create a new date object with the selected date and time
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on activity duration (parse from format like "2 hours")
      const durationMatch = activity.duration.match(/(\d+)\s*hours?/i);
      const durationHours = durationMatch ? parseInt(durationMatch[1], 10) : 2; // Default to 2 hours
      
      // Add the duration to get the end time
      const endTime = addHours(startTime, durationHours);
      
      // Format dates as required by the API: YYYY-MM-DD HH:MM:SS
      const formatDateTime = (date: Date) => {
        return format(date, "yyyy-MM-dd HH:mm:ss");
      };
      
      const bookingData = {
        activityId: activity.id,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        numberOfGuests: guests.toString()
      };
      
      // Call the booking service
      return await bookingService.createBooking(bookingData);
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      toast({
        title: 'Booking Confirmed',
        description: 'Your booking has been created successfully!',
      });
      router.push(`/bookings/${booking.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const availableTimes = [
    '09:00 AM',
    '11:00 AM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM'
  ];

  const totalPrice = activity.price * guests;
  // Comment out these variables as they aren't used in the current component
  // but keep the final total
  // const serviceFee = Math.round(totalPrice * 0.1);
  // const taxes = Math.round(totalPrice * 0.08);
  const finalTotal = totalPrice;

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make a booking.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Choose your preferred date and time for the activity.",
        variant: "destructive",
      });
      return;
    }

    // Trigger the mutation
    createBooking();
  };

  return (    <Card className="w-full max-w-md shadow-lg border border-gray-200">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-xl font-bold">${activity.price}</span>
            <span className="text-gray-600 ml-1">/ person</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-current text-yellow-500" />
            <span className="font-medium">{activity.rating}</span>
            <span className="text-gray-500">({activity.reviews} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">        <div className="space-y-2">
          <Label className="text-base font-medium">Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                {selectedDate ? format(selectedDate, 'PPP') : <span className="text-gray-500">Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 shadow-lg" align="start">
              <div className="border-b border-gray-200 bg-gray-50 p-3">
                <h3 className="text-center font-medium">{selectedDate ? format(selectedDate, 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')}</h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                fromMonth={new Date()}
                toYear={new Date().getFullYear() + 1}
              />
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-100 mr-1"></div>
                  <span>Today</span>
                  <div className="w-3 h-3 rounded-full bg-primary border border-blue-600 ml-4 mr-1"></div>
                  <span>Selected</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>        <div className="space-y-2">
          <Label className="text-base font-medium">Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="border-gray-300">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Select time" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-gray-200">
              <div className="py-2 px-1 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 px-2">Available Times</h4>
              </div>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time} className="hover:bg-blue-50">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    {time}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDate && !selectedTime && (
            <p className="text-xs text-amber-500">Please select a time for your booking</p>
          )}
        </div>        <div className="space-y-2">
          <Label className="text-base font-medium">Guests</Label>
          <Select
            value={guests.toString()}
            onValueChange={(value) => setGuests(parseInt(value))}
          >
            <SelectTrigger className="border-gray-300">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Number of guests" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-gray-200">
              <div className="py-2 px-1 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 px-2">Select Number of Guests</h4>
                <p className="text-xs text-gray-400 px-2">Max: {activity.maxGuests} guests</p>
              </div>
              {Array.from({ length: activity.maxGuests }, (_, i) => i + 1).map(
                (num) => (
                  <SelectItem key={num} value={num.toString()} className="hover:bg-blue-50">
                    <div className="flex items-center justify-between w-full">
                      <span>{num} {num === 1 ? 'guest' : 'guests'}</span>
                      <span className="text-gray-500">${activity.price * num}</span>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>        <div className="space-y-3 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">${activity.price} × {guests} {guests === 1 ? 'guest' : 'guests'}</span>
            <span className="font-medium">${totalPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700">Service fee</span>
              <div className="relative group ml-1">
                <span className="cursor-help text-xs bg-gray-200 text-gray-600 rounded-full h-4 w-4 inline-flex items-center justify-center">?</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  Service fee helps us run our platform and provide customer support
                </div>
              </div>
            </div>
            {/* <span className="font-medium">${serviceFee}</span> */}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Taxes</span>
            {/* <span className="font-medium">${taxes}</span> */}
          </div>
          <div className="flex justify-between font-semibold text-base pt-3 mt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
          
          {!selectedDate && (
            <div className="bg-amber-50 border border-amber-100 rounded-md p-2 mt-2">
              <p className="text-amber-600 text-sm">Please select a date and time to continue</p>
            </div>
          )}
        </div>

        <Button
          className="w-full bg-primary hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all mt-4" 
          size="lg" 
          onClick={handleBooking}
          disabled={isLoading || !selectedDate || !selectedTime}
        >
          {isLoading ? (
            <LoadingSpinner className="mr-2" />
          ) : null}
          {isLoading ? 'Creating Booking...' : 'Book Now'}
        </Button>

        <div className="text-center text-sm text-gray-500 mt-4">
          <div className="flex items-center justify-center gap-2 bg-gray-50 p-2 rounded-md">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Duration: {activity.duration}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">You won&apos;t be charged yet</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;
