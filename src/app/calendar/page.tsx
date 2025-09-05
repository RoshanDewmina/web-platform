"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Users,
  BookOpen,
  Video,
  Target,
  Bell,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Edit,
  Trash2,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  type: "study" | "assignment" | "quiz" | "meeting" | "reminder";
  date: Date;
  startTime: string;
  endTime?: string;
  location?: string;
  link?: string;
  recurring?: boolean;
  participants?: string[];
  color?: string;
}

const eventTypeColors = {
  study: "bg-blue-500",
  assignment: "bg-purple-500",
  quiz: "bg-red-500",
  meeting: "bg-green-500",
  reminder: "bg-yellow-500",
};

const eventTypeIcons = {
  study: BookOpen,
  assignment: Target,
  quiz: Clock,
  meeting: Video,
  reminder: Bell,
};

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "study" as Event["type"],
    date: new Date(),
    startTime: "09:00",
    endTime: "",
    location: "",
    link: "",
    recurring: false,
  });

  // Mock events
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "React Study Session",
      description: "Review React hooks and state management",
      type: "study",
      date: new Date(),
      startTime: "14:00",
      endTime: "16:00",
      color: eventTypeColors.study,
    },
    {
      id: "2",
      title: "JavaScript Quiz",
      description: "Weekly JavaScript fundamentals quiz",
      type: "quiz",
      date: addDays(new Date(), 1),
      startTime: "10:00",
      endTime: "11:00",
      color: eventTypeColors.quiz,
    },
    {
      id: "3",
      title: "Study Group Meeting",
      description: "Discuss algorithm problems",
      type: "meeting",
      date: addDays(new Date(), 2),
      startTime: "19:00",
      endTime: "20:30",
      participants: ["Alice", "Bob", "Charlie"],
      link: "https://meet.example.com/study-group",
      color: eventTypeColors.meeting,
    },
    {
      id: "4",
      title: "Complete TypeScript Course",
      description: "Finish Module 3 of TypeScript course",
      type: "assignment",
      date: addDays(new Date(), 3),
      startTime: "23:59",
      color: eventTypeColors.assignment,
    },
    {
      id: "5",
      title: "Daily Learning Reminder",
      description: "Don't forget to maintain your streak!",
      type: "reminder",
      date: new Date(),
      startTime: "20:00",
      recurring: true,
      color: eventTypeColors.reminder,
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      location: newEvent.location,
      link: newEvent.link,
      recurring: newEvent.recurring,
      color: eventTypeColors[newEvent.type],
    };

    setEvents([...events, event]);
    setShowEventDialog(false);
    setNewEvent({
      title: "",
      description: "",
      type: "study",
      date: new Date(),
      startTime: "09:00",
      endTime: "",
      location: "",
      link: "",
      recurring: false,
    });
    toast.success("Event created successfully!");
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    toast.success("Event deleted successfully!");
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const getDaysInWeek = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return eachDayOfInterval({ start, end });
  };

  const upcomingEvents = events
    .filter((e) => e.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="grid gap-6 lg:grid-cols-7">
            <Skeleton className="lg:col-span-5 h-[600px]" />
            <Skeleton className="lg:col-span-2 h-[600px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                Calendar
                <CalendarIcon className="h-8 w-8 text-primary" />
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your study schedule and events
              </p>
            </div>
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add a new event to your calendar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      placeholder="e.g., Study Session"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: Event["type"]) =>
                        setNewEvent({ ...newEvent, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study">Study Session</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="quiz">Quiz/Test</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                      }
                      placeholder="Event details..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Calendar
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(date) =>
                        date && setNewEvent({ ...newEvent, date })
                      }
                      className="rounded-md border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, startTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  {newEvent.type === "meeting" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newEvent.location}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, location: e.target.value })
                          }
                          placeholder="Room or address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link">Meeting Link</Label>
                        <Input
                          id="link"
                          value={newEvent.link}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, link: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={newEvent.recurring}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, recurring: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="recurring" className="cursor-pointer">
                      Recurring event
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowEventDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent} disabled={!newEvent.title}>
                    Create Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 lg:grid-cols-7">
            {/* Calendar View */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {format(currentMonth, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Tabs value={view} onValueChange={(v: any) => setView(v)}>
                      <TabsList>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="day">Day</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1
                            )
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setCurrentMonth(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1
                            )
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {view === "month" && (
                  <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                    {/* Week days header */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="bg-background p-2 text-center text-sm font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {/* Calendar days */}
                    {getDaysInMonth().map((day, dayIdx) => {
                      const dayEvents = getEventsForDate(day);
                      return (
                        <div
                          key={day.toString()}
                          className={cn(
                            "bg-background p-2 min-h-[100px] cursor-pointer hover:bg-accent transition-colors",
                            !isSameMonth(day, currentMonth) && "opacity-50",
                            isToday(day) && "bg-accent/50",
                            isSameDay(day, selectedDate) && "ring-2 ring-primary"
                          )}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className="text-sm font-medium mb-1">
                            {format(day, "d")}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => {
                              const Icon = eventTypeIcons[event.type];
                              return (
                                <Tooltip key={event.id}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "text-xs p-1 rounded flex items-center gap-1 text-white truncate",
                                        event.color
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEvent(event);
                                      }}
                                    >
                                      <Icon className="h-3 w-3" />
                                      <span className="truncate">
                                        {event.title}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="space-y-1">
                                      <p className="font-medium">{event.title}</p>
                                      <p className="text-xs">
                                        {event.startTime}
                                        {event.endTime && ` - ${event.endTime}`}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {view === "week" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-8 gap-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Time
                      </div>
                      {getDaysInWeek().map((day) => (
                        <div
                          key={day.toString()}
                          className={cn(
                            "text-center p-2 rounded-lg",
                            isToday(day) && "bg-accent",
                            isSameDay(day, selectedDate) && "ring-2 ring-primary"
                          )}
                        >
                          <div className="text-sm font-medium">
                            {format(day, "EEE")}
                          </div>
                          <div className="text-lg">{format(day, "d")}</div>
                        </div>
                      ))}
                    </div>
                    {/* Time slots */}
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-px">
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="grid grid-cols-8 gap-2">
                            <div className="text-xs text-muted-foreground p-2">
                              {i.toString().padStart(2, "0")}:00
                            </div>
                            {getDaysInWeek().map((day) => {
                              const hourEvents = getEventsForDate(day).filter(
                                (e) => parseInt(e.startTime) === i
                              );
                              return (
                                <div
                                  key={day.toString()}
                                  className="border border-muted rounded p-1 min-h-[40px]"
                                >
                                  {hourEvents.map((event) => {
                                    const Icon = eventTypeIcons[event.type];
                                    return (
                                      <div
                                        key={event.id}
                                        className={cn(
                                          "text-xs p-1 rounded text-white",
                                          event.color
                                        )}
                                      >
                                        <div className="flex items-center gap-1">
                                          <Icon className="h-3 w-3" />
                                          <span className="truncate">
                                            {event.title}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {view === "day" && (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-accent rounded-lg">
                      <div className="text-2xl font-bold">
                        {format(selectedDate, "EEEE")}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        {format(selectedDate, "MMMM d, yyyy")}
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {getEventsForDate(selectedDate).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No events scheduled for this day
                          </div>
                        ) : (
                          getEventsForDate(selectedDate).map((event) => {
                            const Icon = eventTypeIcons[event.type];
                            return (
                              <Card key={event.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={cn(
                                          "p-2 rounded-lg text-white",
                                          event.color
                                        )}
                                      >
                                        <Icon className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">
                                          {event.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {event.description}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {event.startTime}
                                            {event.endTime && ` - ${event.endTime}`}
                                          </div>
                                          {event.location && (
                                            <div className="flex items-center gap-1">
                                              <MapPin className="h-3 w-3" />
                                              {event.location}
                                            </div>
                                          )}
                                          {event.link && (
                                            <a
                                              href={event.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-1 text-primary hover:underline"
                                            >
                                              <LinkIcon className="h-3 w-3" />
                                              Join
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setSelectedEvent(event)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => deleteEvent(event.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  {event.recurring && (
                                    <Badge
                                      variant="outline"
                                      className="mt-2"
                                    >
                                      <Repeat className="h-3 w-3 mr-1" />
                                      Recurring
                                    </Badge>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mini Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Events</CardTitle>
                  <CardDescription>Next 5 events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No upcoming events
                      </p>
                    ) : (
                      upcomingEvents.map((event) => {
                        const Icon = eventTypeIcons[event.type];
                        return (
                          <div
                            key={event.id}
                            className="flex items-start gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors"
                            onClick={() => {
                              setSelectedDate(event.date);
                              setView("day");
                            }}
                          >
                            <div
                              className={cn(
                                "p-1.5 rounded text-white mt-0.5",
                                event.color
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-sm font-medium leading-none">
                                {event.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(event.date, "MMM d")} at {event.startTime}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Study Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Study Sessions
                      </span>
                      <span className="font-medium">
                        {events.filter((e) => e.type === "study").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Assignments Due
                      </span>
                      <span className="font-medium">
                        {events.filter((e) => e.type === "assignment").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Meetings
                      </span>
                      <span className="font-medium">
                        {events.filter((e) => e.type === "meeting").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Event Details Dialog */}
          {selectedEvent && (
            <Dialog
              open={!!selectedEvent}
              onOpenChange={() => setSelectedEvent(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {React.createElement(eventTypeIcons[selectedEvent.type], {
                      className: cn("h-5 w-5 text-white p-1 rounded", selectedEvent.color),
                    })}
                    {selectedEvent.title}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedEvent.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(selectedEvent.date, "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {selectedEvent.startTime}
                        {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                      </p>
                    </div>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                  )}
                  {selectedEvent.link && (
                    <div>
                      <p className="text-sm text-muted-foreground">Link</p>
                      <a
                        href={selectedEvent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedEvent.link}
                      </a>
                    </div>
                  )}
                  {selectedEvent.participants && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Participants
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.participants.map((participant) => (
                          <Badge key={participant} variant="secondary">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                  >
                    Delete Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
