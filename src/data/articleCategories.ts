export interface ArticleCategory {
  id: string;
  label: string;
  description: string;
  color?: string;
}

export const articleCategories: ArticleCategory[] = [
  {
    id: 'data-engineering',
    label: 'Data Engineering',
    description: 'Web scraping, ETL pipelines, data processing, and data extraction'
  },
  {
    id: 'backend-architecture',
    label: 'Backend Architecture',
    description: 'System design, scalable architectures, and backend patterns'
  },
  {
    id: 'system-design',
    label: 'System Design',
    description: 'Architecture patterns, scalability, and technical decision-making'
  }
];

export function getCategoryById(id: string): ArticleCategory | undefined {
  return articleCategories.find(cat => cat.id === id);
}

export function getCategoryLabel(id: string): string {
  const category = getCategoryById(id);
  return category?.label || id;
}
