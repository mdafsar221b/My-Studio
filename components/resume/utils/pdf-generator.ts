import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '../../../types';

export const generatePDF = async (data: ResumeData) => {
    // 1. Get all resume pages
    const pages = document.querySelectorAll('.printable-resume-page');

    if (!pages || pages.length === 0) {
        console.error('No resume pages found to print');
        return;
    }

    // 2. Initialize jsPDF
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4' // 210mm x 297mm
    });

    // 3. Process each page
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;

        const clone = page.cloneNode(true) as HTMLElement;
        clone.style.transform = 'none';
        clone.style.boxShadow = 'none';
        clone.style.margin = '0';
        clone.style.position = 'fixed';
        clone.style.top = '-10000px';
        clone.style.left = '0';
        clone.style.width = '794px'; // Enforce A4 px width (approx)
        clone.style.height = '1123px'; // Enforce A4 px height (approx)
        clone.classList.remove('resume-shadow', 'group'); // Remove UI effects

        document.body.appendChild(clone);

        try {

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                windowHeight: 1123
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;


            if (i > 0) {
                doc.addPage();
            }

            // Add image to PDF (0, 0, width, height)
            doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        } catch (err) {
            console.error(`Error generating PDF for page ${i + 1}`, err);
        } finally {
            document.body.removeChild(clone);
        }
    }

    // 4. Save
    doc.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
};
