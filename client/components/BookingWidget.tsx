
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth';
// import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Users, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
// import { useCart } from '@/contexts/CartContext';





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
  // const { addItem } = useCart();
  const { toast } = useToast();

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

    // const bookingItem = {
    //   id: `${activity.id}-${Date.now()}`,
    //   activityId: activity.id,
    //   activityName: activity.title,
    //   date: format(selectedDate, 'yyyy-MM-dd'),
    //   time: selectedTime,
    //   participants: guests,
    //   price: activity.price,
    //   image: activity.images[0]
    // };

    // addItem(bookingItem);
    
    toast({
      title: "Added to cart!",
      description: "Your booking has been added to cart. Proceed to checkout to confirm.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              ${activity.price}
              <span className="text-base font-normal text-gray-600">/person</span>
            </CardTitle>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{activity.rating}</span>
              <span className="ml-1 text-sm text-gray-600">({activity.reviews} reviews)</span>
            </div>
          </div>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {activity.duration}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Select Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Choose date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
         
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={(date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  }}
  disabled={(date: Date) => date < new Date()}
  initialFocus={true}
/>
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label>Select Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Choose time" />
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

        {/* Guest Selection */}
        <div className="space-y-2">
          <Label>Number of Guests</Label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
            >
              -
            </Button>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGuests(Math.min(activity.maxGuests, guests + 1))}
              disabled={guests >= activity.maxGuests}
            >
              +
            </Button>
          </div>
          <p className="text-xs text-gray-500">Maximum {activity.maxGuests} guests</p>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>${activity.price} x {guests} guest{guests > 1 ? 's' : ''}</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes</span>
            <span>${taxes}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
        </div>

        {/* Book Button */}
        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleBooking}
        >
          {user ? 'Add to Cart' : 'Log in to Book'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          You won&apos;t be charged yet. Review your booking before final confirmation.
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;
