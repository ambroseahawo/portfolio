export interface Project {
  title: string;
  description: string;
  icon: string;
  category: 'tutorial' | 'client';
  link: string;
  tags?: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    title: 'Container Tinkering',
    description: 'Solutions for running containers locally and remotely.',
    icon: '/images/project-icon-01.svg',
    category: 'tutorial',
    link: '#0',
    tags: ['Open-Source'],
    featured: true
  },
  {
    title: 'Engine Prototypes',
    description: 'Solutions for running containers locally and remotely.',
    icon: '/images/project-icon-02.svg',
    category: 'tutorial',
    link: '#0',
    featured: true
  },
  {
    title: 'PixelOkay',
    description: 'Code assets and services for people, with people.',
    icon: '/images/project-icon-03.svg',
    category: 'client',
    link: '#0',
    tags: ['Open-Source'],
    featured: false
  },
  {
    title: 'Storybook',
    description: 'Storybook helps you develop, test, and document UIs.',
    icon: '/images/project-icon-04.svg',
    category: 'client',
    link: '#0',
    featured: false
  }
]; 