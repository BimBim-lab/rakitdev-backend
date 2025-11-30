import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./shared/schema";
import bcrypt from "bcrypt";

// Load environment variables
config();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not set");
  console.error("Please set DATABASE_URL in your .env file");
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Create admin user
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(schema.users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin user created");

    // 2. Create company info
    console.log("Creating company info...");
    await db.insert(schema.companyInfo).values({
      companyName: "RakitDev",
      tagline: "Building Digital Dreams into Reality",
      description: "RakitDev adalah web development studio yang berfokus pada pembuatan aplikasi web modern, responsif, dan user-friendly. Kami menggunakan teknologi terkini untuk menciptakan solusi digital yang inovatif dan efisien untuk bisnis Anda.",
      email: "hello@rakitdev.com",
      phone: "+62 812-3456-7890",
      address: "Jakarta, Indonesia",
      logoUrl: "/logo.png",
      socialMedia: {
        facebook: "https://facebook.com/rakitdev",
        twitter: "https://twitter.com/rakitdev",
        instagram: "https://instagram.com/rakitdev",
        linkedin: "https://linkedin.com/company/rakitdev",
        github: "https://github.com/rakitdev",
      },
      workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
      foundedYear: 2020,
      teamSize: "10-20",
      projectsCompleted: 50,
      yearsExperience: 5,
    });
    console.log("✅ Company info created");

    // 3. Create pricing plans
    console.log("Creating pricing plans...");
    await db.insert(schema.pricingPlans).values([
      {
        name: "Starter",
        description: "Perfect for small businesses and startups",
        price: 5000000,
        currency: "IDR",
        duration: "one-time",
        features: [
          "Responsive Design",
          "Up to 5 Pages",
          "Contact Form",
          "Basic SEO",
          "1 Month Support",
          "Mobile Friendly",
        ],
        popular: false,
        order: 1,
        active: true,
      },
      {
        name: "Professional",
        description: "Best for growing businesses",
        price: 15000000,
        currency: "IDR",
        duration: "one-time",
        features: [
          "Everything in Starter",
          "Up to 15 Pages",
          "CMS Integration",
          "Advanced SEO",
          "3 Months Support",
          "Analytics Dashboard",
          "Social Media Integration",
          "Blog System",
        ],
        popular: true,
        order: 2,
        active: true,
      },
      {
        name: "Enterprise",
        description: "For large-scale applications",
        price: 30000000,
        currency: "IDR",
        duration: "one-time",
        features: [
          "Everything in Professional",
          "Unlimited Pages",
          "Custom Features",
          "E-commerce Integration",
          "6 Months Support",
          "Performance Optimization",
          "Security Features",
          "API Integration",
          "Admin Dashboard",
          "Priority Support",
        ],
        popular: false,
        order: 3,
        active: true,
      },
    ]);
    console.log("✅ Pricing plans created");

    // 4. Create projects
    console.log("Creating projects...");
    await db.insert(schema.projects).values([
      {
        title: "E-Commerce Platform",
        description: "Modern e-commerce solution with advanced features",
        longDescription: "A full-featured e-commerce platform built with React and Node.js. Includes product management, shopping cart, payment integration, and admin dashboard. Designed for scalability and performance.",
        category: "E-Commerce",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
        liveUrl: "https://demo-ecommerce.rakitdev.com",
        githubUrl: "https://github.com/rakitdev/ecommerce",
        featured: true,
        order: 1,
      },
      {
        title: "Corporate Website",
        description: "Professional corporate website with modern design",
        longDescription: "A sleek and professional corporate website featuring company information, services showcase, team profiles, and contact forms. Optimized for SEO and mobile devices.",
        category: "Corporate",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
        liveUrl: "https://corporate-demo.rakitdev.com",
        featured: true,
        order: 2,
      },
      {
        title: "Restaurant Management System",
        description: "Complete solution for restaurant operations",
        longDescription: "An all-in-one restaurant management system with online ordering, table reservations, menu management, and kitchen display. Includes both customer-facing and admin interfaces.",
        category: "SaaS",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        technologies: ["React", "Express", "MongoDB", "Socket.io"],
        liveUrl: "https://resto-demo.rakitdev.com",
        featured: true,
        order: 3,
      },
      {
        title: "Real Estate Portal",
        description: "Property listing and management platform",
        longDescription: "A comprehensive real estate platform for listing, searching, and managing properties. Features include advanced search filters, virtual tours, agent profiles, and inquiry management.",
        category: "Portal",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
        technologies: ["Vue.js", "Laravel", "MySQL", "Google Maps API"],
        liveUrl: "https://realestate-demo.rakitdev.com",
        featured: false,
        order: 4,
      },
      {
        title: "Learning Management System",
        description: "Online education platform",
        longDescription: "A modern LMS for creating and delivering online courses. Includes video hosting, quizzes, assignments, progress tracking, and certification system.",
        category: "Education",
        imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS S3"],
        liveUrl: "https://lms-demo.rakitdev.com",
        featured: false,
        order: 5,
      },
      {
        title: "Healthcare Appointment System",
        description: "Medical appointment booking platform",
        longDescription: "A patient-doctor appointment system with real-time availability, appointment scheduling, medical records, and telemedicine features. HIPAA compliant architecture.",
        category: "Healthcare",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        technologies: ["React", "Node.js", "PostgreSQL", "WebRTC"],
        liveUrl: "https://healthcare-demo.rakitdev.com",
        featured: false,
        order: 6,
      },
    ]);
    console.log("✅ Projects created");

    // 5. Create blog posts
    console.log("Creating blog posts...");
    await db.insert(schema.blogPosts).values([
      {
        title: "10 Best Practices for Modern Web Development",
        slug: "10-best-practices-modern-web-development",
        excerpt: "Discover the essential best practices that every modern web developer should follow to build scalable and maintainable applications.",
        content: `# 10 Best Practices for Modern Web Development

Web development is constantly evolving, and staying up-to-date with best practices is crucial for building successful applications. Here are 10 essential practices every modern web developer should follow:

## 1. Mobile-First Approach
Always design and develop with mobile devices in mind first, then scale up to larger screens.

## 2. Component-Based Architecture
Break your application into reusable components for better maintainability and scalability.

## 3. Performance Optimization
Optimize images, minimize code, and implement lazy loading to ensure fast load times.

## 4. Security First
Always validate user input, use HTTPS, and implement proper authentication and authorization.

## 5. Accessibility (a11y)
Make your applications accessible to all users, including those with disabilities.

## 6. Version Control
Use Git for version control and follow a branching strategy like Git Flow.

## 7. Automated Testing
Implement unit tests, integration tests, and end-to-end tests for reliable code.

## 8. Documentation
Maintain clear documentation for your code and APIs.

## 9. Continuous Integration/Deployment
Automate your build and deployment processes with CI/CD pipelines.

## 10. Code Reviews
Regular code reviews help maintain code quality and share knowledge among team members.

Following these practices will help you build better, more maintainable web applications.`,
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        author: "RakitDev Team",
        category: "Development",
        tags: ["Web Development", "Best Practices", "Tutorial"],
        published: true,
        readTime: 8,
      },
      {
        title: "Getting Started with React and TypeScript",
        slug: "getting-started-react-typescript",
        excerpt: "Learn how to set up and build your first React application with TypeScript for type-safe development.",
        content: `# Getting Started with React and TypeScript

TypeScript brings type safety to React applications, making them more robust and maintainable. Here's how to get started.

## Why TypeScript?
- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Improved code documentation
- Easier refactoring

## Setting Up
\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Basic Component
\`\`\`typescript
interface Props {
  name: string;
  age: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
};
\`\`\`

Start building type-safe React applications today!`,
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        author: "RakitDev Team",
        category: "Tutorial",
        tags: ["React", "TypeScript", "Tutorial"],
        published: true,
        readTime: 5,
      },
      {
        title: "The Future of Web Development: Trends to Watch in 2025",
        slug: "future-web-development-2025",
        excerpt: "Explore the emerging trends and technologies that are shaping the future of web development.",
        content: `# The Future of Web Development: Trends to Watch in 2025

The web development landscape is constantly evolving. Here are the key trends shaping the future.

## 1. AI-Powered Development
AI tools are becoming integral to the development process, from code generation to testing.

## 2. Edge Computing
Moving computation closer to users for better performance and lower latency.

## 3. WebAssembly
High-performance applications running in the browser with near-native speed.

## 4. Progressive Web Apps
PWAs continue to blur the line between web and native applications.

## 5. Serverless Architecture
Focus on code, not infrastructure, with serverless computing platforms.

## 6. Micro-Frontends
Breaking down monolithic frontends into smaller, manageable pieces.

The future of web development is exciting and full of opportunities!`,
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        author: "RakitDev Team",
        category: "Technology",
        tags: ["Future", "Trends", "Web Development"],
        published: true,
        readTime: 6,
      },
      {
        title: "Building Scalable APIs with Node.js and Express",
        slug: "building-scalable-apis-nodejs-express",
        excerpt: "Learn how to design and build RESTful APIs that can scale with your application's growth.",
        content: `# Building Scalable APIs with Node.js and Express

Building a scalable API requires careful planning and implementation. Here's a comprehensive guide.

## Architecture Principles
- Separation of concerns
- Stateless design
- Proper error handling
- Rate limiting
- Caching strategies

## Best Practices
1. Use middleware effectively
2. Implement proper validation
3. Structure your project well
4. Use environment variables
5. Implement logging and monitoring

## Example Structure
\`\`\`
src/
  routes/
  controllers/
  services/
  models/
  middleware/
  utils/
\`\`\`

Build APIs that can handle growth and scale with your business!`,
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        author: "RakitDev Team",
        category: "Backend",
        tags: ["Node.js", "Express", "API", "Tutorial"],
        published: true,
        readTime: 10,
      },
      {
        title: "CSS Grid vs Flexbox: When to Use Which",
        slug: "css-grid-vs-flexbox",
        excerpt: "A comprehensive comparison of CSS Grid and Flexbox to help you choose the right layout tool.",
        content: `# CSS Grid vs Flexbox: When to Use Which

Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes.

## Flexbox
- One-dimensional layouts (row or column)
- Content-first design
- Perfect for navigation bars, card layouts
- Better for small-scale layouts

## CSS Grid
- Two-dimensional layouts (rows and columns)
- Layout-first design
- Perfect for page layouts, complex grids
- Better for large-scale layouts

## When to Use Flexbox
- Navigation menus
- Card layouts
- Centering content
- Simple component layouts

## When to Use Grid
- Page layouts
- Complex grids
- Magazine-style layouts
- Dashboard layouts

Choose the right tool for the job!`,
        coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
        author: "RakitDev Team",
        category: "CSS",
        tags: ["CSS", "Grid", "Flexbox", "Tutorial"],
        published: true,
        readTime: 7,
      },
    ]);
    console.log("✅ Blog posts created");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
