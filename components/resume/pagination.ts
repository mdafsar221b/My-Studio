
import { ResumeData, ResumeLayout, DesignConfig, Experience, Education } from '../../types';

export interface PageItem {
    id: string;
    itemRange?: [number, number]; // [start, end] inclusive or slice notation [start, end)
}

export interface PageContent {
    pageIndex: number;
    left: PageItem[];
    right: PageItem[];
}


const PAGE_HEIGHT = 1123;
const PADDING_Y = 96;
const CHAR_WIDTH_AVG = 7;
const LINE_HEIGHT_BASE = 24; // Base line height

const estimateTextHeight = (text: string, widthPx: number, design: DesignConfig): number => {
    if (!text) return 0;
    // Font scaling
    const fontSizeMult = design.fontSize === 'small' ? 0.85 : design.fontSize === 'large' ? 1.15 : 1;
    const charWidth = CHAR_WIDTH_AVG * fontSizeMult;
    const lineHeight = LINE_HEIGHT_BASE * design.lineHeight * fontSizeMult;

    const charsPerLine = Math.floor(widthPx / charWidth);
    const lines = Math.ceil(text.length / charsPerLine) || 1;
    return lines * lineHeight;
};

const getSectionHeight = (id: string, data: ResumeData, widthPx: number, design: DesignConfig, itemRange?: [number, number]): number => {
    let h = 0;
    // Section Header Height (approx)
    h += 40 * (design.fontSize === 'large' ? 1.2 : 1);

    if (id === 'summary') {
        h += estimateTextHeight(data.summary, widthPx, design);
        h += 20; // spacing
    }
    else if (id === 'experience') {
        const list = itemRange ? data.experience.slice(itemRange[0], itemRange[1]) : data.experience;
        list.forEach(exp => {
            h += 30; // Role/Company header
            h += 20; // Date/Loc
            exp.description.forEach(desc => {
                h += estimateTextHeight(desc, widthPx, design);
            });
            h += 30; // Item spacing
        });
    }
    else if (id === 'education') {
        const list = itemRange ? data.education.slice(itemRange[0], itemRange[1]) : data.education;
        list.forEach(edu => {
            h += 60; // Approximate height for an edu entry
            h += 20; // Spacing
        });
    }
    else if (id === 'skills') {
        // Skills are usually compact.
        const list = itemRange ? data.skills.slice(itemRange[0], itemRange[1]) : data.skills;
        // Rough calc
        list.forEach(cat => {
            h += 30; // Name
            // Chips wrap
            const skillsText = cat.skills.join('   ');
            h += estimateTextHeight(skillsText, widthPx, design) + 10;
        });
    }
    else if (id === 'certifications') {
        const list = itemRange ? data.certifications.slice(itemRange[0], itemRange[1]) : data.certifications;
        h += list.length * 40;
    }
    else if (id === 'achievements') {
        // Achievements are strings
        const list = itemRange ? data.achievements.slice(itemRange[0], itemRange[1]) : data.achievements;
        list.forEach(a => {
            h += estimateTextHeight(a, widthPx, design) + 10;
        });
    }

    return h;
};

export const paginateResume = (data: ResumeData): PageContent[] => {
    const design = data.design || {
        margins: 2, sectionSpacing: 3, primaryColor: '', fontFamily: 'Inter', fontSize: 'normal', lineHeight: 1.5, columnLayout: 2
    };

    // 1. Calculate Column Widths
    // A4 Width = 794px. Margins = design.margins * 20 (approx 20px step)
    const marginPx = design.margins * 20;
    const contentWidth = 794 - (marginPx * 2);

    let leftWidth = 0;
    let rightWidth = 0;

    // Layout ratios based on columnLayout (copied from templates)
    if (design.columnLayout === 1) { leftWidth = contentWidth * 0.75; rightWidth = contentWidth * 0.25; }
    else if (design.columnLayout === 2) { leftWidth = contentWidth * 0.65; rightWidth = contentWidth * 0.35; } // Default
    else if (design.columnLayout === 3) { leftWidth = contentWidth * 0.70; rightWidth = contentWidth * 0.30; }
    else { leftWidth = contentWidth * 0.50; rightWidth = contentWidth * 0.50; }

    // Adjust for gaps
    const gap = 48; // p-12 gap-12 is common
    leftWidth -= gap / 2;
    rightWidth -= gap / 2;


    const userPages = data.layout?.pages || [{
        left: data.layout?.left || ['experience', 'education'],
        right: data.layout?.right || ['summary', 'achievements', 'skills', 'certifications']
    }];

    const finalPages: PageContent[] = [];

    // Helper to process a column stack
    const processColumn = (
        sectionIds: string[],
        colWidth: number,
        currentHeight: number,
        targetPageIdx: number,
        colType: 'left' | 'right'
    ) => {
        let y = currentHeight;
        let pIdx = targetPageIdx;

        sectionIds.forEach(id => {
            // Get Total Height of Section
            const totalH = getSectionHeight(id, data, colWidth, design);

            // Check if fits
            if (y + totalH < (PAGE_HEIGHT - marginPx)) {
                // Fits completely
                if (!finalPages[pIdx]) finalPages[pIdx] = { pageIndex: pIdx, left: [], right: [] };

                finalPages[pIdx][colType].push({ id });
                y += totalH;
            } else {
                // Overflow logic: check if split is meaningful or just move to next page

                const availableSpace = (PAGE_HEIGHT - marginPx) - y;

                // If very little space, just move to next
                if (availableSpace < 100) {
                    pIdx++;
                    y = marginPx + 50; // New page start (plus header safety if p1? no, p2 has no big header)
                    if (!finalPages[pIdx]) finalPages[pIdx] = { pageIndex: pIdx, left: [], right: [] };
                    finalPages[pIdx][colType].push({ id });
                    y += totalH;
                    return;
                }

                // Try split
                let handled = false;
                if (id === 'experience' || id === 'education') {
                    const list = data[id];
                    let splitIdx = 0;
                    let accumH = 0;

                    // Find split point
                    for (let i = 0; i < list.length; i++) {
                        const itemH = getSectionHeight(id, data, colWidth, design, [i, i + 1]);
                        if (accumH + itemH > availableSpace) {
                            splitIdx = i;
                            break;
                        }
                        accumH += itemH;
                    }

                    if (splitIdx > 0) {
                        // Add first chunk to current page
                        if (!finalPages[pIdx]) finalPages[pIdx] = { pageIndex: pIdx, left: [], right: [] };
                        finalPages[pIdx][colType].push({ id, itemRange: [0, splitIdx] });

                        // Add second chunk to next page
                        pIdx++;
                        y = marginPx + 50;
                        if (!finalPages[pIdx]) finalPages[pIdx] = { pageIndex: pIdx, left: [], right: [] };
                        finalPages[pIdx][colType].push({ id, itemRange: [splitIdx, list.length] });

                        y += getSectionHeight(id, data, colWidth, design, [splitIdx, list.length]);
                        handled = true;
                    }
                }

                if (!handled) {
                    // Move entire section
                    pIdx++;
                    y = marginPx + 50;
                    if (!finalPages[pIdx]) finalPages[pIdx] = { pageIndex: pIdx, left: [], right: [] };
                    finalPages[pIdx][colType].push({ id });
                    y += totalH;
                }
            }
        });
    };

    // Iterate user pages (Manual Breaks)
    userPages.forEach((up, idx) => {
        // Page 1 has header
        const startH = (finalPages.length === 0) ? (design.fontSize === 'large' ? 350 : 300) : (marginPx + 50);

        // Append new user page content to the end of the final pages list
        let targetIdx = finalPages.length;
        if (targetIdx === 0) {
            finalPages[0] = { pageIndex: 0, left: [], right: [] };
        } else {
            // If we are starting a fresh user page, we force a new final page?
            // Yes, user intention "This is on Page 2".
            targetIdx = finalPages.length;
            finalPages[targetIdx] = { pageIndex: targetIdx, left: [], right: [] };
        }

        // Left Col
        processColumn(up.left, leftWidth, startH, targetIdx, 'left');

        // Process Right Column independently
        processColumn(up.right, rightWidth, startH, targetIdx, 'right');
    });

    return finalPages.filter(p => p.left.length > 0 || p.right.length > 0);
};
