"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({
  date,
  setDate,
  placeholder = "Select date and time",
}: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<{
    hours: string;
    minutes: string;
  }>({
    hours: format(date || new Date(), "HH"),
    minutes: format(date || new Date(), "mm"),
  });

  // Update the selected time when the date changes
  React.useEffect(() => {
    if (date) {
      setSelectedTime({
        hours: format(date, "HH"),
        minutes: format(date, "mm"),
      });
    }
  }, [date]);

  // Update the parent's date when the time changes
  const handleTimeChange = React.useCallback(
    (type: "hours" | "minutes", value: string) => {
      setSelectedTime((prev) => {
        const newTime = { ...prev, [type]: value };
        
        if (date) {
          const newDate = new Date(date);
          newDate.setHours(parseInt(newTime.hours));
          newDate.setMinutes(parseInt(newTime.minutes));
          newDate.setSeconds(0); // Reset seconds
          setDate(newDate);
        } else {
          const newDate = new Date();
          newDate.setHours(parseInt(newTime.hours));
          newDate.setMinutes(parseInt(newTime.minutes));
          newDate.setSeconds(0);
          setDate(newDate);
        }
        
        return newTime;
      });
    },
    [date, setDate]
  );

  // Generate hours and minutes options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <Popover>      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 pl-10",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          {date ? format(date, "PPP HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="border-t border-gray-200 p-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={selectedTime.hours}
              onValueChange={(value) => handleTimeChange("hours", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hours" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTime.minutes}
              onValueChange={(value) => handleTimeChange("minutes", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Minutes" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
