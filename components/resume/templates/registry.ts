
import React from 'react';
import { ResumeData, ResumeLayout, DesignConfig } from '../../../types';
import { PageContent } from '../pagination';

export interface TemplateProps {
    data: ResumeData;
    pageContent: PageContent;
    design: DesignConfig;
    isReadOnly?: boolean;
    isFirstPage: boolean;
    onUpdate: (field: string, value: any) => void;
    // Render function for sections
    renderSection: (id: string, isDarkBg: boolean, itemRange?: [number, number]) => React.ReactNode;
}

export interface TemplateMeta {
    id: string;
    name: string;
    component: React.FC<TemplateProps>;
    isPremium: boolean;
    tags: string[];
    thumbnailClass?: string; // For the simple preview divs we had
    previewImage?: string; // Future proofing
}

import DoubleColumn from './DoubleColumn';
import IvyLeague from './IvyLeague';
import Executive from './Executive';
import Modern from './Modern';

import Minimalist from './Minimalist';
import Tech from './Tech';
import Creative from './Creative';
import Startup from './Startup';

export const TEMPLATES: TemplateMeta[] = [
    {
        id: 'double-column',
        name: 'Double Column',
        component: DoubleColumn,
        isPremium: false,
        tags: ['Classic', 'Professional'],
        thumbnailClass: 'bg-teal-700'
    },
    {
        id: 'executive',
        name: 'Executive',
        component: Executive,
        isPremium: false,
        tags: ['Serious', 'Corporate'],
        thumbnailClass: 'bg-blue-900'
    },
    {
        id: 'creative',
        name: 'Creative',
        component: Creative,
        isPremium: true,
        tags: ['Artistic', 'Bold'],
        thumbnailClass: 'bg-orange-300'
    },
    {
        id: 'startup',
        name: 'Startup',
        component: Startup,
        isPremium: true,
        tags: ['Modern', 'Punchy'],
        thumbnailClass: 'bg-lime-400'
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        component: Minimalist,
        isPremium: true,
        tags: ['Elegant', 'Simple'],
        thumbnailClass: 'bg-slate-200'
    },
    {
        id: 'tech',
        name: 'Tech',
        component: Tech,
        isPremium: true,
        tags: ['Digital', 'Mono'],
        thumbnailClass: 'bg-slate-900'
    },
    {
        id: 'modern',
        name: 'Modern',
        component: Modern,
        isPremium: false,
        tags: ['Clean', 'Bold'],
        thumbnailClass: 'bg-rose-700'
    },
    {
        id: 'ivy-league',
        name: 'Ivy League',
        component: IvyLeague,
        isPremium: false,
        tags: ['Academic', 'Tradition'],
        thumbnailClass: 'bg-slate-800'
    }
];

export const getTemplate = (id: string): TemplateMeta | undefined => {
    return TEMPLATES.find(t => t.id === id);
};
