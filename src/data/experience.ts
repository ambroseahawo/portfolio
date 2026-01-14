interface Education {
  period: string;
  degree: string;
  institution: string;
  description: string;
  icon: string;
}

interface WorkExperience {
  period: string;
  title: string;
  company: string;
  description: string;
  icon: string;
}

interface ExperienceData {
  education: Education[];
  workExperience: WorkExperience[];
}

export const experience: ExperienceData = {
  education: [
    {
      period: "Aug 2016 - Nov 2021",
      degree: "Bachelor of Science in Informatics",
      institution: "Moi University, KENYA",
      description: "IT Professional with a strong foundation in Systems Engineering and Management, specializing in Data Structures, Programming, Databases, and Artificial Intelligence.",
      icon: "/images/mu-logo.png"
    }
  ],
  workExperience: [
    {
      period: "Mar 2025 - Present",
      title: "Full Stack Developer",
      company: "MediaPal",
      description: "Design and deliver high-performance web apps using JavaScript, PHP, Golang, with RESTful APIs, SQL (MySQL/PostgreSQL), and Redis. Build and deploy services in Docker/Kubernetes on Linux, ensuring clean, well-documented code, full-stack troubleshooting, and end-to-end SDLC participation.Contribute to code reviews, CI/CD, and collaborate via Git.",
      icon: "/images/mpal-dark.svg"
    },
    {
      period: "Jan 2024 - Mar 2025",
      title: "Web Scraping | Data Engineering",
      company: "Upwork",
      description: "Web Scraping and Data Extraction: Perform web scraping and data extraction using Scrapy, BeautifulSoup, Selenium, and pandas, and analyze data for actionable insights. Database and Cache Management: Manage relational databases like PostgreSQL and MySQL, and integrate with Redis Cache. Full-Stack Development: Develop highly-scalable backend systems using Python frameworks like Django and Flask, as well as JavaScript frameworks such as NodeJS with MongoDB or Prisma with PostgreSQL; integrating frontends in NextJS, React, TypeScript, Tailwind. Payment Gateway Integration: Integrate payment gateway APIs, ensuring secure and efficient transactions. Version Control and Collaboration: Utilize Git for version control, managing branching and merging processes effectively.",
      icon: "/images/upwork-logo.png"
    },
    {
      period: "Nov 2023 - Feb 2024",
      title: "Fixed Dispatch Engineer",
      company: "Safaricom",
      description: "Maintain and optimize fixed dispatch systems for performance, reliability, and security compliance. Provide technical support, diagnose issues, and ensure proper system configuration for end-user needs. Deploy hardware/software systems, collaborating with IT, operations, and vendors for seamless integration. Document configurations, procedures, and incident reports; track system performance and maintenance. Lead system projects and upgrades, manage emergency protocols, and implement disaster recovery plans.",
      icon: "/images/safaricom-logo.webp"
    },
    {
      period: "Apr 2022 - Nov 2023",
      title: "System Architect",
      company: "Pesaflow",
      description: "Designed robust system architectures aligned with project goals and standards. Led integration efforts and provided technical direction across teams. Implemented security best practices, ensured regulatory compliance, and prepared for system contingencies. Documented architectures, evaluated technologies, and mitigated technical risks. Continuously optimized system performance and scalability for high-demand environments.",
      icon: "/images/pesaflow-logo.jpg"
    },
    {
      period: "Mar 2022 - Apr 2022",
      title: "Junior Software Developer",
      company: "Netbot Solutions",
      description: "Built and maintained full-stack web apps using Django REST Framework and ReactJS with responsive UIs. Collaborated in agile teams with developers, designers, and product managers to deliver user-centric features. Authored technical documentation and stayed current with best practices in Django and React to ensure code quality and maintainability.",
      icon: "/images/netbot-logo.png"
    }
  ]
}; 