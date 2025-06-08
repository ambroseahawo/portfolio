export interface Tutorial {
  title: string;
  description: string;
  coverImage: string;
  link: string;
  tags?: string[];
  featured: boolean;
  publishedAt: string,
  updatedAt: string,
}

export const tutorials: Tutorial[] = [
  {
    title: 'The Third Age of JavaScript',
    description: 'Solutions for running containers locally and remotely.',
    coverImage: '/images/popular-post-01.jpg',
    link: '#0',
    tags: ['Open-Source'],
    featured: true,
    publishedAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
  {
    title: 'Building in Public Strategy',
    description: 'Solutions for running containers locally and remotely.',
    coverImage: '/images/popular-post-02.jpg',
    link: '#0',
    featured: true,
    publishedAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
]; 