interface Education {
  period: string;
  degree: string;
  institution: string;
  description: string;
  icon: string;
}

interface Experience {
  period: string;
  title: string;
  company: string;
  description: string;
  icon: string;
}

interface Resume {
  education: Education[];
  experience: Experience[];
}

export const resume: Resume = {
  education: [
    {
      period: "Aug 2016 - Nov 2021",
      degree: "Bachelor of Science in Informatics",
      institution: "Moi University, KENYA",
      description: "IT Professional with a strong foundation in Systems Engineering and Management, specializing in Data Structures, Programming, Databases, and Artificial Intelligence.",
      icon: "/images/mu-logo.png"
    }
  ],
  experience: [
    {
      period: "Jan 2024 - Present",
      title: "Python | Scrapy | Django | NodeJS | ReactJS | NextJS | PostgreSQL | AWS",
      company: "Upwork",
      description: "Build scalable backend systems with Django, Flask, and Node.js (MongoDB/Prisma/PostgreSQL). Integrate frontend apps using React, Next.js, TypeScript, and Tailwind. Skilled in web scraping (Scrapy, BeautifulSoup, Selenium), data analysis (pandas), and managing PostgreSQL, MySQL, and Redis. Experience integrating secure payment gateways and using Git for collaborative development.",
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