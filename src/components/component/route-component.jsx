"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

export function RouteComponent() {
  const [routeData, setRouteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    stop: "",
    time: "",
    vehicleNumber: "",
  });

  const fetchRouteData = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/adarsh-gupta101/Kerala-Private-Bus-Timing/main/${searchTerm}.json`
      );
      if (!response.ok) throw new Error("Data fetch failed");
      const data = await response.json();
      setRouteData(data.busSchedules);
      setFilteredData(data.busSchedules);
    } catch (error) {
      console.error("Failed to fetch route data:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let result = routeData;

    if (filters.stop) {
      result = result.filter((route) =>
        route.route.some((stop) =>
          stop.toLowerCase().includes(filters.stop.toLowerCase())
        )
      );
    }

    if (filters.time) {
      result = result.filter((route) =>
        route.schedule.some((trip) =>
          trip.stations.some(
            (station) =>
              station.arrivalTime
                .toLowerCase()
                .includes(filters.time.toLowerCase()) ||
              station.departureTime
                .toLowerCase()
                .includes(filters.time.toLowerCase())
          )
        )
      );
    }

    if (filters.vehicleNumber) {
      result = result.filter((route) =>
        route["Vehicle Number"]
          .toLowerCase()
          .includes(filters.vehicleNumber.toLowerCase())
      );
    }
console.log(result)
    setFilteredData(result);
  };

  const handleSearch = (searchTerm) => {
    fetchRouteData(searchTerm);
  };

  return (
    <div className="grid min-h-screen items-start gap-4 px-4 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col w-full min-h-screen py-2">
        <HeaderComponent onSearch={handleSearch} />
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="outline">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold text-lg md:text-xl">Route</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button className="hidden sm:flex" variant="outline">
                Coming Soon
              </Button>
              <Button className="hidden md:flex" variant="outline">
                Coming Soon
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="w-[280px] justify-start text-left font-normal"
                    id="date"
                    variant="outline"
                  >
                    <CalendarClockIcon className="mr-2 h-4 w-4" />
                    June 01, 2023 - June 30, 2023
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar initialFocus mode="range" numberOfMonths={2} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Filter by stop"
              name="stop"
              value={filters.stop}
              onChange={(e)=>handleFilterChange(e)}
            />
            <Input
              type="text"
              placeholder="Filter by time (e.g., 06:20 am)"
              name="time"
              value={filters.time}
              onChange={handleFilterChange}
            />
            <Input
              type="text"
              placeholder="Filter by vehicle number"
              name="vehicleNumber"
              value={filters.vehicleNumber}
              onChange={handleFilterChange}
            />
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>

          <div className="grid gap-4">
            {/* print count of the data */}
            <h3>Count: {filteredData.length}</h3>

            {filteredData.map((data) => (
              <div key={Math.random()}>
                <Card>
                  <CardHeader className="grid gap-1">
                    <CardTitle className="text-base font-semibold">
                      Vehicle Numbers
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      {data["Vehicle Number"]}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Route</CardTitle>
                    <CardDescription>Route for the vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:gap-8">
                      <div className="flex flex-col items-start gap-4">
                        {data.route.map((route, index) => (
                          <div className="flex justify-center" key={index}>
                            <MapPinIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            <div className="grid gap-1">
                              <h2 className="font-semibold">{route}</h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {JSON.stringify(route)
                                  .toLowerCase()
                                  .replace(/"/g, "")
                                  .replace(/,/g, " ")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>Timings for the vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stop</TableHead>
                          <TableHead>Arrival</TableHead>
                          <TableHead>Departure</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.schedule.flatMap((trip, tripIndex) =>
                          trip.stations.map((station, stationIndex) => (
                            <TableRow key={`${tripIndex}-${stationIndex}`}>
                              <TableCell>{station.station}</TableCell>
                              <TableCell>{station.arrivalTime}</TableCell>
                              <TableCell>{station.departureTime}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function HeaderComponent({ onSearch }) {
  const [selectedSearchTerm, setSelectedSearchTerm] = useState("");

  const filenames = [
    "alappuzha",
    "attingal",
    "ernakulam",
    "idukki",
    "kannur",
    "kottayam",
    "kozhikkode",
    "malapuram",
    "muvattupuzha",
    "palakkad-1",
    "palakkad-2",
    "pathanamthitta",
    "vadakara",
    "wayanad",
  ];

  const searchTerms = filenames.map((filename) => ({
    label: filename.charAt(0).toUpperCase() + filename.slice(1),
    value: filename,
  }));

  searchTerms.unshift({ label: "Choose a location", value: "" });

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSelectedSearchTerm(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Link className="lg:hidden" href="#">
        <Package2Icon className="h-6 w-6" />
      </Link>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <select
              name="Select Your Place"
              className="w-full bg-white border border-gray-300 shadow-none pl-3 pr-8 h-10 rounded-md dark:border-gray-700 dark:bg-gray-800"
              value={selectedSearchTerm}
              onChange={handleSearchChange}
            >
              {searchTerms.map((term) => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="flex w-[280px] flex-col gap-y-4">
        <Link href="/" className="hidden items-center space-x-2 lg:flex">
          <Package2Icon className="h-6 w-6" />
          <span className="hidden font-bold lg:inline-block">SIDEBAR</span>
        </Link>
        <div className="flex-1">
          <nav className="flex flex-col items-start gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Dropdown Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[220px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyboardIcon className="mr-2 h-4 w-4" />
                  <span>Keyboard shortcuts</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </aside>
  );
}

// ... (previous code remains unchanged)

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LandmarkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

function BusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function CalendarClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.25V14" />
      <path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function KeyboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" ry="2" />
      <path d="M6 8h.001" />
      <path d="M10 8h.001" />
      <path d="M14 8h.001" />
      <path d="M18 8h.001" />
      <path d="M8 12h.001" />
      <path d="M12 12h.001" />
      <path d="M16 12h.001" />
      <path d="M7 16h10" />
    </svg>
  );
}

function CreditCardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}