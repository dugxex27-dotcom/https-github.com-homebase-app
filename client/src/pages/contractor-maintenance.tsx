import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertMaintenanceLogSchema, insertCustomMaintenanceTaskSchema, insertHomeSystemSchema } from "@shared/schema";
import type { MaintenanceLog, House, CustomMaintenanceTask, HomeSystem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, Wrench, DollarSign, MapPin, RotateCcw, ChevronDown, Settings, Plus, Edit, Trash2, Home, FileText, Building2, User, Building, Phone, MessageSquare, AlertTriangle, Thermometer, Cloud, Lightbulb } from "lucide-react";
import { AppointmentScheduler } from "@/components/appointment-scheduler";
import { CustomMaintenanceTasks } from "@/components/custom-maintenance-tasks";
import { US_MAINTENANCE_DATA, getRegionFromClimateZone, getCurrentMonthTasks } from "@shared/location-maintenance-data";

// Contractor maintenance component - simplified version that works with contractor ID
export default function ContractorMaintenance() {
  const { user, isAuthenticated } = useAuth();
  const userRole = (user as any)?.role;
  const contractorId = (user as any)?.id;
  const { toast } = useToast();

  // Use contractor ID as the data identifier
  const homeownerId = contractorId;

  // State for selected house and month
  const [selectedHouseId, setSelectedHouseId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Queries using contractor ID as homeowner ID
  const { data: houses = [], isLoading: housesLoading } = useQuery({
    queryKey: ['/api/houses'],
    queryFn: async () => {
      const response = await fetch('/api/houses');
      if (!response.ok) throw new Error('Failed to fetch houses');
      return response.json();
    },
    enabled: isAuthenticated && !!homeownerId
  });

  const { data: maintenanceLogs, isLoading: maintenanceLogsLoading } = useQuery<MaintenanceLog[]>({
    queryKey: ['/api/maintenance-logs', { homeownerId }],
    queryFn: async () => {
      const response = await fetch('/api/maintenance-logs');
      if (!response.ok) throw new Error('Failed to fetch maintenance logs');
      return response.json();
    },
    enabled: isAuthenticated && !!homeownerId
  });

  const { data: customMaintenanceTasks, isLoading: customTasksLoading } = useQuery<CustomMaintenanceTask[]>({
    queryKey: ['/api/custom-maintenance-tasks', { homeownerId }],
    queryFn: async () => {
      const response = await fetch('/api/custom-maintenance-tasks');
      if (!response.ok) throw new Error('Failed to fetch custom maintenance tasks');
      return response.json();
    },
    enabled: isAuthenticated && !!homeownerId
  });

  // Auto-select first house if available
  useEffect(() => {
    if (houses.length > 0 && !selectedHouseId) {
      setSelectedHouseId(houses[0].id);
    }
  }, [houses, selectedHouseId]);

  // Access control
  if (!userRole || (userRole !== 'homeowner' && userRole !== 'contractor')) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2c0f5b' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">This feature is only available to homeowners and contractors.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-white text-purple-900 hover:bg-gray-100">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8" style={{ color: '#2c0f5b' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#2c0f5b' }}>
              Smart Maintenance Schedule
            </h1>
          </div>
          <p className="text-gray-600">
            {userRole === 'contractor' 
              ? 'Track maintenance tasks for your personal property'
              : 'Stay on top of your home maintenance with personalized seasonal schedules'
            }
          </p>
        </div>

        {housesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your properties...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Property management section */}
            {houses.length === 0 && userRole === 'contractor' ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#2c0f5b' }}>
                    <Building className="w-5 h-5" />
                    Add Your Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Add your personal property to start tracking maintenance tasks. 
                    As a contractor, you can manage maintenance for one property.
                  </p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      toast({ 
                        title: "Add Property", 
                        description: "Property management coming soon!" 
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add My Property
                  </Button>
                </CardContent>
              </Card>
            ) : houses.length > 0 ? (
              <div className="border rounded-lg p-4 mb-6" style={{ backgroundColor: '#f2f2f2' }}>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2c0f5b' }}>
                      <Building className="inline w-4 h-4 mr-1" />
                      Select Property
                    </label>
                    <Select value={selectedHouseId} onValueChange={setSelectedHouseId}>
                      <SelectTrigger className="w-full" style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue placeholder="Choose a property..." />
                      </SelectTrigger>
                      <SelectContent>
                        {houses.map((house: House) => (
                          <SelectItem key={house.id} value={house.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{house.name}</span>
                              <span className="text-xs text-muted-foreground">{house.address}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {userRole === 'contractor' && houses.length >= 1 && (
                      <div className="text-xs p-2 rounded bg-blue-50 border border-blue-200 text-blue-700 mb-2">
                        Contractors can track maintenance for one personal property
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Month selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#2c0f5b' }}>
                <Calendar className="inline w-4 h-4 mr-1" />
                Select Month
              </label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Maintenance tasks display */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2c0f5b' }}>
                  Maintenance Tasks for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {userRole === 'contractor' 
                    ? 'Your maintenance schedule will appear here once you add your property.'
                    : 'Your maintenance schedule will appear here once you add a property.'
                  }
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}