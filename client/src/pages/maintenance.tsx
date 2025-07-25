import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Wrench, DollarSign, MapPin } from "lucide-react";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  month: number;
  climateZones: string[];
  priority: string;
  estimatedTime: string;
  difficulty: string;
  category: string;
  tools: string[] | null;
  cost: string | null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CLIMATE_ZONES = [
  { value: "pacific-northwest", label: "Pacific Northwest" },
  { value: "northeast", label: "Northeast" },
  { value: "southeast", label: "Southeast" },
  { value: "midwest", label: "Midwest" },
  { value: "southwest", label: "Southwest" },
  { value: "mountain-west", label: "Mountain West" },
  { value: "california", label: "California" },
  { value: "great-plains", label: "Great Plains" }
];

export default function Maintenance() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedZone, setSelectedZone] = useState<string>("pacific-northwest");

  // Comprehensive maintenance schedule based on professional recommendations
  const getMaintenanceTasksForMonth = (month: number): MaintenanceTask[] => {
    const allTasks: MaintenanceTask[] = [
      // MONTHLY TASKS (Every Month)
      {
        id: "monthly-1",
        title: "Test Smoke and Carbon Monoxide Detectors",
        description: "Check batteries and functionality by pressing test buttons. Replace batteries if chirping or low.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "high",
        estimatedTime: "15 minutes",
        difficulty: "easy",
        category: "Safety",
        tools: ["9V batteries"],
        cost: "$10-15"
      },
      {
        id: "monthly-2",
        title: "Change HVAC Air Filters",
        description: "Replace air filters every 30-60 days, more frequently during heavy use seasons. Check size and MERV rating.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "high",
        estimatedTime: "10 minutes",
        difficulty: "easy",
        category: "HVAC",
        tools: ["New air filter"],
        cost: "$15-40"
      },
      {
        id: "monthly-3",
        title: "Clean Garbage Disposal",
        description: "Use baking soda and vinegar or grind citrus peels to eliminate odors and clean blades.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "medium",
        estimatedTime: "10 minutes",
        difficulty: "easy",
        category: "Appliances",
        tools: ["Baking soda", "Vinegar", "Citrus peels"],
        cost: "$0-5"
      },
      {
        id: "monthly-4",
        title: "Clean Dryer Vent",
        description: "Remove lint buildup from dryer vent to prevent fire hazard and improve efficiency.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "high",
        estimatedTime: "30 minutes",
        difficulty: "easy",
        category: "Safety",
        tools: ["Vacuum", "Dryer brush"],
        cost: "$0-20"
      },
      {
        id: "monthly-5",
        title: "Run Water in Unused Areas",
        description: "Flush toilets and run faucets in guest bathrooms or unused areas to prevent sewer gas buildup.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "low",
        estimatedTime: "5 minutes",
        difficulty: "easy",
        category: "Plumbing",
        tools: null,
        cost: "$0"
      },

      // WINTER TASKS (December - February)
      ...(month === 12 ? [
        {
          id: "dec-1",
          title: "Insulate Outdoor Water Faucets",
          description: "Install faucet covers and insulate exposed pipes to prevent freezing damage.",
          month: 12,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "1 hour",
          difficulty: "easy",
          category: "Winterization",
          tools: ["Faucet covers", "Pipe insulation", "Duct tape"],
          cost: "$15-40"
        } as MaintenanceTask,
        {
          id: "dec-2",
          title: "Cover Outdoor AC Units",
          description: "Protect central air units with weatherproof covers or store window units indoors.",
          month: 12,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "medium",
          estimatedTime: "30 minutes",
          difficulty: "easy",
          category: "HVAC",
          tools: ["AC cover", "Bungee cords"],
          cost: "$20-50"
        } as MaintenanceTask,
        {
          id: "dec-3",
          title: "Sweep Chimney and Prepare Fireplace",
          description: "Have chimney professionally cleaned and inspected. Check damper operation and screen condition.",
          month: 12,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "Professional service",
          difficulty: "difficult",
          category: "Safety",
          tools: null,
          cost: "$150-300"
        } as MaintenanceTask
      ] : []),

      ...(month === 1 ? [
        {
          id: "jan-1",
          title: "Monitor for Ice Dams",
          description: "Check roof edges for ice buildup that can cause water damage. Contact contractor if found.",
          month: 1,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "15 minutes",
          difficulty: "easy",
          category: "Exterior",
          tools: ["Binoculars (optional)"],
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "jan-2",
          title: "Service Heating System",
          description: "Have boiler or furnace professionally serviced before peak cold season arrives.",
          month: 1,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "Professional service",
          difficulty: "difficult",
          category: "HVAC",
          tools: null,
          cost: "$100-200"
        } as MaintenanceTask,
        {
          id: "jan-3",
          title: "Check Windows for Condensation",
          description: "Look for excessive moisture on windows and improve ventilation as needed to prevent mold.",
          month: 1,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "medium",
          estimatedTime: "20 minutes",
          difficulty: "easy",
          category: "Energy Efficiency",
          tools: ["Towels", "Fan"],
          cost: "$0-30"
        } as MaintenanceTask
      ] : []),

      ...(month === 2 ? [
        {
          id: "feb-1",
          title: "Clean Windows Inside and Out",
          description: "Wash windows and check wooden frames for rot or damage from winter weather.",
          month: 2,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "low",
          estimatedTime: "2-3 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Window cleaner", "Squeegee", "Microfiber cloths"],
          cost: "$10-25"
        } as MaintenanceTask,
        {
          id: "feb-2",
          title: "Deep Clean Indoor Spaces",
          description: "Focus on areas neglected during holidays - baseboards, light fixtures, and behind furniture.",
          month: 2,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "low",
          estimatedTime: "4-6 hours",
          difficulty: "moderate",
          category: "Interior",
          tools: ["Vacuum", "Microfiber cloths", "All-purpose cleaner"],
          cost: "$15-30"
        } as MaintenanceTask
      ] : []),

      // SPRING TASKS (March - May)
      ...(month === 3 ? [
        {
          id: "mar-1",
          title: "HVAC System Spring Inspection",
          description: "Schedule professional tune-up before cooling season. Clean outdoor unit and check refrigerant levels.",
          month: 3,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "high",
          estimatedTime: "Professional service",
          difficulty: "difficult",
          category: "HVAC",
          tools: null,
          cost: "$100-200"
        } as MaintenanceTask,
        {
          id: "mar-2",
          title: "Check Gutters for Winter Damage",
          description: "Clear debris and inspect for damage from ice, snow, and winter storms.",
          month: 3,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "2-3 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Ladder", "Garden hose", "Gloves", "Trowel"],
          cost: "$0-50"
        } as MaintenanceTask,
        {
          id: "mar-3",
          title: "Inspect Sidewalks and Driveway",
          description: "Look for freeze-damage cracks and plan repairs to prevent water infiltration.",
          month: 3,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "medium",
          estimatedTime: "30 minutes",
          difficulty: "easy",
          category: "Exterior",
          tools: null,
          cost: "$0"
        } as MaintenanceTask
      ] : []),

      ...(month === 4 ? [
        {
          id: "apr-1",
          title: "Remove Debris from AC Units",
          description: "Clear leaves, twigs, and debris from around outdoor AC units for optimal airflow.",
          month: 4,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "30 minutes",
          difficulty: "easy",
          category: "HVAC",
          tools: ["Garden hose", "Soft brush"],
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "apr-2",
          title: "Inspect Roof and Chimney",
          description: "Look for loose or missing shingles, damaged flashing, and chimney cap issues from winter.",
          month: 4,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "high",
          estimatedTime: "45 minutes",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Binoculars", "Ladder (if needed)"],
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "apr-3",
          title: "Service Lawn Equipment",
          description: "Tune-up mower, sharpen blades, change oil, and check spark plugs for the growing season.",
          month: 4,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "2 hours",
          difficulty: "moderate",
          category: "Yard",
          tools: ["Oil", "Spark plug", "Air filter", "Blade sharpener"],
          cost: "$30-60"
        } as MaintenanceTask
      ] : []),

      ...(month === 5 ? [
        {
          id: "may-1",
          title: "Deep Clean and Inspect Gutters",
          description: "Thoroughly clean gutters and downspouts. Check for proper drainage and secure mounting.",
          month: 5,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "high",
          estimatedTime: "3-4 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Ladder", "Garden hose", "Gloves", "Gutter scoop"],
          cost: "$0-30"
        } as MaintenanceTask,
        {
          id: "may-2",
          title: "Power Wash Exterior Surfaces",
          description: "Clean siding, decks, patios, and outdoor furniture to remove winter grime and mildew.",
          month: 5,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "4-6 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Pressure washer", "Garden hose", "Mild detergent"],
          cost: "$20-50"
        } as MaintenanceTask,
        {
          id: "may-3",
          title: "Inspect and Repair Concrete",
          description: "Fill driveway and walkway cracks to prevent water damage and further deterioration.",
          month: 5,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "2-3 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Concrete crack filler", "Trowel", "Wire brush"],
          cost: "$15-40"
        } as MaintenanceTask
      ] : []),

      // SUMMER TASKS (June - August)
      ...(month === 6 ? [
        {
          id: "jun-1",
          title: "Deep Clean AC Unit",
          description: "Professional cleaning of coils, fins, and internal components before peak summer usage.",
          month: 6,
          climateZones: ["northeast", "southeast", "midwest", "southwest", "california", "great-plains"],
          priority: "high",
          estimatedTime: "Professional service",
          difficulty: "difficult",
          category: "HVAC",
          tools: null,
          cost: "$100-200"
        } as MaintenanceTask,
        {
          id: "jun-2",
          title: "Clean Refrigerator Coils",
          description: "Vacuum dust and debris from coils behind or beneath refrigerator to improve efficiency.",
          month: 6,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "30 minutes",
          difficulty: "easy",
          category: "Appliances",
          tools: ["Vacuum", "Coil brush"],
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "jun-3",
          title: "Reverse Ceiling Fans",
          description: "Set ceiling fans to run counter-clockwise to push cool air down during summer months.",
          month: 6,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "low",
          estimatedTime: "15 minutes",
          difficulty: "easy",
          category: "Energy Efficiency",
          tools: null,
          cost: "$0"
        } as MaintenanceTask
      ] : []),

      ...(month === 7 ? [
        {
          id: "jul-1",
          title: "Inspect Foundation Drainage",
          description: "Check for water pooling around foundation and ensure proper grading away from house.",
          month: 7,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "high",
          estimatedTime: "45 minutes",
          difficulty: "easy",
          category: "Exterior",
          tools: null,
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "jul-2",
          title: "Check Basement/Crawl Space for Moisture",
          description: "Look for signs of water infiltration, mold, or excessive humidity that could cause damage.",
          month: 7,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "medium",
          estimatedTime: "30 minutes",
          difficulty: "easy",
          category: "Interior",
          tools: ["Flashlight", "Humidity meter"],
          cost: "$0-20"
        } as MaintenanceTask,
        {
          id: "jul-3",
          title: "Inspect for Insect Activity",
          description: "Look for signs of termites, carpenter ants, or other destructive insects around foundation and wood structures.",
          month: 7,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "45 minutes",
          difficulty: "easy",
          category: "Pest Control",
          tools: ["Flashlight"],
          cost: "$0"
        } as MaintenanceTask
      ] : []),

      ...(month === 8 ? [
        {
          id: "aug-1",
          title: "Organize and Clean Garage",
          description: "Deep clean garage, organize tools and equipment, and check for pest activity or water damage.",
          month: 8,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "low",
          estimatedTime: "4-6 hours",
          difficulty: "moderate",
          category: "Organization",
          tools: ["Broom", "Storage containers", "All-purpose cleaner"],
          cost: "$20-50"
        } as MaintenanceTask,
        {
          id: "aug-2",
          title: "Clean Kitchen Cabinets and Hardware",
          description: "Deep clean cabinet surfaces, hardware, and interior shelves. Check for loose hinges or handles.",
          month: 8,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "low",
          estimatedTime: "3-4 hours",
          difficulty: "easy",
          category: "Interior",
          tools: ["Wood cleaner", "Microfiber cloths", "Screwdriver"],
          cost: "$10-20"
        } as MaintenanceTask,
        {
          id: "aug-3",
          title: "Rotate Mattresses",
          description: "Flip and rotate mattresses to ensure even wear and extend their lifespan.",
          month: 8,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "low",
          estimatedTime: "30 minutes",
          difficulty: "easy",
          category: "Interior",
          tools: null,
          cost: "$0"
        } as MaintenanceTask
      ] : []),

      // FALL TASKS (September - November)
      ...(month === 9 ? [
        {
          id: "sep-1",
          title: "Schedule Heating System Maintenance",
          description: "Have furnace or boiler professionally serviced before cold weather arrives.",
          month: 9,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "Professional service",
          difficulty: "difficult",
          category: "HVAC",
          tools: null,
          cost: "$100-200"
        } as MaintenanceTask,
        {
          id: "sep-2",
          title: "Have Chimney Serviced",
          description: "Professional chimney cleaning and inspection to prepare for heating season use.",
          month: 9,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "Professional service",
          difficulty: "difficult",
          category: "Safety",
          tools: null,
          cost: "$150-300"
        } as MaintenanceTask,
        {
          id: "sep-3",
          title: "Whole-House Deep Clean",
          description: "Comprehensive deep cleaning including baseboards, light fixtures, ceiling fans, and forgotten corners.",
          month: 9,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "8-12 hours",
          difficulty: "moderate",
          category: "Interior",
          tools: ["Vacuum", "Microfiber cloths", "All-purpose cleaner", "Ladder"],
          cost: "$30-60"
        } as MaintenanceTask
      ] : []),

      ...(month === 10 ? [
        {
          id: "oct-1",
          title: "Final Gutter Cleaning",
          description: "Remove all leaves and debris from gutters and downspouts before winter weather arrives.",
          month: 10,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "3-4 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Ladder", "Garden hose", "Gloves", "Gutter scoop"],
          cost: "$0-30"
        } as MaintenanceTask,
        {
          id: "oct-2",
          title: "Trim Trees and Shrubs",
          description: "Cut back branches touching or near the house to prevent damage during winter storms.",
          month: 10,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "3-5 hours",
          difficulty: "moderate",
          category: "Yard",
          tools: ["Pruning shears", "Loppers", "Ladder", "Safety glasses"],
          cost: "$0-40"
        } as MaintenanceTask,
        {
          id: "oct-3",
          title: "Inspect and Secure Deck",
          description: "Check for loose nails, screws, or boards. Hammer down or replace as needed for winter safety.",
          month: 10,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "2-3 hours",
          difficulty: "moderate",
          category: "Exterior",
          tools: ["Hammer", "Screwdriver", "Replacement screws/nails"],
          cost: "$10-30"
        } as MaintenanceTask
      ] : []),

      ...(month === 11 ? [
        {
          id: "nov-1",
          title: "Drain Hot Water Heater Sediment",
          description: "Flush sediment from water heater tank to improve efficiency and extend unit life.",
          month: 11,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "medium",
          estimatedTime: "1 hour",
          difficulty: "moderate",
          category: "Plumbing",
          tools: ["Garden hose", "Bucket"],
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "nov-2",
          title: "Shut Off Outdoor Water Supply",
          description: "Turn off water to outdoor faucets and drain/store garden hoses to prevent freeze damage.",
          month: 11,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: "45 minutes",
          difficulty: "easy",
          category: "Winterization",
          tools: ["Wrench"],
          cost: "$0"
        } as MaintenanceTask,
        {
          id: "nov-3",
          title: "Install Storm Windows",
          description: "Put up storm windows if applicable, or check existing windows for air leaks and draft issues.",
          month: 11,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "medium",
          estimatedTime: "3-4 hours",
          difficulty: "moderate",
          category: "Energy Efficiency",
          tools: ["Screwdriver", "Weather stripping", "Caulk gun"],
          cost: "$20-80"
        } as MaintenanceTask
      ] : [])
    ];

    return allTasks.filter(task => task.month === month);
  };

  const maintenanceTasks = getMaintenanceTasksForMonth(selectedMonth);

  const filteredTasks = maintenanceTasks.filter(task => 
    task.climateZones.includes(selectedZone)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 text-green-700';
      case 'moderate': return 'bg-amber-50 text-amber-700';
      case 'difficult': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Monthly Maintenance Schedule
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay on top of home maintenance with personalized recommendations based on your location and the season.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Month
            </label>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Climate Zone
            </label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIMATE_ZONES.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {task.title}
                  </CardTitle>
                  <Badge className={`${getPriorityColor(task.priority)} border`}>
                    {task.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {task.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{task.estimatedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty}
                    </Badge>
                  </div>
                  {task.cost && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{task.cost}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                  </div>
                </div>

                {task.tools && task.tools.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Wrench className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Tools needed:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {task.tools.map((tool, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No tasks for this month and location
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different month or climate zone to see recommended maintenance tasks.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}