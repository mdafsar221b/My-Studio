
import { ResumeData } from "./types";

export const INITIAL_RESUME_DATA: ResumeData = {
  template: 'executive',
  layout: {
    left: ['experience', 'education'],
    right: ['summary', 'certifications', 'achievements']
  },
  design: {
    margins: 2,
    sectionSpacing: 3,
    primaryColor: '#00C3A5',
    fontFamily: 'Inter',
    fontSize: 'normal',
    lineHeight: 1.5,
    columnLayout: 2
  },
  personalInfo: {
    name: "NAMRATA",
    title: "Senior Consulting Manager | Enterprise Program & Delivery Leadership",
    email: "namrata.isbmax@gmail.com",
    phone: "+91-8951500438",
    location: "Bangalore, Karnataka, India",
    linkedin: "linkedin.com/in/namrata"
  },
  summary: "Senior Consulting Manager and Program Leader with 18+ years of experience delivering complex, multi-million-dollar enterprise technology programs across Healthcare, Finance, Media, and IT within consulting and regulated environments. Extensive experience leading $10M+ global engagements, managing large distributed teams (70+ members), and overseeing delivery across multiple workstreams with high operational and compliance complexity.",
  experience: [
    {
      id: "exp-1",
      company: "Deloitte Consulting India Pvt. Ltd.",
      role: "Consulting Manager",
      location: "Bangalore",
      startDate: "Aug 2013",
      endDate: "Present",
      description: [
        "AI, Automation & Digital Transformation Leadership: Led AI-driven delivery initiatives, including the adoption and refinement of NextGen Estimator, an AI based forecasting and estimation solution, improving delivery predictability and margin planning across multiple engagements.",





      ],
      keyAchievements: [
        "Recipient of the Deloitte TSO Outstanding Award for leadership on a highly complex enterprise delivery.",
        "Led program delivery resulting in multi-year client extensions through consistent value realization.",
        "Representative Clients: Edward Jones, AstraZeneca, Warner Bros. Discovery, International Olympic Committee, Chevron, Travelers, Walmart, CHI, Banner Health"
      ]
    },
    {
      id: "exp-2",
      company: "Accenture Services Pvt. Ltd.",
      role: "Software Engineer / Business Analyst",
      location: "Bangalore",
      startDate: "May 2010",
      endDate: "Aug 2013",
      description: [
        "Worked closely with clients to understand requirements and align solutions with industry best practices.",
        "Delivered application understanding documents, SOPs, and maturity assessments.",
        "Supported implementation of Epic EMR for Revenue Cycle and Ambulatory modules."

      ]
    },
    {
      id: "exp-3",
      company: "Dr. Agarwal’s Eye Hospital",
      role: "Senior Executive – Operations / Product Owner",
      location: "Chennai",
      startDate: "Aug 2009",
      endDate: "Apr 2010",
      description: [
        "Managed daily OPD operations supporting 100+ patients per shift, leading a team of 14 clinical and non-clinical staff.",
        "Acted as Product Owner for Hospital Information System (HIS) implementation for OPD workflows.",
        "Focused on patient experience, cashless hospitalization processes, and workflow optimization."
      ]
    },
    {
      id: "exp-4",
      company: "Parekh Health TPA Pvt. Ltd.",
      role: "Health Benefit Coordinator / Account Management",
      location: "Bangalore",
      startDate: "Jun 2008",
      endDate: "Jul 2009",
      description: [
        "Served as the primary point of contact for enterprise client insurance queries and claims coordination.",
        "Assessed claims to meet strict turnaround times (TAT), working with claims teams, hospitals, brokers, and insurers.",
        "Supported cashless hospitalization processes and conducted new-joiner policy orientation sessions."
      ]
    },

  ],
  education: [
    {
      id: "edu-1",
      institution: "Indian School of Business (ISB)",
      degree: "PGPMAX – Executive MBA",
      field: "Business Administration",
      startDate: "July 2025",
      endDate: "Nov 2026"
    },
    {
      id: "edu-2",
      institution: "Manipal Institute of Management",
      degree: "MBA – Healthcare Management",
      field: "Management",
      startDate: "Sep 2006",
      endDate: "Jun 2008"
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "Core Competencies",
      skills: ["Enterprise Program & Delivery", "AI & Automation", "Healthcare IT", "Agile & Hybrid Delivery"]
    },
    {
      id: "skill-2",
      name: "Tools",
      skills: ["Azure DevOps", "Jira", "ServiceNow", "Postman", "MS Project"]
    }
  ],
  certifications: [
    { id: "cert-1", name: "ServiceNow: Admin, CSM, HRSD" },
    { id: "cert-2", name: "Scaled Agile Framework (SAFe) | Certification" },
    { id: "cert-3", name: "ITIL v4 | Certification" },
    { id: "cert-4", name: "ISTQB Certified | Certification" }
  ],
  achievements: [
    "Delivered program by aligning technology milestones with business outcomes.",
    "Established integrated delivery plans which enabled alignment of technology milestones."
  ],
  sections: []
};
