export interface Tutorial {
  title: string;
  description: string;
  src: string;
  link: string;
  tags?: string[];
  featured: boolean;
}

export const tutorials: Tutorial[] = [
  {
    title: 'The Third Age of JavaScript',
    description: 'Solutions for running containers locally and remotely.',
    src: '/images/popular-post-01.jpg',
    link: '#0',
    tags: ['Open-Source'],
    featured: true
  },
  {
    title: 'Building in Public Strategy',
    description: 'Solutions for running containers locally and remotely.',
    src: '/images/popular-post-02.jpg',
    link: '#0',
    featured: true
  },
]; 