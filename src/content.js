import projectCrm from './assets/projects/crm.webp'
import projectErpMis from './assets/projects/erp-mis.webp'
import projectOvertime from './assets/projects/factory-overtime.webp'
import projectOneTap from './assets/projects/one-tap.webp'
import projectQueue from './assets/projects/queue-application.webp'
import projectParking from './assets/projects/car-parking.webp'
import projectKiosk from './assets/projects/kiosk-self-ordering.webp'
import projectMap from './assets/projects/employee-tracking-map.webp'
import projectIntercom from './assets/projects/peer-to-peer-intercom.webp'
import projectCrmLight from './assets/projects-light/crm.webp'
import projectErpMisLight from './assets/projects-light/erp-mis.webp'
import projectOvertimeLight from './assets/projects-light/factory-overtime.webp'
import projectOneTapLight from './assets/projects-light/one-tap.webp'
import projectQueueLight from './assets/projects-light/queue-application.webp'
import projectParkingLight from './assets/projects-light/car-parking.webp'
import projectKioskLight from './assets/projects-light/kiosk-self-ordering.webp'
import projectMapLight from './assets/projects-light/employee-tracking-map.webp'
import projectIntercomLight from './assets/projects-light/peer-to-peer-intercom.webp'

export const BASE = import.meta.env.BASE_URL

export const EMAIL = 'shaikhatuf99@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/atuf-shaikh-28aa3835b/'
export const GITHUB = 'https://github.com/atuf-dev'
export const LOCATION = 'Thane, Maharashtra'

// Experience updates itself from this date. It never needs editing.
export const CAREER_START = new Date(2023, 5, 1)

export function yearsOfExperience(today = new Date()) {
  let years = today.getFullYear() - CAREER_START.getFullYear()
  const anniversary = new Date(today.getFullYear(), CAREER_START.getMonth(), CAREER_START.getDate())
  if (today < anniversary) years -= 1
  return Math.max(years, 1)
}

export const experienceLabel = () => `${yearsOfExperience()}+ years`

export const NAV = [
  { label: 'Home', href: BASE },
  { label: 'Work', href: `${BASE}#work` },
  { label: 'About', href: `${BASE}#about` },
  { label: 'Experience', href: `${BASE}#experience` },
  { label: 'Skills', href: `${BASE}#skills` },
  { label: 'Contact', href: `${BASE}contact.html` },
]

export const SKILL_GROUPS = [
  { title: 'Front End', items: ['React.js (Vite)', 'JavaScript (ES6+)', 'jQuery', 'HTML5', 'CSS3', 'Bootstrap', 'Responsive Design'] },
  { title: 'Back End', items: ['Node.js', 'Express.js', 'ASP.NET', 'VB.NET', 'Python', 'Django'] },
  { title: 'APIs & Architecture', items: ['REST APIs', 'SOAP APIs', 'GraphQL', 'MVC Architecture', 'Third-Party Integrations'] },
  { title: 'Databases', items: ['MongoDB', 'MSSQL', 'SQLite'] },
  { title: 'Tools & Practices', items: ['Git', 'Docker', 'Postman', 'Agile/Scrum', 'Code Reviews', 'Performance Optimization'] },
]

export const EXPERIENCE = [
  {
    period: 'June 2023 – Present',
    role: 'Full Stack Web Developer',
    org: `Orbits India, ${LOCATION}`,
    points: [
      'Built and shipped 6+ full-stack product modules, including a CRM, kiosk self-ordering system, employee tracking map and dynamic dashboards, using React.js, Node.js, Express.js and MongoDB on MVC architecture.',
      'Developed responsive, cross-device UIs with React.js, Bootstrap and jQuery across desktop, dashboard and kiosk touch-screen experiences.',
      'Designed and implemented RESTful, SOAP and GraphQL APIs and integrated third-party services.',
      'Built scalable back-end services in Node.js/Express and VB.NET with MongoDB and MSSQL.',
      'Improved application load times by 20% through code refactoring, query optimization and regular performance testing.',
      'Collaborated with cross-functional teams on requirements, code reviews and on-time sprint deliveries in an Agile environment.',
    ],
  },
  {
    period: 'June 2022 – September 2022',
    role: 'Software Development Intern',
    points: [
      'Developed and tested web application features with Python/Django, JavaScript and jQuery, contributing bug fixes and new functionality.',
      'Built a management system desktop application using Tkinter and SQLite3, including data extraction, analysis and visualization.',
    ],
  },
]

export const EDUCATION = [
  {
    period: '2021 – 2024',
    role: 'B.E. in Computer Engineering',
    org: 'G.V. Acharya Institute of Engineering & Technology, Mumbai University',
    score: 'CGPA 7.77',
  },
  {
    period: '2018 – 2021',
    role: 'Diploma in Computer Engineering',
    org: 'Bharati Vidyapeeth College of Engineering, MSBTE',
    score: '83.89%',
  },
]

export const CATEGORIES = ['All', 'Business Systems', 'Operations', 'Customer Facing', 'Communication']

const RESUME_STACK_SQL = ['React.js (Vite)', 'Node.js', 'Express.js', 'MSSQL', 'REST API']
const RESUME_STACK_MONGO = ['React.js (Vite)', 'Node.js', 'Express.js', 'MongoDB', 'REST API']

// Project copy must never name an employer, client or internal product.
export const PROJECTS = [
  {
    slug: 'crm',
    name: 'Customer Relationship Management',
    short: 'CRM',
    category: 'Business Systems',
    image: { dark: projectCrm, light: projectCrmLight },
    tagline: 'Customer interactions, sales pipelines and customer data in one place.',
    overview:
      'A full-stack CRM for tracking customer interactions, managing sales pipelines and analyzing customer data, built on MVC architecture.',
    features: ['Customer interaction tracking', 'Sales pipeline management', 'Customer data analysis'],
    stack: RESUME_STACK_SQL,
  },
  {
    slug: 'erp-mis',
    name: 'ERP / MIS',
    short: 'ERP / MIS',
    category: 'Business Systems',
    image: { dark: projectErpMis, light: projectErpMisLight },
    tagline: 'A business system that combines day-to-day operations with management reporting.',
    overview:
      'A web-based ERP and MIS platform that brings operational modules and management reports together, with dashboards for reviewing business data.',
    features: ['Operational modules', 'Management reporting', 'Dynamic dashboards'],
    stack: ['React.js', 'Node.js', 'VB.NET APIs', 'SQL Server'],
  },
  {
    slug: 'factory-overtime',
    image: { dark: projectOvertime, light: projectOvertimeLight },
    name: 'Factory Overtime',
    short: 'Factory Overtime',
    category: 'Operations',
    tagline: 'Recording and tracking overtime for factory staff.',
    overview: 'An application for recording, tracking and reviewing overtime worked by factory staff.',
    features: ['Overtime recording', 'Overtime tracking and review'],
  },
  {
    slug: 'one-tap',
    image: { dark: projectOneTap, light: projectOneTapLight },
    name: 'One-Tap',
    short: 'One-Tap',
    category: 'Customer Facing',
    tagline: 'A fast application built around completing a task in a single tap.',
    overview: 'An application designed so that users can complete a key task with a single tap.',
    features: ['Single-tap interaction', 'Touch-friendly interface'],
  },
  {
    slug: 'queue-application',
    image: { dark: projectQueue, light: projectQueueLight },
    name: 'Queue Application',
    short: 'Queue',
    category: 'Customer Facing',
    tagline: 'Keeping queues organized for both customers and staff.',
    overview: 'An application for managing and organizing queues so that people are served in order.',
    features: ['Queue management', 'Service order tracking'],
  },
  {
    slug: 'car-parking',
    image: { dark: projectParking, light: projectParkingLight },
    name: 'Car Parking',
    short: 'Car Parking',
    category: 'Operations',
    tagline: 'Managing vehicles and parking from a single application.',
    overview: 'An application for managing car parking and the vehicles using it.',
    features: ['Parking management', 'Vehicle tracking'],
  },
  {
    slug: 'kiosk-self-ordering',
    image: { dark: projectKiosk, light: projectKioskLight },
    name: 'Kiosk Self-Ordering System',
    short: 'Kiosk Ordering',
    category: 'Customer Facing',
    tagline: 'Customers place their own orders directly at the kiosk.',
    overview:
      'A self-service ordering platform for retail and food-service counters that lets customers place orders directly at the kiosk, reducing wait times.',
    features: ['Self-service ordering', 'Kiosk touch-screen interface', 'Reduced wait times at the counter'],
    stack: RESUME_STACK_MONGO,
  },
  {
    slug: 'employee-tracking-map',
    image: { dark: projectMap, light: projectMapLight },
    name: 'Employee Tracking Map',
    short: 'Tracking Map',
    category: 'Operations',
    tagline: 'Real-time and last-known employee locations on an interactive map.',
    overview:
      'An interactive map module showing real-time and last-known employee locations, giving operations teams visibility for resource management and task allocation.',
    features: ['Real-time locations', 'Last-known locations', 'Resource and task allocation visibility'],
    stack: RESUME_STACK_SQL,
  },
  {
    slug: 'peer-to-peer-intercom',
    image: { dark: projectIntercom, light: projectIntercomLight },
    name: 'Peer-to-Peer Intercom',
    short: 'P2P Intercom',
    category: 'Communication',
    tagline: 'Direct voice communication over a local network.',
    overview:
      'A peer-to-peer communication system that enables users to talk to each other directly over a local network (LAN).',
    features: ['Direct peer-to-peer communication', 'Works over a local network (LAN)'],
    stack: ['React.js (Vite)', 'Node.js', 'Express.js', 'MongoDB'],
  },
]
