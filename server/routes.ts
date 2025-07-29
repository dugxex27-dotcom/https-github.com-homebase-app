import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertHomeApplianceSchema, insertMaintenanceLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contractor routes
  app.get("/api/contractors", async (req, res) => {
    try {
      const filters = {
        services: req.query.services ? (req.query.services as string).split(',') : undefined,
        location: req.query.location as string,
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        availableThisWeek: req.query.availableThisWeek === 'true',
        hasEmergencyServices: req.query.hasEmergencyServices === 'true',
        maxDistance: req.query.maxDistance ? parseFloat(req.query.maxDistance as string) : undefined,
      };

      const contractors = await storage.getContractors(filters);
      res.json(contractors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contractors" });
    }
  });

  app.get("/api/contractors/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const location = req.query.location as string;
      
      const contractors = await storage.searchContractors(query, location);
      res.json(contractors);
    } catch (error) {
      res.status(500).json({ message: "Failed to search contractors" });
    }
  });

  app.get("/api/contractors/:id", async (req, res) => {
    try {
      const contractor = await storage.getContractor(req.params.id);
      if (!contractor) {
        return res.status(404).json({ message: "Contractor not found" });
      }
      res.json(contractor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contractor" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        featured: req.query.featured === 'true',
        search: req.query.search as string,
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Home Appliance routes
  app.get("/api/appliances", async (req, res) => {
    try {
      const homeownerId = req.query.homeownerId as string;
      const appliances = await storage.getHomeAppliances(homeownerId);
      res.json(appliances);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appliances" });
    }
  });

  app.get("/api/appliances/:id", async (req, res) => {
    try {
      const appliance = await storage.getHomeAppliance(req.params.id);
      if (!appliance) {
        return res.status(404).json({ message: "Appliance not found" });
      }
      res.json(appliance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appliance" });
    }
  });

  app.post("/api/appliances", async (req, res) => {
    try {
      const applianceData = insertHomeApplianceSchema.parse(req.body);
      const appliance = await storage.createHomeAppliance(applianceData);
      res.status(201).json(appliance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appliance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appliance" });
    }
  });

  app.patch("/api/appliances/:id", async (req, res) => {
    try {
      const partialData = insertHomeApplianceSchema.partial().parse(req.body);
      const appliance = await storage.updateHomeAppliance(req.params.id, partialData);
      if (!appliance) {
        return res.status(404).json({ message: "Appliance not found" });
      }
      res.json(appliance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appliance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update appliance" });
    }
  });

  app.delete("/api/appliances/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteHomeAppliance(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Appliance not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appliance" });
    }
  });

  // Maintenance Log routes
  app.get("/api/maintenance-logs", async (req, res) => {
    try {
      const homeownerId = req.query.homeownerId as string;
      const logs = await storage.getMaintenanceLogs(homeownerId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance logs" });
    }
  });

  app.get("/api/maintenance-logs/:id", async (req, res) => {
    try {
      const log = await storage.getMaintenanceLog(req.params.id);
      if (!log) {
        return res.status(404).json({ message: "Maintenance log not found" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance log" });
    }
  });

  app.post("/api/maintenance-logs", async (req, res) => {
    try {
      const logData = insertMaintenanceLogSchema.parse(req.body);
      const log = await storage.createMaintenanceLog(logData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance log data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create maintenance log" });
    }
  });

  app.patch("/api/maintenance-logs/:id", async (req, res) => {
    try {
      const partialData = insertMaintenanceLogSchema.partial().parse(req.body);
      const log = await storage.updateMaintenanceLog(req.params.id, partialData);
      if (!log) {
        return res.status(404).json({ message: "Maintenance log not found" });
      }
      res.json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance log data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update maintenance log" });
    }
  });

  app.delete("/api/maintenance-logs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMaintenanceLog(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Maintenance log not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete maintenance log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
