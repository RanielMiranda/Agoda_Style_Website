import { CalendarDays, User, Settings, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookingsCard({ onBookings, alertCount = 0 }) {
    return (
        <Card className="p-6 rounded-2xl shadow-md bg-white">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Bookings</h3>
        <div className="relative mt-4">
          <Button 
            onClick={onBookings}
            className="w-full rounded-xl h-11 font-semibold flex items-center justify-center"
          >
            <CalendarDays size={18} className="mr-2" />
            Manage Bookings
          </Button>
          
          {alertCount > 0 && (
            <span className="absolute -top-2 -right-2 h-6 min-w-6 px-1 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {alertCount > 99 ? "99+" : alertCount}
            </span>
          )}
        </div>
      </Card>
    )
}
