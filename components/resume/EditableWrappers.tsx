import React, { useState } from 'react';
import { SectionToolbar, ItemToolbar } from './Toolbars';

export interface EditableSectionProps {
    id: string;
    children: React.ReactNode;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onAdd?: () => void;
    onDelete?: () => void;
    className?: string;
    isDarkBg?: boolean;
    spacingLevel?: number;
    isReadOnly?: boolean;
    isItemActive?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
    id, children, isSelected, onSelect, onAdd, onDelete, className = "", isDarkBg = false, spacingLevel = 3, isReadOnly = false, isItemActive = false
}) => {
    const marginSize = spacingLevel * 6;
    const showSectionHighlight = isSelected && !isReadOnly && !isItemActive;

    const selectionClasses = isReadOnly
        ? ''
        : showSectionHighlight
            ? 'ring-2 ring-[#00C3A5] p-2 -m-2 ' + (isDarkBg ? 'bg-white/5' : 'bg-[#fcfcfc]')
            : 'hover:ring-1 hover:ring-slate-200/50 p-2 -m-2 cursor-pointer transition-all duration-300';

    return (
        <div
            onClick={(e) => { if (!isReadOnly) { e.stopPropagation(); onSelect(id); } }}
            className={`relative rounded-lg ${className} ${selectionClasses}`}
            style={{ marginBottom: `${marginSize}px` }}
        >
            {showSectionHighlight && <SectionToolbar onAdd={onAdd} onDelete={onDelete} />}
            {children}
        </div>
    );
};

export interface EditableItemProps {
    id: string;
    children: React.ReactNode;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onAdd?: () => void;
    onDelete?: () => void;
    isReadOnly?: boolean;
    isTextSelected?: boolean;
    onAIRequest?: (e: React.MouseEvent) => void;
    onReorder?: (sourceId: string, targetId: string) => void;
}

export const EditableItem: React.FC<EditableItemProps> = ({
    id, children, isSelected, onSelect, onAdd, onDelete, isReadOnly = false, isTextSelected = false, onAIRequest, onReorder
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const showItemToolbar = isSelected && !isReadOnly && !isTextSelected;

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!onReorder) return;
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!onReorder) return;
        e.preventDefault();
        setIsDragOver(false);
        const sourceId = e.dataTransfer.getData('text/plain');
        if (sourceId && sourceId !== id) {
            onReorder(sourceId, id);
        }
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => { if (!isReadOnly) { e.stopPropagation(); onSelect(id); } }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative transition-all duration-300 
                ${!isReadOnly && isSelected ? 'ring-1 ring-[#2ECB8F] rounded-lg p-3 -m-3 bg-[#f0fff9]/40 z-[10]' : !isReadOnly ? 'hover:ring-1 hover:ring-slate-200 rounded-lg p-3 -m-3 cursor-text' : ''}
                ${isDragOver ? 'border-t-2 border-indigo-500 bg-indigo-50/50' : ''}
            `}
        >
            {showItemToolbar && <ItemToolbar onAdd={onAdd} onDelete={onDelete} onDragStart={onReorder ? handleDragStart : undefined} />}
            {onAIRequest && isHovered && !isReadOnly && (
                <button
                    onClick={(e) => { e.stopPropagation(); onAIRequest(e); }}
                    className="absolute -right-1 top-2 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-indigo-500 hover:text-indigo-600 hover:scale-110 transition-all z-[120]"
                    title="AI Assistant"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
            )}
            {children}
        </div>
    );
};
