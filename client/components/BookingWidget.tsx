import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth';
import { CalendarIcon, Users, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { useCreateBooking } from '@/hooks/use-bookings';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface BookingWidgetProps {
  activity: {
    id: string;
    title: string;
    price: number;
    rating: number;
    reviews: number;
    maxGuests: number;
    duration: string;
    images: string[];
  };
}

const BookingWidget = ({ activity }: BookingWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { mutate: createBooking, isLoading } = useCreateBooking();

  const availableTimes = [
    '09:00 AM',
    '11:00 AM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM'
  ];

  const totalPrice = activity.price * guests;
  const serviceFee = Math.round(totalPrice * 0.1);
  const taxes = Math.round(totalPrice * 0.08);
  const finalTotal = totalPrice + serviceFee + taxes;

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

    createBooking({
      activityId: activity.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      numberOfGuests: guests,
    }, {
      onSuccess: (booking) => {
        router.push(`/bookings/${booking.id}`);
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>${activity.price} / person</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span>{activity.rating}</span>
            <span className="text-gray-500">({activity.reviews} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Guests</Label>
          <Select
            value={guests.toString()}
            onValueChange={(value) => setGuests(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Number of guests" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: activity.maxGuests }, (_, i) => i + 1).map(
                (num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'guest' : 'guests'}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex justify-between">
            <span>${activity.price} × {guests} guests</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>${taxes}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
        </div>

        <Button
          className="w-full" 
          size="lg" 
          onClick={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner className="mr-2" />
          ) : null}
          {isLoading ? 'Creating Booking...' : 'Book Now'}
        </Button>

        <div className="text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Duration: {activity.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;
