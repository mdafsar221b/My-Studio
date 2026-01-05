
import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startTour = (force = false) => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (hasSeenTour && !force) return;

    const driverObj = driver({
        showProgress: true,
        allowClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        popoverClass: 'driverjs-theme',
        steps: [
            {
                element: '#sidebar-templates',
                popover: {
                    title: 'Choose a Template',
                    description: 'Start by selecting a professional template that fits your style. You can switch anytime!',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '#sidebar-add',
                popover: {
                    title: 'Add Sections',
                    description: 'Need more content? Add custom sections like Projects, Languages, or Hobbies here.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '#sidebar-design',
                popover: {
                    title: 'Customize Design',
                    description: 'Tweak fonts, colors, margins, and spacing to make it truly yours.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '#sidebar-improve',
                popover: {
                    title: 'AI Improvements',
                    description: 'Use our AI to polish your grammar and enhance your professional tone.',
                    side: 'right',
                    align: 'start'
                }
            },
            {
                element: '#preview-button',
                popover: {
                    title: 'Preview',
                    description: 'See exactly how your resume will look before downloading.',
                    side: 'left',
                    align: 'start'
                }
            },
            {
                element: '#download-button',
                popover: {
                    title: 'Download PDF',
                    description: 'Export your masterpiece in high-quality PDF format, ready for applications.',
                    side: 'left',
                    align: 'start'
                }
            },
            {
                element: '#sidebar-share',
                popover: {
                    title: 'Share Online',
                    description: 'Create a unique link to share your resume directly with recruiters or on social media.',
                    side: 'right',
                    align: 'start'
                }
            }
        ],
        onDestroyed: () => {
            localStorage.setItem('hasSeenTour', 'true');
        }
    });

    driverObj.drive();

    // Cleanup style injection if any (driver.js usually handles its own CSS, but we'll add custom overrides)
    const styleId = 'driver-theme-overrides';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
    .driver_popover_arrow {
    border - color: #1a1a1a transparent transparent transparent!important;
}
            .driver - popover {
    background - color: #1a1a1a!important;
    color: #ffffff!important;
    border: 1px solid #333333!important;
    border - radius: 12px!important;
    padding: 16px!important;
    box - shadow: 0 10px 30px rgba(0, 0, 0, 0.5)!important;
    font - family: 'Inter', sans - serif!important;
}
            
            .driver - popover - title {
    font - size: 16px!important;
    font - weight: 700!important;
    margin - bottom: 8px!important;
    color: #fff!important;
}
            
            .driver - popover - description {
    font - size: 14px!important;
    line - height: 1.5!important;
    color: #a3a3a3!important;
    margin - bottom: 16px!important;
}
            
            .driver - popover - footer button {
    background - color: #333!important;
    color: #fff!important;
    border: 1px solid #444!important;
    border - radius: 6px!important;
    padding: 6px 12px!important;
    font - size: 12px!important;
    text - shadow: none!important;
    transition: all 0.2s!important;
}
            
            .driver - popover - footer button:hover {
    background - color: #444!important;
    border - color: #555!important;
}
            
            .driver - popover - footer.driver - popover - next - btn {
    background - color: #ffffff!important;
    color: #000000!important;
    border: none!important;
    font - weight: 600!important;
}
             .driver - popover - footer.driver - popover - next - btn:hover {
    background - color: #e0e0e0!important;
}

            /* Arrow positioning adjustments if needed */
            .driver - popover[data - side="right"] .driver - popover - arrow {
    border - right - color: #1a1a1a!important;
    border - left - color: transparent!important;
    border - top - color: transparent!important;
    border - bottom - color: transparent!important;
}
             .driver - popover[data - side="left"] .driver - popover - arrow {
    border - left - color: #1a1a1a!important;
    border - right - color: transparent!important;
    border - top - color: transparent!important;
    border - bottom - color: transparent!important;
}
             .driver - popover[data - side="top"] .driver - popover - arrow {
    border - top - color: #1a1a1a!important;
    border - right - color: transparent!important;
    border - left - color: transparent!important;
    border - bottom - color: transparent!important;
}
             .driver - popover[data - side="bottom"] .driver - popover - arrow {
    border - bottom - color: #1a1a1a!important;
    border - right - color: transparent!important;
    border - left - color: transparent!important;
    border - top - color: transparent!important;
}

`;
        document.head.appendChild(style);
    }
};

const TourGuide: React.FC = () => {
    useEffect(() => {
        startTour();
    }, []);

    return null;
};

export default TourGuide;

