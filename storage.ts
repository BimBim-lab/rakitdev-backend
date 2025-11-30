import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, desc } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Project,
  InsertProject,
  BlogPost,
  InsertBlogPost,
  PricingPlan,
  InsertPricingPlan,
  Inquiry,
  InsertInquiry,
  CompanyInfo,
  InsertCompanyInfo,
} from "@shared/schema";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  getFeaturedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Blog Posts
  getAllBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // Pricing Plans
  getAllPricingPlans(activeOnly?: boolean): Promise<PricingPlan[]>;
  getPricingPlanById(id: string): Promise<PricingPlan | undefined>;
  createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan>;
  updatePricingPlan(id: string, plan: Partial<InsertPricingPlan>): Promise<PricingPlan | undefined>;
  deletePricingPlan(id: string): Promise<boolean>;
  
  // Inquiries
  getAllInquiries(): Promise<Inquiry[]>;
  getInquiryById(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined>;
  deleteInquiry(id: string): Promise<boolean>;
  
  // Company Info
  getCompanyInfo(): Promise<CompanyInfo | undefined>;
  updateCompanyInfo(info: Partial<InsertCompanyInfo>): Promise<CompanyInfo>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(schema.projects).orderBy(desc(schema.projects.order));
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
    return project;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await db.select().from(schema.projects)
      .where(eq(schema.projects.featured, true))
      .orderBy(desc(schema.projects.order));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(schema.projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(schema.projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(schema.projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(schema.projects).where(eq(schema.projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Blog Posts
  async getAllBlogPosts(published?: boolean): Promise<BlogPost[]> {
    if (published !== undefined) {
      return await db.select().from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, published))
        .orderBy(desc(schema.blogPosts.createdAt));
    }
    return await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(schema.blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(schema.blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(schema.blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Pricing Plans
  async getAllPricingPlans(activeOnly?: boolean): Promise<PricingPlan[]> {
    if (activeOnly) {
      return await db.select().from(schema.pricingPlans)
        .where(eq(schema.pricingPlans.active, true))
        .orderBy(desc(schema.pricingPlans.order));
    }
    return await db.select().from(schema.pricingPlans).orderBy(desc(schema.pricingPlans.order));
  }

  async getPricingPlanById(id: string): Promise<PricingPlan | undefined> {
    const [plan] = await db.select().from(schema.pricingPlans).where(eq(schema.pricingPlans.id, id));
    return plan;
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const [newPlan] = await db.insert(schema.pricingPlans).values(plan).returning();
    return newPlan;
  }

  async updatePricingPlan(id: string, plan: Partial<InsertPricingPlan>): Promise<PricingPlan | undefined> {
    const [updated] = await db.update(schema.pricingPlans)
      .set({ ...plan, updatedAt: new Date() })
      .where(eq(schema.pricingPlans.id, id))
      .returning();
    return updated;
  }

  async deletePricingPlan(id: string): Promise<boolean> {
    const result = await db.delete(schema.pricingPlans).where(eq(schema.pricingPlans.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Inquiries
  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(schema.inquiries).orderBy(desc(schema.inquiries.createdAt));
  }

  async getInquiryById(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(schema.inquiries).where(eq(schema.inquiries.id, id));
    return inquiry;
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(schema.inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined> {
    const [updated] = await db.update(schema.inquiries)
      .set({ status })
      .where(eq(schema.inquiries.id, id))
      .returning();
    return updated;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const result = await db.delete(schema.inquiries).where(eq(schema.inquiries.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Company Info
  async getCompanyInfo(): Promise<CompanyInfo | undefined> {
    const [info] = await db.select().from(schema.companyInfo).limit(1);
    return info;
  }

  async updateCompanyInfo(info: Partial<InsertCompanyInfo>): Promise<CompanyInfo> {
    const existing = await this.getCompanyInfo();
    
    if (existing) {
      const updateData: any = { ...info, updatedAt: new Date() };
      const [updated] = await db.update(schema.companyInfo)
        .set(updateData)
        .where(eq(schema.companyInfo.id, existing.id))
        .returning();
      return updated;
    } else {
      const insertData: any = info;
      const [newInfo] = await db.insert(schema.companyInfo)
        .values(insertData)
        .returning();
      return newInfo;
    }
  }
}

export const storage = new DatabaseStorage();
