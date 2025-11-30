import type { Express, Request, Response } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= PROJECTS ROUTES =============
  
  // Get all projects
  app.get("/api/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get featured projects
  app.get("/api/projects/featured", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create project (admin only - add auth middleware later)
  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid project data" });
    }
  });

  // Update project (admin only)
  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validated);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid project data" });
    }
  });

  // Delete project (admin only)
  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // ============= BLOG POSTS ROUTES =============
  
  // Get all blog posts
  app.get("/api/blog", async (req: Request, res: Response) => {
    try {
      const published = req.query.published === "true" ? true : req.query.published === "false" ? false : undefined;
      const posts = await storage.getAllBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get blog post by ID
  app.get("/api/blog/:id", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Get blog post by slug
  app.get("/api/blog/slug/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Create blog post (admin only)
  app.post("/api/blog", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validated);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid blog post data" });
    }
  });

  // Update blog post (admin only)
  app.put("/api/blog/:id", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validated);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid blog post data" });
    }
  });

  // Delete blog post (admin only)
  app.delete("/api/blog/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ============= PRICING PLANS ROUTES =============
  
  // Get all pricing plans
  app.get("/api/pricing", async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === "true";
      const plans = await storage.getAllPricingPlans(activeOnly);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing plans" });
    }
  });

  // Get pricing plan by ID
  app.get("/api/pricing/:id", async (req: Request, res: Response) => {
    try {
      const plan = await storage.getPricingPlanById(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Pricing plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing plan" });
    }
  });

  // Create pricing plan (admin only)
  app.post("/api/pricing", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertPricingPlanSchema.parse(req.body);
      const plan = await storage.createPricingPlan(validated);
      res.status(201).json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid pricing plan data" });
    }
  });

  // Update pricing plan (admin only)
  app.put("/api/pricing/:id", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertPricingPlanSchema.partial().parse(req.body);
      const plan = await storage.updatePricingPlan(req.params.id, validated);
      if (!plan) {
        return res.status(404).json({ error: "Pricing plan not found" });
      }
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid pricing plan data" });
    }
  });

  // Delete pricing plan (admin only)
  app.delete("/api/pricing/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deletePricingPlan(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Pricing plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete pricing plan" });
    }
  });

  // ============= INQUIRIES ROUTES =============
  
  // Get all inquiries (admin only)
  app.get("/api/inquiries", async (_req: Request, res: Response) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Get inquiry by ID (admin only)
  app.get("/api/inquiries/:id", async (req: Request, res: Response) => {
    try {
      const inquiry = await storage.getInquiryById(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiry" });
    }
  });

  // Create inquiry (public)
  app.post("/api/inquiries", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validated);
      res.status(201).json(inquiry);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid inquiry data" });
    }
  });

  // Update inquiry status (admin only)
  app.patch("/api/inquiries/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const inquiry = await storage.updateInquiryStatus(req.params.id, status);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry status" });
    }
  });

  // Delete inquiry (admin only)
  app.delete("/api/inquiries/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteInquiry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  // ============= COMPANY INFO ROUTES =============
  
  // Get company info (public)
  app.get("/api/company", async (_req: Request, res: Response) => {
    try {
      const info = await storage.getCompanyInfo();
      if (!info) {
        return res.status(404).json({ error: "Company info not found" });
      }
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company info" });
    }
  });

  // Update company info (admin only)
  app.put("/api/company", async (req: Request, res: Response) => {
    try {
      const validated = schema.insertCompanyInfoSchema.partial().parse(req.body);
      const info = await storage.updateCompanyInfo(validated);
      res.json(info);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid company info data" });
    }
  });

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
