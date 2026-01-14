export interface Service {
  name: string;
  description?: string;
}

export const services: Service[] = [
  {
    name: "Data Engineering & Web Scraping",
    description: "Build scalable data extraction pipelines, ETL systems, and automated data collection solutions"
  },
  {
    name: "Backend Architecture",
    description: "Design and implement secure, scalable backend systems and APIs"
  },
  {
    name: "API Design & Development",
    description: "Create RESTful and GraphQL APIs with proper versioning, rate limiting, and documentation"
  },
  {
    name: "System Architecture Consulting",
    description: "Review and optimize system designs for performance, scalability, and security"
  },
  {
    name: "Infrastructure & DevOps",
    description: "Set up CI/CD pipelines, containerization, and cloud infrastructure"
  },
  {
    name: "Database Design & Optimization",
    description: "Design schemas, optimize queries, and implement caching strategies"
  }
];
