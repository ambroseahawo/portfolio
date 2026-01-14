export interface Project {
  title: string;
  description: string;
  icon: string;
  category: 'data-engineering' | 'full-stack';
  link: string;
  tags?: string[];
  featured: boolean;
}

export const projects: Project[] = [
  // {
  //   title: 'Direkta',
  //   description: 'Platform that helps GSM sales teams manage SIM card assignments, track sales, and get performance insights. It gives partners and dealers a clear view of stock levels, targets, and team productivity.',
  //   icon: '/images/project-icon-03.svg',
  //   category: 'client',
  //   link: 'https://direkta-sim-management-nextjs.vercel.app/',
  //   tags: ['Live'],
  //   featured: true
  // },
  {
    title: 'Property Data Collection System',
    description: 'Built Scrapy-based web scraper for real estate listings with PostgreSQL storage, duplicate detection, and image downloading. Processes 10K+ properties daily with 99%+ success rate.',
    icon: '/images/project-icon-03.svg',
    category: 'data-engineering',
    link: '',
    tags: ['Scrapy', 'PostgreSQL', 'Python'],
    featured: true
  },
  // {
  //   title: 'Nodejs Nextjs Auth',
  //   description: 'Advanced Authentication: 2FA, Email Verification, Cookies, Sessions, and JWT with Node.js and Nextjs',
  //   icon: '/images/nextjs.png',
  //   category: 'tutorial',
  //   link: 'https://github.com/ambroseahawo/nodejs-express-auth',
  //   tags: ['Public'],
  //   featured: true
  // },

]; 