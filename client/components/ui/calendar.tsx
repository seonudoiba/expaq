import * as React from "react";
import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays ={showOutsideDays}
      // mode="single"
      className={cn("p-3", className)}
      classNames={{
        today: "bg-blue-50 text-primary font-bold",
        selected: "bg-primary text-primary-foreground font-bold",
        chevron: "primary",
        months: "flex flex-col sm:flex-col space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 justify-center",
        caption: "flex justify-center pt-1 relative items-center px-8",
        caption_label: "text-base font-medium pl-8 text-gray-800",
        nav: "space-x-1 flex items-center relative bg-blue-800",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border-none"
        ),
        // nav_button_previous: "absolute left-1 ",
        // nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between mb-1",
        head_cell:
          "text-muted-foreground w-10 font-medium text-[0.8rem] text-center",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-12 p-0  font-normal aria-selected:opacity-100 rounded-full hover:bg-blue-50"
        ),
        weekday: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-12 p-0  font-bold "
        ),
    
        button_next: "absolute right-1 pt-6",
        button_previous: "absolute left-1 pt-6",
        // weekday: "text-primary font-bold text-xl",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full font-medium shadow-sm",
        day_today: "bg-blue-50 text-blue-600 font-medium",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-gray-100 opacity-10 bg-red-900 hover:bg-transparent",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      // components={{
      //   IconLeft: () => <ChevronLeft className="h-4 w-4" />,
      //   IconRight: () => <ChevronRight className="h-4 w-4" />,
      // }}
    
      {...props}
    />
    
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
