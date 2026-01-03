
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  keyAchievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface CustomSection {
  id: string;
  type: 'projects' | 'volunteering' | 'strengths' | 'expertise' | 'mytime' | 'custom';
  title: string;
  items: any[];
}

export type TemplateType = 'double-column' | 'ivy-league' | 'executive' | 'modern';

export interface ResumeLayout {
  left: string[];
  right: string[];
}

export interface DesignConfig {
  margins: number;
  sectionSpacing: number;
  primaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'normal' | 'large';
  lineHeight: number;
  columnLayout: number;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  certifications: Certification[];
  achievements: string[];
  sections: CustomSection[];
  template?: TemplateType;
  layout?: ResumeLayout;
  design?: DesignConfig;
}
