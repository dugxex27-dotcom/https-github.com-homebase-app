import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertHomeApplianceSchema } from "@shared/schema";
import type { HomeAppliance } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Wrench, DollarSign, MapPin, RotateCcw, ChevronDown, Settings, Plus, Edit, Trash2, Home } from "lucide-react";

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
  systemRequirements?: string[];
}

// Form schema for appliance creation/editing
const applianceFormSchema = insertHomeApplianceSchema.extend({
  homeownerId: z.string().min(1, "Homeowner ID is required"),
});

type ApplianceFormData = z.infer<typeof applianceFormSchema>;

const APPLIANCE_TYPES = [
  { value: "hvac", label: "HVAC System" },
  { value: "water_heater", label: "Water Heater" },
  { value: "washer", label: "Washing Machine" },
  { value: "dryer", label: "Dryer" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "oven", label: "Oven/Range" },
  { value: "garbage_disposal", label: "Garbage Disposal" },
  { value: "furnace", label: "Furnace" },
  { value: "boiler", label: "Boiler" },
  { value: "sump_pump", label: "Sump Pump" },
  { value: "water_softener", label: "Water Softener" },
  { value: "generator", label: "Generator" },
  { value: "pool_equipment", label: "Pool Equipment" },
  { value: "other", label: "Other" }
];

const APPLIANCE_LOCATIONS = [
  { value: "kitchen", label: "Kitchen" },
  { value: "basement", label: "Basement" },
  { value: "garage", label: "Garage" },
  { value: "utility_room", label: "Utility Room" },
  { value: "laundry_room", label: "Laundry Room" },
  { value: "attic", label: "Attic" },
  { value: "outdoor", label: "Outdoor" },
  { value: "main_floor", label: "Main Floor" },
  { value: "second_floor", label: "Second Floor" },
  { value: "other", label: "Other" }
];



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

const HOME_SYSTEMS = {
  heating: [
    { value: "gas-furnace", label: "Gas Furnace" },
    { value: "oil-furnace", label: "Oil Furnace" },
    { value: "electric-furnace", label: "Electric Furnace" },
    { value: "heat-pump", label: "Heat Pump" },
    { value: "boiler", label: "Boiler" },
    { value: "radiant-floor", label: "Radiant Floor Heating" },
    { value: "wood-stove", label: "Wood Stove/Fireplace" }
  ],
  cooling: [
    { value: "central-ac", label: "Central AC" },
    { value: "window-ac", label: "Window AC Units" },
    { value: "mini-split", label: "Mini-Split System" },
    { value: "evaporative", label: "Evaporative Cooler" }
  ],
  water: [
    { value: "gas-water-heater", label: "Gas Water Heater" },
    { value: "electric-water-heater", label: "Electric Water Heater" },
    { value: "tankless-gas", label: "Tankless Gas" },
    { value: "tankless-electric", label: "Tankless Electric" },
    { value: "solar-water", label: "Solar Water Heating" },
    { value: "well-water", label: "Well Water System" },
    { value: "water-softener", label: "Water Softener" }
  ],
  features: [
    { value: "solar-panels", label: "Solar Panels" },
    { value: "pool", label: "Swimming Pool" },
    { value: "spa", label: "Hot Tub/Spa" },
    { value: "generator", label: "Backup Generator" },
    { value: "septic", label: "Septic System" },
    { value: "sump-pump", label: "Sump Pump" },
    { value: "security-system", label: "Security System" },
    { value: "sprinkler-system", label: "Irrigation/Sprinkler System" }
  ]
};

export default function Maintenance() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedZone, setSelectedZone] = useState<string>("pacific-northwest");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [homeSystems, setHomeSystems] = useState<string[]>([]);
  const [showSystemFilters, setShowSystemFilters] = useState(false);
  const [isApplianceDialogOpen, setIsApplianceDialogOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<HomeAppliance | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For demo purposes, we'll use a default homeowner ID
  const homeownerId = "demo-homeowner-123";

  // Appliance queries and mutations
  const { data: appliances, isLoading: appliancesLoading } = useQuery<HomeAppliance[]>({
    queryKey: ['/api/appliances', { homeownerId }],
    queryFn: async () => {
      const response = await fetch(`/api/appliances?homeownerId=${homeownerId}`);
      if (!response.ok) throw new Error('Failed to fetch appliances');
      return response.json();
    },
  });

  const applianceForm = useForm<ApplianceFormData>({
    resolver: zodResolver(applianceFormSchema),
    defaultValues: {
      homeownerId,
      applianceType: "",
      brand: "",
      model: "",
      yearInstalled: undefined,
      serialNumber: "",
      notes: "",
      location: "",
      warrantyExpiration: "",
      lastServiceDate: "",
    },
  });

  const createApplianceMutation = useMutation({
    mutationFn: async (data: ApplianceFormData) => {
      const response = await fetch('/api/appliances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create appliance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      setIsApplianceDialogOpen(false);
      applianceForm.reset();
      toast({ title: "Success", description: "Appliance added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add appliance", variant: "destructive" });
    },
  });

  const updateApplianceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApplianceFormData> }) => {
      const response = await fetch(`/api/appliances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update appliance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      setIsApplianceDialogOpen(false);
      setEditingAppliance(null);
      applianceForm.reset();
      toast({ title: "Success", description: "Appliance updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update appliance", variant: "destructive" });
    },
  });

  const deleteApplianceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/appliances/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete appliance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      toast({ title: "Success", description: "Appliance deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete appliance", variant: "destructive" });
    },
  });

  // Load completed tasks and home systems from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('maintenance-completed-tasks');
    if (storedTasks) {
      try {
        setCompletedTasks(JSON.parse(storedTasks));
      } catch {
        setCompletedTasks({});
      }
    }

    const storedSystems = localStorage.getItem('home-systems');
    if (storedSystems) {
      try {
        setHomeSystems(JSON.parse(storedSystems));
      } catch {
        setHomeSystems([]);
      }
    }
  }, []);

  // Save completed tasks and home systems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('maintenance-completed-tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('home-systems', JSON.stringify(homeSystems));
  }, [homeSystems]);

  // Generate unique key for task completion tracking (includes month/year)
  const getTaskKey = (taskId: string, month: number, year: number) => {
    return `${taskId}-${month}-${year}`;
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    const currentYear = new Date().getFullYear();
    const taskKey = getTaskKey(taskId, selectedMonth, currentYear);
    
    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  // Check if task is completed
  const isTaskCompleted = (taskId: string) => {
    const currentYear = new Date().getFullYear();
    const taskKey = getTaskKey(taskId, selectedMonth, currentYear);
    return completedTasks[taskKey] || false;
  };

  // Reset all tasks for current month/year
  const resetMonthTasks = () => {
    const currentYear = new Date().getFullYear();
    const updatedTasks = { ...completedTasks };
    
    // Remove all completed tasks for current month/year
    Object.keys(updatedTasks).forEach(key => {
      if (key.includes(`-${selectedMonth}-${currentYear}`)) {
        delete updatedTasks[key];
      }
    });
    
    setCompletedTasks(updatedTasks);
  };

  // Toggle home system selection
  const toggleHomeSystem = (system: string) => {
    setHomeSystems(prev => 
      prev.includes(system) 
        ? prev.filter(s => s !== system)
        : [...prev, system]
    );
  };

  // Appliance helper functions
  const handleEditAppliance = (appliance: HomeAppliance) => {
    setEditingAppliance(appliance);
    applianceForm.reset({
      homeownerId: appliance.homeownerId,
      applianceType: appliance.applianceType,
      brand: appliance.brand,
      model: appliance.model,
      yearInstalled: appliance.yearInstalled || undefined,
      serialNumber: appliance.serialNumber ?? "",
      notes: appliance.notes ?? "",
      location: appliance.location ?? "",
      warrantyExpiration: appliance.warrantyExpiration ?? "",
      lastServiceDate: appliance.lastServiceDate ?? "",
    });
    setIsApplianceDialogOpen(true);
  };

  const handleAddNewAppliance = () => {
    setEditingAppliance(null);
    applianceForm.reset({
      homeownerId,
      applianceType: "",
      brand: "",
      model: "",
      yearInstalled: undefined,
      serialNumber: "",
      notes: "",
      location: "",
      warrantyExpiration: "",
      lastServiceDate: "",
    });
    setIsApplianceDialogOpen(true);
  };

  const onSubmitAppliance = (data: ApplianceFormData) => {
    if (editingAppliance) {
      updateApplianceMutation.mutate({ id: editingAppliance.id, data });
    } else {
      createApplianceMutation.mutate(data);
    }
  };

  const getApplianceTypeLabel = (type: string) => {
    return APPLIANCE_TYPES.find(t => t.value === type)?.label || type;
  };

  const getApplianceLocationLabel = (location: string) => {
    return APPLIANCE_LOCATIONS.find(l => l.value === location)?.label || location;
  };

  // Generate maintenance tasks based on month and location
  const getMaintenanceTasksForMonth = (month: number): MaintenanceTask[] => {
    const isWinter = month === 12 || month === 1 || month === 2;
    const isSpring = month === 3 || month === 4 || month === 5;
    const isSummer = month === 6 || month === 7 || month === 8;
    const isFall = month === 9 || month === 10 || month === 11;

    const tasks: MaintenanceTask[] = [];

    // Universal monthly tasks
    tasks.push(
      {
        id: "monthly-smoke-detectors",
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
        id: "monthly-hvac-filter",
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
        id: "monthly-water-check",
        title: "Check Water Systems",
        description: "Test water pressure, look for leaks under sinks, and run garbage disposal with citrus peels.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "medium",
        estimatedTime: "15 minutes",
        difficulty: "easy",
        category: "Plumbing",
        tools: ["Baking soda", "Vinegar", "Citrus peels"],
        cost: "$0-5"
      }
    );

    // Winter tasks (December, January, February)
    if (isWinter) {
      // Cold climate winter tasks
      if (["pacific-northwest", "northeast", "midwest", "mountain-west"].includes(selectedZone)) {
        tasks.push({
          id: "winter-heating-check",
          title: "Inspect Heating System Operation",
          description: month === 12 ? "Schedule professional HVAC maintenance before peak winter season." : 
                      month === 1 ? "Monitor heating system efficiency and check for unusual sounds or smells." :
                      "Check heating vents for blockages and ensure consistent heating throughout home.",
          month: month,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: month === 12 ? "2 hours" : "30 minutes",
          difficulty: month === 12 ? "moderate" : "easy",
          category: "HVAC",
          tools: month === 12 ? null : ["Flashlight"],
          cost: month === 12 ? "$100-200" : "$0"
        });
      }

      // Mild climate winter tasks
      if (["southeast", "southwest", "california"].includes(selectedZone)) {
        tasks.push({
          id: "winter-mild-maintenance",
          title: "Winter Home Preparation",
          description: month === 12 ? "Clean and inspect fireplace and chimney if applicable." :
                      month === 1 ? "Check for any moisture issues and inspect exterior paint for winter damage." :
                      "Prune dormant trees and shrubs, clean and store outdoor furniture.",
          month: month,
          climateZones: ["southeast", "southwest", "california"],
          priority: "medium",
          estimatedTime: "1-2 hours",
          difficulty: "moderate",
          category: month === 2 ? "Landscaping" : "General",
          tools: month === 2 ? ["Pruning shears", "Garden gloves"] : ["Flashlight", "Cleaning supplies"],
          cost: "$10-30"
        });
      }
    }

    // Spring tasks (March, April, May)
    if (isSpring) {
      tasks.push({
        id: "spring-exterior-prep",
        title: "Spring Exterior Maintenance",
        description: month === 3 ? "Inspect roof for winter damage and check gutters for clogs or damage." :
                    month === 4 ? "Power wash deck, patio, and exterior siding. Check exterior paint." :
                    "Deep clean windows inside and out, inspect and repair window screens.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "high",
        estimatedTime: month === 4 ? "3-4 hours" : "2-3 hours",
        difficulty: "moderate",
        category: month === 3 ? "Roofing" : month === 4 ? "Exterior" : "Windows",
        tools: month === 3 ? ["Ladder", "Binoculars"] : 
              month === 4 ? ["Power washer", "Cleaning supplies"] : 
              ["Window cleaner", "Squeegee", "Repair kit"],
        cost: month === 3 ? "$0-50" : month === 4 ? "$20-40" : "$15-35"
      });
    }

    // Summer tasks (June, July, August)
    if (isSummer) {
      // Hot climate summer tasks
      if (["southeast", "southwest", "california", "great-plains"].includes(selectedZone)) {
        tasks.push({
          id: "summer-cooling-maintenance",
          title: "Cooling System Maintenance",
          description: month === 6 ? "Deep clean AC filters and check refrigerant levels professionally." :
                      month === 7 ? "Monitor AC efficiency, clean vents and registers throughout home." :
                      "Inspect AC ductwork for leaks and ensure optimal cooling performance.",
          month: month,
          climateZones: ["southeast", "southwest", "california", "great-plains"],
          priority: "high",
          estimatedTime: month === 6 ? "2 hours" : "1 hour",
          difficulty: month === 6 ? "moderate" : "easy",
          category: "HVAC",
          tools: ["New air filter", "Vacuum", "Cleaning supplies"],
          cost: month === 6 ? "$50-100" : "$0-25"
        });
      }
    }

    // Fall tasks (September, October, November)
    if (isFall) {
      // Cold climate fall winterization
      if (["pacific-northwest", "northeast", "midwest", "mountain-west"].includes(selectedZone)) {
        tasks.push({
          id: "fall-winterization",
          title: "Fall Winterization Prep",
          description: month === 9 ? "Inspect and service heating system before cold weather arrives." :
                      month === 10 ? "Winterize outdoor water systems, drain and store hoses." :
                      "Final exterior home inspection, seal gaps and cracks before winter.",
          month: month,
          climateZones: ["pacific-northwest", "northeast", "midwest", "mountain-west"],
          priority: "high",
          estimatedTime: month === 9 ? "2-3 hours" : "1-2 hours",
          difficulty: "moderate",
          category: month === 9 ? "HVAC" : month === 10 ? "Plumbing" : "Weatherization",
          tools: month === 10 ? ["Hose storage", "Shut-off tools"] : ["Caulk", "Weather stripping"],
          cost: "$25-75"
        });
      }
    }

    // System-specific tasks
    tasks.push(
      {
        id: "monthly-gas-furnace",
        title: "Check Gas Furnace Filter and Vents",
        description: "Inspect furnace filter for clogs and ensure all vents are unobstructed for proper airflow.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "medium",
        estimatedTime: "15 minutes",
        difficulty: "easy",
        category: "HVAC",
        tools: null,
        cost: "$0",
        systemRequirements: ["gas-furnace"]
      },
      {
        id: "monthly-heat-pump",
        title: "Clean Heat Pump Outdoor Unit",
        description: "Remove debris from around outdoor unit and check for ice buildup in winter.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "california"],
        priority: "medium",
        estimatedTime: "20 minutes",
        difficulty: "easy",
        category: "HVAC",
        tools: ["Garden hose", "Soft brush"],
        cost: "$0",
        systemRequirements: ["heat-pump"]
      },
      {
        id: "monthly-generator",
        title: "Test Backup Generator",
        description: "Run generator for 15-30 minutes to ensure proper operation and check fuel levels.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "high",
        estimatedTime: "30 minutes",
        difficulty: "moderate",
        category: "Electrical",
        tools: null,
        cost: "$0",
        systemRequirements: ["generator"]
      }
    );

    // Pool tasks (summer only)
    if (isSummer) {
      tasks.push(
        {
          id: "summer-pool",
          title: "Pool Maintenance and Chemical Balance",
          description: "Test and balance pool chemicals, clean skimmer baskets, and brush pool walls.",
          month: month,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "high",
          estimatedTime: "1-2 hours",
          difficulty: "moderate",
          category: "Pool",
          tools: ["Pool test kit", "Pool chemicals", "Pool brush", "Skimmer net"],
          cost: "$30-60",
          systemRequirements: ["pool"]
        },
        {
          id: "summer-spa",
          title: "Hot Tub/Spa Water Treatment",
          description: "Test water chemistry, clean filters, and check for proper heating and circulation.",
          month: month,
          climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
          priority: "high",
          estimatedTime: "45 minutes",
          difficulty: "moderate",
          category: "Spa",
          tools: ["Spa test strips", "Spa chemicals"],
          cost: "$25-45",
          systemRequirements: ["spa"]
        }
      );
    }

    // Solar panel tasks
    if (isSummer || month === 3 || month === 9) {
      tasks.push({
        id: `solar-${month}`,
        title: isSummer ? "Clean Solar Panels" : "Solar Panel System Inspection",
        description: isSummer ? 
          "Remove dust, pollen, and debris from solar panels to maintain efficiency." :
          "Check mounting hardware, wiring connections, and monitor system performance data.",
        month: month,
        climateZones: ["pacific-northwest", "northeast", "southeast", "midwest", "southwest", "mountain-west", "california", "great-plains"],
        priority: "medium",
        estimatedTime: isSummer ? "2-3 hours" : "1 hour",
        difficulty: "moderate",
        category: "Solar",
        tools: isSummer ? ["Garden hose", "Soft brush", "Squeegee"] : ["Multimeter", "Binoculars"],
        cost: isSummer ? "$0-20" : "$0",
        systemRequirements: ["solar-panels"]
      });
    }

    return tasks;
  };

  const maintenanceTasks = getMaintenanceTasksForMonth(selectedMonth);

  const filteredTasks = maintenanceTasks.filter(task => {
    // Filter by climate zone
    if (!task.climateZones.includes(selectedZone)) {
      return false;
    }
    
    // Filter by home systems - if task has system requirements, user must have at least one
    if (task.systemRequirements && task.systemRequirements.length > 0) {
      return task.systemRequirements.some(requirement => homeSystems.includes(requirement));
    }
    
    // If no system requirements, show the task
    return true;
  });

  const completedCount = filteredTasks.filter(task => isTaskCompleted(task.id)).length;
  const totalTasks = filteredTasks.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'difficult': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Monthly Maintenance Schedule
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Keep your home in perfect condition with personalized maintenance recommendations
          </p>
        </div>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="text-sm text-muted-foreground">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  {MONTHS[selectedMonth - 1]} • {CLIMATE_ZONES.find(z => z.value === selectedZone)?.label}
                </div>
                
                {totalTasks > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      Progress: {completedCount}/{totalTasks} completed
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetMonthTasks}
                      className="text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset Month
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
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

              {/* Home Systems Filter */}
              <Collapsible open={showSystemFilters} onOpenChange={setShowSystemFilters}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Home Systems & Features ({homeSystems.length} selected)
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSystemFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 border rounded-lg bg-muted/50">
                    {Object.entries(HOME_SYSTEMS).map(([category, systems]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm mb-3 capitalize text-foreground">
                          {category === 'features' ? 'Special Features' : `${category} System`}
                        </h4>
                        <div className="space-y-2">
                          {systems.map((system) => (
                            <div key={system.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={system.value}
                                checked={homeSystems.includes(system.value)}
                                onCheckedChange={() => toggleHomeSystem(system.value)}
                              />
                              <label
                                htmlFor={system.value}
                                className="text-sm text-muted-foreground cursor-pointer"
                              >
                                {system.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => {
                const completed = isTaskCompleted(task.id);
                return (
                  <Card 
                    key={task.id} 
                    className={`hover:shadow-md transition-all ${
                      completed ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mt-1"
                          />
                          <CardTitle className={`text-lg font-semibold ${
                            completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-foreground'
                          }`}>
                            {task.title}
                          </CardTitle>
                        </div>
                        <Badge className={`${getPriorityColor(task.priority)} border ml-2`}>
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
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No tasks for this month and location
                  </h3>
                  <p className="text-muted-foreground">
                    Try selecting a different month or climate zone to see recommended maintenance tasks.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appliances" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">My Appliances</h3>
                <p className="text-sm text-muted-foreground">
                  Track your home appliances to help contractors provide better service
                </p>
              </div>
              <Button onClick={handleAddNewAppliance} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Appliance
              </Button>
            </div>

            {appliancesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : appliances && appliances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appliances.map((appliance) => (
                  <Card key={appliance.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Home className="w-5 h-5 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground">
                            {getApplianceTypeLabel(appliance.applianceType)}
                          </h4>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditAppliance(appliance)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteApplianceMutation.mutate(appliance.id)}
                            disabled={deleteApplianceMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Brand:</span>
                          <span className="font-medium">{appliance.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span className="font-medium">{appliance.model}</span>
                        </div>
                        {appliance.yearInstalled && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year:</span>
                            <span className="font-medium">{appliance.yearInstalled}</span>
                          </div>
                        )}
                        {appliance.location && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{getApplianceLocationLabel(appliance.location)}</span>
                          </div>
                        )}
                        {appliance.lastServiceDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Service:</span>
                            <span className="font-medium">{new Date(appliance.lastServiceDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {appliance.notes && (
                        <div className="mt-3 p-2 bg-muted rounded text-xs">
                          <span className="text-muted-foreground">{appliance.notes}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No appliances yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your home appliances to help contractors provide better service.
                </p>
                <Button onClick={handleAddNewAppliance}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Appliance
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Appliance Form Dialog */}
        <Dialog open={isApplianceDialogOpen} onOpenChange={setIsApplianceDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAppliance ? 'Edit Appliance' : 'Add New Appliance'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...applianceForm}>
              <form onSubmit={applianceForm.handleSubmit(onSubmitAppliance)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={applianceForm.control}
                    name="applianceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appliance Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select appliance type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {APPLIANCE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={applianceForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {APPLIANCE_LOCATIONS.map((location) => (
                              <SelectItem key={location.value} value={location.value}>
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={applianceForm.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Whirlpool, GE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={applianceForm.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Model number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={applianceForm.control}
                    name="yearInstalled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Installed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2020" 
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={applianceForm.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Serial number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={applianceForm.control}
                    name="warrantyExpiration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Expiration</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={applianceForm.control}
                    name="lastServiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Service Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={applianceForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Any special notes or maintenance history..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsApplianceDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createApplianceMutation.isPending || updateApplianceMutation.isPending}
                  >
                    {createApplianceMutation.isPending || updateApplianceMutation.isPending ? 'Saving...' : editingAppliance ? 'Update' : 'Add'} Appliance
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}