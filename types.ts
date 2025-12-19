
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  tags: string[];
  imageUrl: string;
  date: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
}
