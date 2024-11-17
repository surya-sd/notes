export interface Note {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  headerImage?: string;
  createdAt: number;
  updatedAt: number;
}

export type SortOption = 'name' | 'date' | 'size';
export type SortDirection = 'asc' | 'desc'; 