/**
 * TaxScope — Free Smart Tax Estimator
 * ─────────────────────────────────────────────────────────────────
 * Paste this into your HTML <head> for SEO:
 *
 * <title>TaxScope — Free 2025 Tax Estimator | See What You Owe or Get Back</title>
 * <meta name="description" content="Free anonymous 2025 tax estimator. Find out in 4 minutes if you're getting a refund or owe taxes — no signup, no sensitive data needed. Covers W-2, freelance, business owners, retirees, and more.">
 * <meta name="keywords" content="free tax estimator 2025, tax refund calculator, income tax estimator, how much will I owe in taxes, freelancer tax estimator, self employed tax calculator, 1040 estimator, tax refund estimator, small business tax estimator, gig worker taxes, W-2 tax estimator, tax balance due calculator">
 * <meta property="og:title" content="TaxScope — Free 2025 Tax Estimator">
 * <meta property="og:description" content="Instantly estimate your 2025 taxes — refund or balance due. Anonymous, free, takes 4 minutes. No signup.">
 * <meta property="og:type" content="website">
 * <link rel="canonical" href="https://taxscope.app">
 *
 * Schema.org structured data (paste in <body>):
 * <script type="application/ld+json">
 * {"@context":"https://schema.org","@type":"WebApplication","name":"TaxScope","description":"Free 2025 income tax estimator","url":"https://taxscope.app","applicationCategory":"FinanceApplication","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}
 * </script>
 */

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Briefcase, Users, DollarSign, PiggyBank, Calculator, Gift,
  ChevronDown, Check, Edit2, AlertCircle, Home, Laptop, Car,
  Building2, Utensils, Camera, Dumbbell, Palette, ShoppingBag,
  Truck, Wrench, Heart, BookOpen, Mic2, TrendingUp, Info,
  MapPin, Star, ArrowRight, RefreshCw, Target, Scissors,
  Zap, Globe, Shield, Leaf, Coffee, Music, Tv, Package,
  HardHat, Stethoscope, Scale, FlaskConical, GraduationCap,
  Megaphone, Plane, Bus, Ship, Hammer, Sprout, Dog, Baby, Glasses
} from "lucide-react";

// ─── ANALYTICS HELPER ────────────────────────────────────────────
const track = (event, params={}) => {
  try { if(typeof window!=='undefined'&&window.gtag) window.gtag('event', event, params); }
  catch(e){}
};

// ─── STYLES ───────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
:root{
  --bg:#F5F2EC;--white:#FFFFFF;--ink:#17140E;--ink2:#3D3228;--ink3:#5C5047;
  --coral:#E04E1A;--coral-lt:#FDF0EA;--coral-md:#F6C9B0;
  --teal:#0B7A6D;--teal-lt:#D3F0EB;
  --gold:#8A6200;--gold-lt:#FEF5D4;
  --green:#0F6830;--green-lt:#DCFCE7;
  --red:#B01818;--red-lt:#FEE2E2;
  --border:#C9C0B5;--border2:#A8998C;
  --track:#9C9088;
  --sh-xs:0 1px 3px rgba(23,20,14,.08);
  --sh:0 3px 14px rgba(23,20,14,.10),0 1px 4px rgba(23,20,14,.05);
  --sh-up:0 -4px 28px rgba(23,20,14,.15);
  --r:10px;--r-lg:16px;--r-xl:22px;
  --f:'Plus Jakarta Sans',system-ui,sans-serif;
  --fs:'Instrument Serif',Georgia,serif;
}
body{font-family:var(--f);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;line-height:1.5;overflow-x:hidden;min-height:100vh}
input,button,select,textarea{font-family:inherit}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* HIGH-CONTRAST SLIDER TRACK */
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer;border:none;background:var(--track);}
input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:3px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:var(--coral);cursor:pointer;box-shadow:0 2px 8px rgba(224,78,26,.45);transition:transform .14s,box-shadow .14s;margin-top:-8px;}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.22);box-shadow:0 3px 14px rgba(224,78,26,.6);}
input[type=range]::-moz-range-track{height:6px;border-radius:3px;background:var(--track);}
input[type=range]::-moz-range-progress{height:6px;border-radius:3px;background:var(--coral);}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--coral);cursor:pointer;border:none;box-shadow:0 2px 8px rgba(224,78,26,.45);}

select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236A5F52' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 11px center;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes barIn{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
@keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes drawerDown{from{transform:translateY(0)}to{transform:translateY(100%)}}
.fu{animation:fadeUp .38s cubic-bezier(.22,.68,0,1.1) both}
.fi{animation:fadeIn .25s ease both}
.d1{animation-delay:.05s}.d2{animation-delay:.11s}.d3{animation-delay:.17s}.d4{animation-delay:.24s}
input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type=number]{-moz-appearance:textfield}
`;

// ─── 60+ JOB CATEGORIES ───────────────────────────────────────────
const BIZ_TYPES = [
  // CREATIVE & MEDIA
  {id:'photographer',label:'Photographer / Videographer',icon:Camera,cat:'Creative & Media',
   keywords:['photo','videograph','cinemat','film maker','videograph'],
   expenses:[{k:'gear',l:'Camera, lenses, drones & gear',max:20000,tip:'Equipment for your work is 100% deductible.'},{k:'editing',l:'Editing software (Adobe, DaVinci...)',max:3000},{k:'storage',l:'Hard drives & cloud storage',max:1000},{k:'studio',l:'Studio rental',max:8000},{k:'travel',l:'Travel to shoots',max:6000},{k:'mktg',l:'Website & marketing',max:2500}]},
  {id:'graphic_designer',label:'Graphic / UX Designer',icon:Palette,cat:'Creative & Media',
   keywords:['graphic design','ux','ui design','branding','motion design','product design'],
   expenses:[{k:'sw',l:'Design software (Figma, Adobe...)',max:3000},{k:'hw',l:'Computer, tablet & peripherals',max:8000},{k:'home',l:'Home office',max:8000,tip:'$5/sq ft simplified method, must be dedicated workspace.'},{k:'portfolio',l:'Portfolio site & domain',max:1500},{k:'courses',l:'Courses & skill development',max:3000},{k:'fonts',l:'Stock assets, fonts & templates',max:1000}]},
  {id:'content_creator',label:'Content Creator / YouTuber / Streamer',icon:Tv,cat:'Creative & Media',
   keywords:['youtu','content creator','influenc','streamer','twitc','tiktok','instagram','reels'],
   expenses:[{k:'gear2',l:'Camera, mic, lighting & gear',max:15000},{k:'sw2',l:'Editing software & subscriptions',max:3000},{k:'internet',l:'Phone & internet (work %)',max:2400,tip:'Track the % of time used for content creation.'},{k:'props',l:'Props, outfits & set design',max:3000},{k:'travel2',l:'Travel for content & events',max:8000},{k:'ads',l:'Ad spend to grow channel',max:5000}]},
  {id:'musician',label:'Musician / Performer / DJ',icon:Music,cat:'Creative & Media',
   keywords:['music','musician','singer','dj','producer','band','rapper','songwriter','percuss'],
   expenses:[{k:'instruments',l:'Instruments & gear',max:15000},{k:'studio_time',l:'Recording studio time',max:8000},{k:'distribution',l:'Music distribution & licensing',max:2000},{k:'vehicle',l:'Vehicle for gigs & tours',max:12000},{k:'merch',l:'Merchandise & promo materials',max:5000},{k:'lessons',l:'Music lessons & coaching',max:3000}]},
  {id:'writer',label:'Writer / Author / Blogger / Journalist',icon:BookOpen,cat:'Creative & Media',
   keywords:['writer','author','blog','journalist','copywrite','content writ','editor','novelist'],
   expenses:[{k:'home2',l:'Home office',max:8000},{k:'sw3',l:'Writing software & subscriptions',max:1500},{k:'research',l:'Research, books & interviews',max:3000},{k:'website',l:'Website, hosting & domain',max:1500},{k:'travel3',l:'Travel for research & events',max:5000},{k:'courses2',l:'Writing courses & workshops',max:2500}]},
  {id:'podcaster',label:'Podcaster / Voice Actor',icon:Mic2,cat:'Creative & Media',
   keywords:['podcast','voice actor','narrat','audio'],
   expenses:[{k:'mic',l:'Microphone, audio interface & gear',max:5000},{k:'sw4',l:'Recording & editing software',max:1500},{k:'hosting',l:'Podcast hosting platform',max:600},{k:'soundproof',l:'Soundproofing & studio setup',max:3000},{k:'mktg2',l:'Marketing & promotion',max:2000}]},

  // TECH & DIGITAL
  {id:'software_dev',label:'Software Developer / Engineer',icon:Laptop,cat:'Tech & Digital',
   keywords:['software','developer','engineer','programmer','coding','web dev','frontend','backend','fullstack','devops','sre','data engineer'],
   expenses:[{k:'home3',l:'Home office (if remote)',max:8000,tip:'Must be used exclusively and regularly for work.'},{k:'hw',l:'Computer, monitors & peripherals',max:10000},{k:'sw5',l:'Software, IDE & cloud services',max:4000},{k:'internet2',l:'High-speed internet (work %)',max:1800},{k:'conf',l:'Conferences & tech events',max:5000},{k:'learn',l:'Courses, books & certifications',max:3500}]},
  {id:'data_scientist',label:'Data Scientist / ML Engineer / AI',icon:Zap,cat:'Tech & Digital',
   keywords:['data scientist','machine learn','ai ','artificial intel','data analyst','mlops','analytics'],
   expenses:[{k:'cloud',l:'Cloud computing & GPU costs',max:8000},{k:'sw6',l:'Software tools & subscriptions',max:3000},{k:'hw2',l:'Hardware & workstation',max:10000},{k:'learn2',l:'Courses, conferences & journals',max:4000},{k:'home4',l:'Home office',max:8000}]},
  {id:'it_consultant',label:'IT Consultant / Systems Administrator',icon:Shield,cat:'Tech & Digital',
   keywords:['it consult','sysadmin','network','cybersecur','helpdesk','tech support','cloud architect'],
   expenses:[{k:'cert',l:'Certifications (AWS, Cisco...)',max:5000,tip:'Professional certifications are deductible.'},{k:'tools',l:'Diagnostic tools & software',max:3000},{k:'vehicle2',l:'Vehicle for client visits',max:12000},{k:'home5',l:'Home office',max:8000},{k:'insurance',l:'E&O / professional liability insurance',max:3000}]},
  {id:'digital_marketer',label:'Digital Marketer / SEO / Social Media Manager',icon:Megaphone,cat:'Tech & Digital',
   keywords:['digital market','seo','social media manager','paid ads','ppc','sem','email market','growth hacker','marketing consult'],
   expenses:[{k:'sw7',l:'Marketing tools (HubSpot, Ahrefs...)',max:5000},{k:'ads2',l:'Ad spend for client campaigns (your portion)',max:10000},{k:'courses3',l:'Courses, certifications & conferences',max:3000},{k:'home6',l:'Home office',max:8000},{k:'phone',l:'Phone & internet (work %)',max:2000}]},

  // HEALTHCARE & WELLNESS
  {id:'doctor',label:'Doctor / Physician / Surgeon',icon:Stethoscope,cat:'Healthcare & Wellness',
   keywords:['doctor','physician','surgeon','md ','hospitalist','specialist'],
   expenses:[{k:'malpractice',l:'Malpractice insurance',max:15000},{k:'cme',l:'CME credits & conferences',max:8000},{k:'medical_eq',l:'Medical equipment & devices',max:10000},{k:'scrubs',l:'Uniforms & scrubs',max:1000},{k:'licensing3',l:'Licensing & board fees',max:3000},{k:'journal',l:'Medical journals & references',max:1500}]},
  {id:'nurse',label:'Nurse / NP / PA / CNA',icon:Heart,cat:'Healthcare & Wellness',
   keywords:['nurse','nursing','np ','nurse practitioner','pa ','physician assist','cna','rn ','registered nurse','lpn'],
   expenses:[{k:'ceu',l:'CEU credits & certifications',max:3000},{k:'malpractice2',l:'Malpractice insurance',max:3000},{k:'uniform',l:'Uniforms & scrubs',max:1000},{k:'equip2',l:'Stethoscope & personal equipment',max:1500},{k:'transport',l:'Transportation to multiple facilities',max:5000}]},
  {id:'therapist',label:'Therapist / Counselor / Social Worker',icon:Heart,cat:'Healthcare & Wellness',
   keywords:['therapist','counselor','social worker','psychologist','psychiatr','lcsw','lmft','mental health'],
   expenses:[{k:'license4',l:'Licensing & supervision fees',max:3000},{k:'liability',l:'Professional liability insurance',max:2000},{k:'office',l:'Office rental / telehealth setup',max:12000},{k:'ceu2',l:'CEUs & continuing education',max:3000},{k:'ehr',l:'EHR & practice management software',max:2500}]},
  {id:'dentist',label:'Dentist / Dental Hygienist / Orthodontist',icon:Stethoscope,cat:'Healthcare & Wellness',
   keywords:['dentist','dental','orthodont','hygienist'],
   expenses:[{k:'equipment3',l:'Dental equipment & supplies',max:20000},{k:'lab',l:'Dental lab fees',max:10000},{k:'malpractice3',l:'Malpractice insurance',max:8000},{k:'cde',l:'CDE credits & education',max:5000},{k:'software2',l:'Practice management software',max:3000}]},
  {id:'fitness',label:'Personal Trainer / Fitness Coach',icon:Dumbbell,cat:'Healthcare & Wellness',
   keywords:['trainer','personal train','fitness','gym','crossfit','strength coach'],
   expenses:[{k:'certs2',l:'Certifications & continuing ed',max:3000},{k:'equip4',l:'Equipment & supplies',max:5000},{k:'space',l:'Gym or studio rental',max:12000},{k:'software3',l:'Scheduling & booking apps',max:1200},{k:'mktg3',l:'Marketing & social media',max:3000}]},
  {id:'yoga',label:'Yoga / Pilates / Dance Instructor',icon:Dumbbell,cat:'Healthcare & Wellness',
   keywords:['yoga','pilates','dance instructor','barre','zumba'],
   expenses:[{k:'training',l:'Teacher training & workshops',max:5000},{k:'space2',l:'Studio rental & venue fees',max:10000},{k:'props2',l:'Props, mats & equipment',max:2000},{k:'music2',l:'Music licensing',max:600},{k:'sw8',l:'Scheduling software & website',max:1500}]},
  {id:'pharmacist',label:'Pharmacist / Pharmacy Technician',icon:FlaskConical,cat:'Healthcare & Wellness',
   keywords:['pharmacist','pharmacy','pharma tech'],
   expenses:[{k:'license5',l:'Licensing & renewal fees',max:1500},{k:'cpe',l:'CPE credits',max:2000},{k:'professional',l:'Professional association dues',max:800},{k:'tools2',l:'Reference tools & software',max:1000}]},
  {id:'vet',label:'Veterinarian / Vet Tech',icon:Dog,cat:'Healthcare & Wellness',
   keywords:['veterinar','vet ','animal doctor'],
   expenses:[{k:'equip5',l:'Medical equipment & supplies',max:15000},{k:'malpractice4',l:'Professional liability insurance',max:5000},{k:'cve',l:'Continuing education & conferences',max:4000},{k:'license6',l:'Licensing & DEA registration',max:2000}]},
  {id:'alternative',label:'Acupuncturist / Chiropractor / Massage Therapist',icon:Leaf,cat:'Healthcare & Wellness',
   keywords:['acupunctur','chiropract','massage therapist','naturopath','holistic'],
   expenses:[{k:'liability2',l:'Professional liability insurance',max:3000},{k:'supplies',l:'Treatment supplies & equipment',max:5000},{k:'office2',l:'Office / treatment room rental',max:15000},{k:'license7',l:'Licensing & CEUs',max:2500}]},

  // EDUCATION & COACHING
  {id:'teacher',label:'K–12 Teacher / School Educator',icon:GraduationCap,cat:'Education & Coaching',
   keywords:['teacher','k-12','elementary','middle school','high school','educator','classroom'],
   expenses:[{k:'classroom',l:'Classroom supplies',max:500,tip:'IRS gives teachers a $300 above-the-line deduction for supplies — no itemizing needed!'},{k:'prof_dev',l:'Professional development & workshops',max:2500},{k:'technology',l:'Technology for teaching',max:2000},{k:'books',l:'Books & instructional materials',max:1500},{k:'union',l:'Union dues',max:1000}]},
  {id:'professor',label:'College Professor / Academic',icon:GraduationCap,cat:'Education & Coaching',
   keywords:['professor','university','college teach','academic','faculty','lecturer','adjunct'],
   expenses:[{k:'research2',l:'Research & academic publications',max:5000},{k:'conferences2',l:'Academic conferences & travel',max:6000},{k:'books2',l:'Books & journal subscriptions',max:2000},{k:'home7',l:'Home office',max:8000},{k:'software4',l:'Research & statistical software',max:3000}]},
  {id:'tutor',label:'Private Tutor / Test Prep Instructor',icon:BookOpen,cat:'Education & Coaching',
   keywords:['tutor','test prep','sat prep','tutoring','private instructor'],
   expenses:[{k:'materials',l:'Tutoring materials & workbooks',max:2000},{k:'software5',l:'Tutoring platform & software',max:1500},{k:'vehicle3',l:'Transportation to students',max:6000},{k:'home8',l:'Home office',max:6000},{k:'mktg4',l:'Marketing & listings',max:1500}]},
  {id:'life_coach',label:'Life Coach / Career Coach / Business Coach',icon:Target,cat:'Education & Coaching',
   keywords:['life coach','career coach','business coach','executive coach','leadership coach'],
   expenses:[{k:'certification',l:'Coaching certifications (ICF, etc.)',max:5000},{k:'home9',l:'Home office / virtual studio',max:8000},{k:'sw9',l:'Coaching software & CRM',max:2500},{k:'mktg5',l:'Website & marketing',max:3000},{k:'courses4',l:'Continued learning & masterminds',max:4000}]},

  // TRADES & CONSTRUCTION
  {id:'electrician',label:'Electrician',icon:Zap,cat:'Trades & Construction',
   keywords:['electrician','electrical contractor','journeyman'],
   expenses:[{k:'tools3',l:'Tools & test equipment',max:15000,tip:'Tools used exclusively for work are fully deductible.'},{k:'vehicle4',l:'Work vehicle & fuel',max:20000},{k:'license8',l:'Licensing & continuing ed',max:1500},{k:'materials2',l:'Materials not billed to clients',max:8000},{k:'insurance2',l:'Business liability insurance',max:5000}]},
  {id:'plumber',label:'Plumber / Pipefitter',icon:Wrench,cat:'Trades & Construction',
   keywords:['plumb','pipefitt','plumbing contractor'],
   expenses:[{k:'tools4',l:'Tools & plumbing equipment',max:15000},{k:'vehicle5',l:'Work truck & fuel',max:20000},{k:'materials3',l:'Materials not billed to clients',max:10000},{k:'license9',l:'Licensing & bond fees',max:2000},{k:'insurance3',l:'Liability insurance',max:5000}]},
  {id:'contractor',label:'General Contractor / Builder',icon:HardHat,cat:'Trades & Construction',
   keywords:['general contractor','builder','construction','remodel','renovation'],
   expenses:[{k:'tools5',l:'Tools & equipment',max:25000},{k:'vehicle6',l:'Work vehicles & fuel',max:25000},{k:'subcontract',l:'Subcontractors (your portion)',max:50000},{k:'insurance4',l:'General liability & workers comp',max:10000},{k:'license10',l:'Licensing & bonding',max:3000}]},
  {id:'carpenter',label:'Carpenter / Cabinet Maker / Woodworker',icon:Hammer,cat:'Trades & Construction',
   keywords:['carpenter','cabinet','woodwork','joiner','millwork'],
   expenses:[{k:'tools6',l:'Hand & power tools',max:15000},{k:'materials4',l:'Wood & materials (not billed)',max:10000},{k:'vehicle7',l:'Vehicle & fuel',max:15000},{k:'shop',l:'Workshop rental or home shop',max:8000},{k:'safety',l:'Safety gear & PPE',max:1500}]},
  {id:'hvac',label:'HVAC Technician',icon:Zap,cat:'Trades & Construction',
   keywords:['hvac','heating','cooling','refrigerat','air conditioning tech'],
   expenses:[{k:'tools7',l:'Specialized HVAC tools',max:12000},{k:'vehicle8',l:'Service vehicle & fuel',max:18000},{k:'materials5',l:'Parts & refrigerant (not billed)',max:5000},{k:'license11',l:'EPA & state licensing fees',max:2000}]},
  {id:'roofer',label:'Roofer / Waterproofing Specialist',icon:Home,cat:'Trades & Construction',
   keywords:['roofer','roofing','waterproof','siding'],
   expenses:[{k:'materials6',l:'Materials not billed to clients',max:15000},{k:'tools8',l:'Tools & safety equipment',max:8000},{k:'vehicle9',l:'Vehicle & transportation',max:18000},{k:'insurance5',l:'Liability insurance',max:6000}]},
  {id:'welder',label:'Welder / Fabricator / Machinist',icon:Zap,cat:'Trades & Construction',
   keywords:['welder','welding','fabricat','machinist','metalwork'],
   expenses:[{k:'consumables',l:'Welding consumables & supplies',max:5000},{k:'equip6',l:'Equipment & tools',max:15000},{k:'safety2',l:'Safety gear & PPE',max:2000},{k:'vehicle10',l:'Vehicle & transportation',max:12000}]},
  {id:'landscaper',label:'Landscaper / Groundskeeper / Arborist',icon:Sprout,cat:'Trades & Construction',
   keywords:['landscap','groundskeep','arborist','lawn','tree service','irrigation'],
   expenses:[{k:'equip7',l:'Mowers, trimmers & equipment',max:20000},{k:'vehicle11',l:'Truck, trailer & fuel',max:20000},{k:'plants',l:'Plants & landscaping materials',max:8000},{k:'license12',l:'Pesticide license & insurance',max:2000}]},
  {id:'cleaner',label:'House Cleaner / Janitor / Maid Service',icon:Home,cat:'Trades & Construction',
   keywords:['cleaner','cleaning','housekeeper','maid','janitorial','sanitiz'],
   expenses:[{k:'supplies2',l:'Cleaning supplies & products',max:3000},{k:'vehicle12',l:'Vehicle & transportation',max:10000},{k:'equip8',l:'Vacuums & equipment',max:3000},{k:'insurance6',l:'Liability insurance & bonding',max:2000},{k:'uniforms',l:'Uniforms & protective gear',max:800}]},
  {id:'handyman',label:'Handyman / General Repair',icon:Wrench,cat:'Trades & Construction',
   keywords:['handyman','general repair','home repair','maintenance'],
   expenses:[{k:'tools9',l:'Tools & equipment',max:10000},{k:'vehicle13',l:'Vehicle & fuel',max:12000},{k:'materials7',l:'Materials not billed to clients',max:5000},{k:'insurance7',l:'Liability insurance',max:2000}]},
  {id:'painter_house',label:'House Painter / Interior Designer',icon:Palette,cat:'Trades & Construction',
   keywords:['house painter','painting contractor','interior design','decorator'],
   expenses:[{k:'supplies3',l:'Paints, brushes & supplies',max:10000},{k:'vehicle14',l:'Vehicle & transportation',max:12000},{k:'equip9',l:'Ladders, sprayers & equipment',max:5000},{k:'insurance8',l:'Liability insurance',max:2000}]},

  // TRANSPORTATION & DELIVERY
  {id:'rideshare',label:'Rideshare Driver (Uber / Lyft)',icon:Car,cat:'Transportation & Delivery',
   keywords:['uber','lyft','rideshare','ride-share'],
   expenses:[{k:'mileage',l:'Vehicle mileage (IRS: $0.70/mi)',max:25000,tip:'Your biggest deduction. Use an app to track every mile!'},{k:'phone2',l:'Phone & mount',max:1500,tip:'Phone used for work is deductible (work % only).'},{k:'data',l:'Data plan (work portion)',max:1200},{k:'fees',l:'Platform fees & tolls',max:5000},{k:'car_care',l:'Car cleaning & supplies',max:1000}]},
  {id:'delivery',label:'Delivery Driver (DoorDash / Amazon / FedEx)',icon:Package,cat:'Transportation & Delivery',
   keywords:['doordash','grubhub','amazon flex','fedex','ups driver','delivery driver','instacart','shipt'],
   expenses:[{k:'mileage2',l:'Vehicle mileage',max:25000,tip:'$0.70/mile for 2025. Track with an app.'},{k:'phone3',l:'Phone & accessories',max:1500},{k:'insulated',l:'Insulated bags & delivery gear',max:500},{k:'fees2',l:'Platform fees',max:3000},{k:'parking',l:'Parking & tolls',max:2000}]},
  {id:'truck_driver',label:'Truck Driver / Long-Haul Driver',icon:Truck,cat:'Transportation & Delivery',
   keywords:['truck driver','long haul','cdl','trucker','freight','semi','18 wheel'],
   expenses:[{k:'per_diem',l:'Per diem meals (away from home)',max:15000,tip:'IRS per diem for truck drivers: $69/day away from home.'},{k:'sleeper',l:'Sleeper berth & lodging',max:5000},{k:'cdl',l:'CDL renewal & endorsements',max:1000},{k:'phone4',l:'Phone & communication',max:1200},{k:'tools10',l:'Tools & supplies',max:3000}]},
  {id:'pilot',label:'Pilot / Flight Instructor',icon:Plane,cat:'Transportation & Delivery',
   keywords:['pilot','flight instructor','aviation','airline','commercial pilot'],
   expenses:[{k:'medical',l:'Medical certificates & physicals',max:1000},{k:'charts',l:'Charts, apps & publications',max:800},{k:'training',l:'Flight training & currency requirements',max:5000},{k:'union2',l:'Union & association dues',max:1500},{k:'headset',l:'Headset & cockpit gear',max:2500}]},

  // FOOD & HOSPITALITY
  {id:'restaurant_owner',label:'Restaurant / Bar / Café Owner',icon:Utensils,cat:'Food & Hospitality',
   keywords:['restaurant','bar owner','café','diner','bistro','tavern'],
   expenses:[{k:'food_cost',l:'Food & beverage COGS',max:300000},{k:'equip10',l:'Kitchen equipment',max:30000},{k:'pos',l:'POS system & software',max:3000},{k:'licenses2',l:'Health permits & liquor license',max:5000},{k:'uniforms2',l:'Staff uniforms',max:3000},{k:'delivery3',l:'Delivery packaging & fees',max:8000}]},
  {id:'caterer',label:'Caterer / Personal Chef / Baker',icon:Utensils,cat:'Food & Hospitality',
   keywords:['caterer','personal chef','baker','pastry','catering','food service'],
   expenses:[{k:'ingredients',l:'Ingredients & food supplies',max:50000},{k:'equip11',l:'Cooking equipment',max:10000},{k:'vehicle15',l:'Vehicle for deliveries',max:12000},{k:'kitchen',l:'Commercial kitchen rental',max:10000},{k:'packaging',l:'Packaging & presentation',max:3000}]},
  {id:'food_truck',label:'Food Truck Owner / Mobile Food Vendor',icon:Truck,cat:'Food & Hospitality',
   keywords:['food truck','mobile food','street food'],
   expenses:[{k:'food2',l:'Food & supplies',max:80000},{k:'truck_maint',l:'Truck maintenance & fuel',max:10000},{k:'permits',l:'Permits, licenses & commissary',max:5000},{k:'equip12',l:'Equipment & smallwares',max:8000},{k:'pos2',l:'POS & payment processing',max:1500}]},
  {id:'bartender',label:'Bartender / Mixologist',icon:Coffee,cat:'Food & Hospitality',
   keywords:['bartender','mixologist','barback','cocktail'],
   expenses:[{k:'cert2',l:'Bartending certifications',max:1000},{k:'tools11',l:'Bar tools & equipment',max:1500},{k:'education2',l:'Spirits education & tastings',max:1500},{k:'uniform3',l:'Work attire',max:600}]},

  // BEAUTY & PERSONAL SERVICES
  {id:'hair_stylist',label:'Hair Stylist / Barber / Colorist',icon:Scissors,cat:'Beauty & Personal Services',
   keywords:['hair stylist','barber','colorist','hair dresser','cosmetolog'],
   expenses:[{k:'tools12',l:'Scissors, clippers & styling tools',max:5000},{k:'supplies4',l:'Color, products & supplies',max:8000},{k:'booth',l:'Booth rental',max:15000,tip:'Booth rental is typically deductible as a business expense.'},{k:'license13',l:'Cosmetology license renewal',max:500},{k:'cont_ed',l:'Advanced education & training',max:3000}]},
  {id:'esthetician',label:'Esthetician / Nail Tech / Makeup Artist',icon:Scissors,cat:'Beauty & Personal Services',
   keywords:['esthetician','nail tech','makeup artist','lash tech','wax specialist','skincare'],
   expenses:[{k:'supplies5',l:'Products & supplies',max:6000},{k:'equip13',l:'Equipment & tools',max:5000},{k:'space3',l:'Booth or room rental',max:12000},{k:'license14',l:'Licensing & CEUs',max:800},{k:'mktg6',l:'Marketing & social media',max:2000}]},
  {id:'tattoo',label:'Tattoo Artist / Body Piercer',icon:Palette,cat:'Beauty & Personal Services',
   keywords:['tattoo','body pierc','ink artist'],
   expenses:[{k:'supplies6',l:'Inks, needles & supplies',max:8000},{k:'equip14',l:'Machines & equipment',max:5000},{k:'space4',l:'Studio rental or booth',max:15000},{k:'license15',l:'Licensing & health permits',max:1000},{k:'portfolio3',l:'Portfolio & marketing',max:2000}]},
  {id:'pet_groomer',label:'Pet Groomer / Dog Trainer',icon:Dog,cat:'Beauty & Personal Services',
   keywords:['pet groom','dog train','animal train','groomer'],
   expenses:[{k:'supplies7',l:'Grooming supplies & products',max:4000},{k:'equip15',l:'Grooming equipment & tables',max:5000},{k:'vehicle16',l:'Mobile grooming van',max:20000},{k:'insurance9',l:'Pet care liability insurance',max:2000},{k:'cert3',l:'Certifications & training',max:1500}]},

  // FINANCE & LEGAL
  {id:'accountant',label:'Accountant / CPA / Bookkeeper',icon:Calculator,cat:'Finance & Legal',
   keywords:['accountant','cpa','bookkeeper','tax professional','controller','cfo'],
   expenses:[{k:'software6',l:'Tax & accounting software',max:5000},{k:'cpe2',l:'CPE credits & continuing ed',max:3000},{k:'license16',l:'CPA license & PTIN fees',max:1000},{k:'e_o',l:'E&O insurance',max:3000},{k:'home10',l:'Home office',max:8000}]},
  {id:'financial_advisor',label:'Financial Advisor / Planner / Broker',icon:TrendingUp,cat:'Finance & Legal',
   keywords:['financial advisor','financial planner','wealth manager','investment advisor','broker','cfp'],
   expenses:[{k:'license17',l:'Series licenses & FINRA fees',max:2000},{k:'e_o2',l:'E&O insurance',max:5000},{k:'software7',l:'Financial planning software',max:4000},{k:'cont_ed2',l:'CFP/continuing education',max:3000},{k:'mktg7',l:'Marketing & prospecting',max:5000}]},
  {id:'insurance_agent',label:'Insurance Agent / Broker',icon:Shield,cat:'Finance & Legal',
   keywords:['insurance agent','insurance broker','underwriter'],
   expenses:[{k:'license18',l:'State licenses & E&O insurance',max:5000},{k:'software8',l:'CRM & quoting software',max:3000},{k:'mktg8',l:'Marketing & lead generation',max:8000},{k:'vehicle17',l:'Vehicle for client visits',max:10000},{k:'home11',l:'Home office',max:8000}]},
  {id:'lawyer',label:'Lawyer / Attorney / Paralegal',icon:Scale,cat:'Finance & Legal',
   keywords:['lawyer','attorney','paralegal','legal','counsel','solicitor','law clerk'],
   expenses:[{k:'bar',l:'Bar dues & CLE credits',max:3000},{k:'malpractice5',l:'Malpractice insurance',max:8000},{k:'research2',l:'Legal research (Westlaw, LexisNexis)',max:5000},{k:'software9',l:'Case management software',max:3000},{k:'home12',l:'Home office',max:8000}]},
  {id:'mortgage',label:'Mortgage Broker / Loan Officer / Real Estate Agent',icon:Home,cat:'Finance & Legal',
   keywords:['mortgage broker','loan officer','real estate agent','realtor','broker'],
   expenses:[{k:'license19',l:'NMLS license & continuing ed',max:2000},{k:'marketing',l:'Marketing & advertising',max:12000},{k:'vehicle18',l:'Vehicle & mileage',max:15000},{k:'software10',l:'CRM & processing software',max:3000},{k:'e_o3',l:'E&O insurance',max:4000}]},

  // RETAIL & E-COMMERCE
  {id:'ecommerce',label:'E-commerce / Online Seller / Amazon FBA',icon:ShoppingBag,cat:'Retail & E-commerce',
   keywords:['ecomm','etsy','shopify','amazon fba','online store','ebay seller','reseller','dropship'],
   expenses:[{k:'inventory',l:'Inventory & product costs',max:100000},{k:'shipping',l:'Shipping & packaging',max:15000},{k:'platform2',l:'Platform fees (Amazon, Etsy...)',max:8000},{k:'ads3',l:'Advertising & paid traffic',max:15000},{k:'storage2',l:'Fulfillment & storage',max:10000},{k:'software11',l:'Store software & tools',max:2500}]},
  {id:'retail_owner',label:'Retail Store Owner',icon:ShoppingBag,cat:'Retail & E-commerce',
   keywords:['retail store','boutique','shop owner','retail owner'],
   expenses:[{k:'inventory2',l:'Inventory & COGS',max:200000},{k:'rent',l:'Rent & utilities',max:60000},{k:'employees',l:'Employee wages (portion not on payroll)',max:50000},{k:'pos3',l:'POS system & software',max:3000},{k:'mktg9',l:'Marketing & signage',max:5000}]},
  {id:'reseller',label:'Reseller / Thrift Flipper / Liquidation',icon:RefreshCw,cat:'Retail & E-commerce',
   keywords:['reseller','flip','thrift','liquidat','pawn'],
   expenses:[{k:'inventory3',l:'Purchase cost of items resold',max:30000,tip:'Cost of goods sold is deductible.'},{k:'shipping2',l:'Shipping & packaging',max:5000},{k:'platform3',l:'Platform fees',max:3000},{k:'mileage3',l:'Mileage to sourcing locations',max:5000}]},

  // REAL ESTATE & PROPERTY
  {id:'realtor_agent',label:'Real Estate Agent / Broker',icon:Home,cat:'Real Estate & Property',
   keywords:['real estate agent','realtor','real estate broker'],
   expenses:[{k:'mls',l:'MLS dues & board fees',max:3000},{k:'mktg10',l:'Marketing & advertising',max:12000},{k:'vehicle19',l:'Vehicle & mileage',max:20000,tip:'Showing homes adds up fast at $0.70/mile.'},{k:'license20',l:'License & E&O insurance',max:3000},{k:'staging',l:'Staging & photography',max:5000},{k:'meals',l:'Client meals & gifts',max:3000,tip:'50% of business meals are deductible. Keep receipts.'}]},
  {id:'property_manager',label:'Property Manager / Landlord',icon:Building2,cat:'Real Estate & Property',
   keywords:['property manager','landlord','property management'],
   expenses:[{k:'maintenance',l:'Repairs & maintenance',max:20000},{k:'management',l:'Property management software',max:2000},{k:'vehicle20',l:'Vehicle for property visits',max:8000},{k:'advertising',l:'Advertising & tenant acquisition',max:3000},{k:'professional2',l:'Legal & accounting fees',max:5000}]},

  // GOVERNMENT & NON-PROFIT
  {id:'government',label:'Government Employee / Military / Public Servant',icon:Shield,cat:'Government & Non-Profit',
   keywords:['government','federal employee','military','civil servant','postal','dod','state employee'],
   expenses:[{k:'uniform4',l:'Required uniforms (unreimbursed)',max:1000},{k:'professional3',l:'Professional development (unreimbursed)',max:2000},{k:'tools13',l:'Tools & equipment (unreimbursed)',max:1500}]},
  {id:'nonprofit',label:'Non-Profit / Social Work / Volunteer Coordinator',icon:Heart,cat:'Government & Non-Profit',
   keywords:['non-profit','nonprofit','social work','volunteer coord','ngo'],
   expenses:[{k:'mileage4',l:'Volunteer driving mileage (14¢/mile)',max:1000,tip:'Charitable driving is deductible at $0.14/mile.'},{k:'uniforms5',l:'Required uniforms & supplies',max:800},{k:'home13',l:'Home office (if applicable)',max:5000}]},

  // AGRICULTURE & ENVIRONMENT
  {id:'farmer',label:'Farmer / Rancher / Agricultural Producer',icon:Sprout,cat:'Agriculture & Environment',
   keywords:['farmer','rancher','agricult','grower','farm'],
   expenses:[{k:'seeds',l:'Seeds, plants & livestock',max:100000},{k:'equip16',l:'Farm equipment & machinery',max:50000},{k:'fuel',l:'Fuel & utilities for operations',max:10000},{k:'land',l:'Land rent & lease',max:30000},{k:'insurance10',l:'Crop & livestock insurance',max:8000}]},
  {id:'environmental',label:'Environmental Consultant / Scientist',icon:Leaf,cat:'Agriculture & Environment',
   keywords:['environmental','ecologist','biologist','conservation','sustainability consult'],
   expenses:[{k:'equip17',l:'Field equipment & instruments',max:8000},{k:'vehicle21',l:'Vehicle for field work',max:12000},{k:'software12',l:'Scientific software & databases',max:3000},{k:'cont_ed3',l:'Conferences & publications',max:4000}]},

  // CHILDCARE & EDUCATION SERVICES
  {id:'childcare',label:'Daycare Owner / Nanny / Au Pair',icon:Baby,cat:'Childcare & Education Services',
   keywords:['daycare','nanny','childcare','babysit','au pair','child care provider'],
   expenses:[{k:'supplies8',l:'Educational supplies & toys',max:3000},{k:'food3',l:'Food & snacks for children',max:5000,tip:'Food costs for childcare business are deductible.'},{k:'insurance11',l:'Liability insurance',max:3000},{k:'license21',l:'State licensing & background checks',max:500},{k:'home14',l:'Home daycare space (dedicated %)',max:10000}]},
  {id:'tutor2',label:'Music / Art / Sports Coach / Instructor',icon:Music,cat:'Childcare & Education Services',
   keywords:['music teach','art teach','sports coach','swim instructor','guitar teach','piano teach'],
   expenses:[{k:'equipment4',l:'Teaching equipment & instruments',max:5000},{k:'space5',l:'Venue or facility rental',max:8000},{k:'materials2',l:'Teaching materials & supplies',max:2000},{k:'vehicle22',l:'Travel to students / venues',max:6000}]},

  // SCIENCE & RESEARCH
  {id:'scientist',label:'Scientist / Researcher / Lab Professional',icon:FlaskConical,cat:'Science & Research',
   keywords:['scientist','researcher','lab','biologist','chemist','physicist','research associate','postdoc'],
   expenses:[{k:'lab_supplies',l:'Lab supplies & reagents',max:10000},{k:'software13',l:'Scientific software & computing',max:5000},{k:'publications',l:'Journal subscriptions & publications',max:2000},{k:'conferences3',l:'Conference travel & fees',max:6000}]},
  {id:'engineer',label:'Civil / Mechanical / Structural Engineer',icon:HardHat,cat:'Science & Research',
   keywords:['civil engineer','mechanical engineer','structural engineer','electrical engineer','chemical engineer'],
   expenses:[{k:'software14',l:'Engineering software (AutoCAD, ANSYS...)',max:8000},{k:'pe_license',l:'PE license & continuing ed',max:2000},{k:'equip18',l:'Measurement & testing equipment',max:5000},{k:'vehicle23',l:'Vehicle for site visits',max:10000}]},

  // SPORTS & RECREATION
  {id:'athlete',label:'Professional Athlete / Sports Coach',icon:Dumbbell,cat:'Sports & Recreation',
   keywords:['athlete','pro athlete','sports coach','athletic trainer','personal trainer','coach'],
   expenses:[{k:'training2',l:'Training & coaching fees',max:15000},{k:'equip19',l:'Sports equipment & gear',max:10000},{k:'travel4',l:'Travel for competitions & events',max:15000},{k:'agent',l:'Agent & manager fees',max:20000,tip:'Agent fees are a deductible business expense.'},{k:'medical2',l:'Medical & physical therapy',max:8000}]},
  {id:'recreation',label:'Tour Guide / Event Planner / Party Entertainer',icon:Globe,cat:'Sports & Recreation',
   keywords:['tour guide','event planner','party entertainer','event coordinator','wedding planner','juggl','magician','clown'],
   expenses:[{k:'supplies9',l:'Supplies & props',max:5000},{k:'vehicle24',l:'Transportation & mileage',max:8000},{k:'license22',l:'Permits & licenses',max:1000},{k:'marketing2',l:'Marketing & website',max:3000},{k:'insurance12',l:'Liability insurance',max:2000}]},

  // GENERAL / OTHER
  {id:'consultant',label:'Consultant / Advisor (General)',icon:Briefcase,cat:'General',
   keywords:['consult','advisor','strateg','management consult'],
   expenses:[{k:'home15',l:'Home office',max:8000},{k:'software15',l:'Software & tools',max:4000},{k:'travel5',l:'Client travel',max:10000},{k:'meals2',l:'Client meals (50% deductible)',max:4000,tip:'50% of documented business meals are deductible.'},{k:'cont_ed4',l:'Professional development',max:3000},{k:'phone5',l:'Phone & internet (work %)',max:2400}]},
  {id:'other',label:'Other / General Business',icon:Briefcase,cat:'General',
   keywords:[],
   expenses:[{k:'home16',l:'Home office',max:8000,tip:'Must be used exclusively for business.'},{k:'vehicle25',l:'Vehicle & mileage',max:20000,tip:'$0.70/mile or actual vehicle costs.'},{k:'meals3',l:'Business meals (50% deductible)',max:5000},{k:'equip20',l:'Equipment & tools',max:10000},{k:'marketing3',l:'Marketing & advertising',max:8000},{k:'phone6',l:'Phone & internet (work %)',max:2400},{k:'professional4',l:'Professional services (legal, accounting)',max:5000},{k:'travel6',l:'Business travel',max:8000}]},
];

// Group by category for the picker UI
const BIZ_CATS = [...new Set(BIZ_TYPES.map(b=>b.cat))];

function detectBizType(desc=''){
  if(!desc||desc.length<3)return null;
  const low=desc.toLowerCase();
  for(const bt of BIZ_TYPES){
    if(bt.keywords.some(kw=>low.includes(kw)))return bt;
  }
  return null;
}

// ─── STATIC DATA ──────────────────────────────────────────────────
const STATES=['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const SN={AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'Washington D.C.',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};
// ─── STATE INCOME TAX DATA (graduated brackets) ────────────────────────────
// Source: Tax Foundation 2025/2026, state revenue departments
// Format per state: {s:[lo,hi,rate], m:[lo,hi,rate], loc:localRate}
//   s = single/HoH brackets, m = MFJ brackets (if different), loc = mandatory local tax added
//   Flat rate states: {s:[[0,9e8,rate]]}
//   No-tax states: not in object (check NT set)
const NT=new Set(['TX','FL','NV','WA','WY','SD','AK','TN','NH']);
const STATE_TAX={
 2025:{
  // ── FLAT RATE STATES ──────────────────────────────────────────────────────
  AZ:{s:[[0,9e8,.025]]},
  CO:{s:[[0,9e8,.044]]},
  GA:{s:[[0,9e8,.0519]]},
  ID:{s:[[0,9e8,.053]]},
  IL:{s:[[0,9e8,.0495]]},
  IN:{s:[[0,9e8,.030]]},
  IA:{s:[[0,9e8,.038]]},
  KY:{s:[[0,9e8,.040]]},
  LA:{s:[[0,9e8,.030]]},
  MA:{s:[[0,1e6,.05],[1e6,9e8,.09]]},  // 5% + 4% millionaire surtax
  MI:{s:[[0,9e8,.0425]]},
  MS:{s:[[0,9e8,.044]]},
  NC:{s:[[0,9e8,.0425]]},
  PA:{s:[[0,9e8,.0307]]},
  UT:{s:[[0,9e8,.045]]},
  // ── GRADUATED STATES ─────────────────────────────────────────────────────
  AL:{s:[[0,500,.02],[500,3e3,.04],[3e3,9e8,.05]],m:[[0,1e3,.02],[1e3,6e3,.04],[6e3,9e8,.05]]},
  AR:{s:[[0,4400,.02],[4400,8800,.04],[8800,9e8,.044]]},
  CA:{
   s:[[0,10756,.01],[10756,25499,.02],[25499,40245,.04],[40245,55866,.06],[55866,70606,.08],
      [70606,360659,.093],[360659,432787,.103],[432787,721314,.113],[721314,1e6,.123],[1e6,9e8,.133]],
   m:[[0,21512,.01],[21512,50998,.02],[50998,80490,.04],[80490,111732,.06],[111732,141212,.08],
      [141212,721318,.093],[721318,865574,.103],[865574,1e6,.113],[1e6,1442628,.123],[1442628,9e8,.133]]},
  CT:{s:[[0,1e4,.02],[1e4,5e4,.045],[5e4,1e5,.055],[1e5,2e5,.06],[2e5,25e4,.065],[25e4,5e5,.069],[5e5,9e8,.0699]],
      m:[[0,2e4,.02],[2e4,1e5,.045],[1e5,2e5,.055],[2e5,4e5,.06],[4e5,5e5,.065],[5e5,1e6,.069],[1e6,9e8,.0699]]},
  DC:{s:[[0,1e4,.04],[1e4,4e4,.06],[4e4,6e4,.065],[6e4,25e4,.085],[25e4,5e5,.0925],[5e5,1e6,.0975],[1e6,9e8,.1075]]},
  DE:{s:[[0,2e3,0],[2e3,5e3,.022],[5e3,1e4,.039],[1e4,2e4,.048],[2e4,25e3,.052],[25e3,6e4,.0555],[6e4,9e8,.066]]},
  HI:{s:[[0,9600,.014],[9600,16800,.032],[16800,24e3,.055],[24e3,32e3,.064],[32e3,4e4,.068],
         [4e4,6e4,.072],[6e4,8e4,.076],[8e4,1e5,.079],[1e5,125e3,.0825],[125e3,15e4,.09],[15e4,325e3,.10],[325e3,9e8,.11]],
      m:[[0,19200,.014],[19200,33600,.032],[33600,48e3,.055],[48e3,64e3,.064],[64e3,8e4,.068],
         [8e4,12e4,.072],[12e4,16e4,.076],[16e4,2e5,.079],[2e5,25e4,.0825],[25e4,3e5,.09],[3e5,65e4,.10],[65e4,9e8,.11]]},
  KS:{s:[[0,15e3,.052],[15e3,9e8,.0558]],m:[[0,3e4,.052],[3e4,9e8,.0558]]},
  MD:{s:[[0,1e3,.02],[1e3,2e3,.03],[2e3,3e3,.04],[3e3,1e5,.0475],[1e5,125e3,.05],
         [125e3,15e4,.0525],[15e4,25e4,.055],[25e4,3e5,.0575],[3e5,1e6,.0625],[1e6,9e8,.065]],
      loc:.025},   // mandatory county/local tax, avg 2.5%
  ME:{s:[[0,26050,.058],[26050,61600,.0675],[61600,9e8,.0715]],
      m:[[0,52100,.058],[52100,123250,.0675],[123250,9e8,.0715]]},
  MN:{s:[[0,31690,.0535],[31690,104090,.068],[104090,198630,.0785],[198630,9e8,.0985]],
      m:[[0,46330,.0535],[46330,184040,.068],[184040,330410,.0785],[330410,9e8,.0985]]},
  MO:{s:[[0,1207,.015],[1207,2414,.02],[2414,3621,.025],[3621,4828,.03],[4828,6035,.035],[6035,7242,.04],[7242,9999,.045],[9999,9e8,.047]]},
  MT:{s:[[0,20500,.047],[20500,9e8,.059]],m:[[0,41e3,.047],[41e3,9e8,.059]]},
  NE:{s:[[0,3700,.0246],[3700,22170,.0351],[22170,35730,.0501],[35730,9e8,.052]],
      m:[[0,7390,.0246],[7390,44350,.0351],[44350,71470,.0501],[71470,9e8,.052]]},
  NJ:{s:[[0,2e4,.014],[2e4,35e3,.0175],[35e3,4e4,.035],[4e4,75e3,.05525],[75e3,5e5,.0637],[5e5,1e6,.0897],[1e6,9e8,.1075]],
      m:[[0,2e4,.014],[2e4,5e4,.0175],[5e4,7e4,.0245],[7e4,8e4,.035],[8e4,15e4,.05525],[15e4,5e5,.0637],[5e5,1e6,.0897],[1e6,9e8,.1075]]},
  NM:{s:[[0,5500,.015],[5500,11e3,.032],[11e3,33500,.043],[33500,21e4,.047],[21e4,9e8,.059]]},
  NY:{s:[[0,17150,.04],[17150,23600,.045],[23600,27900,.0525],[27900,161550,.055],
         [161550,323200,.06],[323200,2155350,.0685],[2155350,5e6,.0965],[5e6,25e6,.103],[25e6,9e8,.109]],
      m:[[0,27900,.04],[27900,43000,.045],[43000,161550,.0525],[161550,323200,.055],
         [323200,2155350,.06],[2155350,5e6,.0685],[5e6,25e6,.0965],[25e6,9e8,.103]]},
  ND:{s:[[0,44725,.011],[44725,9e8,.025]],m:[[0,74750,.011],[74750,9e8,.025]]},
  OH:{s:[[0,26050,.0275],[26050,9e8,.035]]},
  OK:{s:[[0,1e3,.0025],[1e3,2500,.0075],[2500,3750,.0175],[3750,4900,.0275],[4900,7200,.0375],[7200,9e8,.0475]]},
  OR:{s:[[0,4050,.0475],[4050,10200,.0675],[10200,125e3,.0875],[125e3,9e8,.099]],
      m:[[0,8100,.0475],[8100,20400,.0675],[20400,25e4,.0875],[25e4,9e8,.099]]},
  RI:{s:[[0,77450,.0375],[77450,176050,.0475],[176050,9e8,.0599]],
      m:[[0,154900,.0375],[154900,352100,.0475],[352100,9e8,.0599]]},
  SC:{s:[[0,3460,0],[3460,6930,.03],[6930,10390,.04],[10390,13860,.05],[13860,9e8,.06]]},
  VA:{s:[[0,3e3,.02],[3e3,5e3,.03],[5e3,17e3,.05],[17e3,9e8,.0575]]},
  VT:{s:[[0,45400,.0335],[45400,110050,.066],[110050,229550,.076],[229550,9e8,.0875]],
      m:[[0,75850,.0335],[75850,183400,.066],[183400,236350,.076],[236350,9e8,.0875]]},
  WI:{s:[[0,14320,.035],[14320,28640,.044],[28640,315310,.053],[315310,9e8,.0765]],
      m:[[0,19090,.035],[19090,38190,.044],[38190,420420,.053],[420420,9e8,.0765]]},
  WV:{s:[[0,10e3,.0236],[10e3,25e3,.0315],[25e3,4e4,.0354],[4e4,6e4,.0472],[6e4,9e8,.0482]]},
 },
 2026:{
  // Only states with changes from 2025; all others inherit from STATE_TAX[2025]
  CO:{s:[[0,9e8,.04]]},                           // drops from 4.4% to 4.0%
  MS:{s:[[0,9e8,.04]]},                            // drops from 4.4% to 4.0%
  MT:{s:[[0,20500,.047],[20500,9e8,.0565]],m:[[0,41e3,.047],[41e3,9e8,.0565]]}, // top 5.9%→5.65%
  NC:{s:[[0,9e8,.0399]]},                          // drops from 4.25% to 3.99%
  OH:{s:[[0,9e8,.0275]]},                          // becomes flat 2.75%
  OK:{s:[[0,2500,.025],[2500,7500,.035],[7500,9e8,.045]]}, // 3 brackets, top 4.5%
 }
};

// State tax calculation — uses graduated brackets or flat rate, applies local tax where mandatory
function calcStateTax(agi, st, fs, year) {
  if (!st || NT.has(st)) return 0;
  const yr2025 = STATE_TAX[2025];
  const yr2026 = STATE_TAX[2026] || {};
  // Merge: 2026 overrides where changed, else use 2025
  const stData = (year === 2026 && yr2026[st]) ? yr2026[st] : yr2025[st];
  if (!stData) return agi * 0.045; // fallback for any missing state
  const bkts = (fs === 'mfj' || fs === 'mfs') && stData.m ? stData.m : stData.s;
  let tax = 0;
  for (const [lo, hi, r] of bkts) { if (agi > lo) tax += Math.min(agi - lo, hi - lo) * r; }
  if (stData.loc) tax += agi * stData.loc; // mandatory local (MD)
  return tax;
}

// ── Preserve NT for UI (no-income-tax badge) ─────────────────────
// NT already declared above in STATE_TAX block

const PERSONAS=[
  {id:'teacher',name:'Jamie',role:'Teacher',loc:'CA',data:{wt:['w2'],st:'CA',age:'30-44',fs:'single',w2:58000,wh:7400,r401k:4000,sloan:2200}},
  {id:'engineer',name:'Alex',role:'Software Engineer',loc:'TX',data:{wt:['w2'],st:'TX',age:'30-44',fs:'mfj',w2:140000,sw2:40000,wh:30000,r401k:23500,home:true,mort:true,mortInt:18000,salt:8000}},
  {id:'designer',name:'Morgan',role:'Freelance Designer',loc:'NY',data:{wt:['se'],st:'NY',age:'30-44',fs:'single',seInc:75000,seH:4800,seE:2800,seO:2000,estP:8000,ira:7000}},
  {id:'electrician',name:'Dave',role:'Electrician',loc:'NV',data:{wt:['w2'],st:'NV',age:'30-44',fs:'mfj',w2:72000,wh:9000,r401k:10000,kids:2,cc:true,ccAmt:8500}},
  {id:'nurse',name:'Maya',role:'RN + Side Shifts',loc:'FL',data:{wt:['w2','se'],st:'FL',age:'30-44',fs:'single',w2:68000,wh:9000,seInc:18000,estP:2000,r401k:6000,sloan:2500}},
  {id:'lawyer',name:'Chris',role:'Attorney',loc:'DC',data:{wt:['w2'],st:'DC',age:'45-64',fs:'mfj',w2:280000,sw2:95000,wh:98000,r401k:23500,home:true,mort:true,mortInt:28000,salt:40000,charity:12000,kids:1}},
  {id:'restaurant',name:'Sofia',role:'Restaurant Owner',loc:'IL',data:{wt:['biz'],st:'IL',age:'45-64',fs:'mfj',bizSal:false,bizEmp:true,bizOnly:true,bizReg:true,bizDesc:'restaurant owner',bizRev:650000,bizPay:280000,bizExp:{food_cost:195000,equip10:8000,pos:2500,licenses2:3000},estP:5000,wh:0,kids:2}},
  {id:'driver',name:'Marcus',role:'Rideshare Driver',loc:'GA',data:{wt:['se'],st:'GA',age:'under30',fs:'single',seInc:42000,bizDesc:'rideshare driver uber',bizExp:{mileage:11000,phone2:800,data:800,fees:3000},estP:0}},
  {id:'retired',name:'Linda & Bob',role:'Retired Couple',loc:'AZ',data:{wt:['ret'],st:'AZ',age:'65plus',fs:'mfj',otherInc:68000,wh:4200,estP:0}},
  {id:'realtor',name:'Jordan',role:'Real Estate Agent',loc:'CO',data:{wt:['se'],st:'CO',age:'30-44',fs:'single',seInc:95000,estP:13000,ira:7000,home:true,mort:true,mortInt:14000,salt:6000,bizDesc:'real estate agent',bizExp:{mls:2500,mktg10:8000,vehicle19:7000,license20:1200,staging:3000}}},
];

const mkProds=(lvl)=>{
  const tt={n:'TurboTax',em:'⚡',c:'#0068F7',url:'https://turbotax.intuit.com'};
  return{
    diy_low:[{...tt,sub:'#1 rated tax software. Free tier for simple W-2 returns.',detail:'Step-by-step Q&A, 100% accuracy guarantee, max refund promise. ~37% of filers qualify for free.',badge:'Best for beginners',price:'$0 (free tier)'},
      {n:'IRS Free File',sub:'Official IRS program. Free if income < $89k.',em:'🏛️',c:'#1D4ED8',url:'https://irs.gov/freefile',badge:'$0 always',price:'$0 fed + state'},
      {n:'Cash App Taxes',sub:'Completely free — zero upgrade traps.',em:'💸',c:'#00A86B',url:'https://cash.app/taxes',price:'$0 always'},
      {n:'H&R Block Free',sub:'Best free tier of the big-name tools.',em:'🏢',c:'#046B3D',url:'https://hrblock.com',price:'$0 federal'}],
    diy_med:[{...tt,sub:'Guided filing for homeowners, investors & families with kids.',detail:'Purpose-built for Deluxe filers. Imports W-2s, finds deductions, and guides every step.',badge:'Most popular',price:'~$79 + state'},
      {n:'FreeTaxUSA',sub:'Handles ALL situations for almost nothing — underrated.',em:'🌟',c:'#E04E1A',url:'https://freetaxusa.com',badge:'Best value',price:'$0 fed · $15.99 state'},
      {n:'TaxSlayer Classic',sub:'All forms at a budget price.',em:'⚡',c:'#CA8A04',url:'https://taxslayer.com',price:'~$37 + state'},
      {n:'H&R Block Deluxe',sub:'Great UI with 10k+ in-person backup locations.',em:'🏢',c:'#046B3D',url:'https://hrblock.com',price:'~$35 + state'}],
    diy_high:[{...tt,sub:'Self-employed edition — tracks expenses, estimates quarterly taxes.',detail:'Purpose-built for freelancers & business owners. Mileage tracker, 1099 import, quarterly payment reminders.',badge:'Most popular',price:'~$129 + state'},
      {n:'FreeTaxUSA',sub:'Complex returns for near-nothing — best kept secret in filing.',em:'🌟',c:'#E04E1A',url:'https://freetaxusa.com',badge:'Best value',price:'$0 fed · $15.99 state'},
      {n:'TaxAct Self-Emp.',sub:'Only major online tool with full S-Corp support.',em:'💼',c:'#0066CC',url:'https://taxact.com',badge:'S-Corp ready',price:'~$65 + state'},
      {n:'TaxSlayer Self-Emp.',sub:'Budget option for biz + 1099 filers.',em:'⚡',c:'#CA8A04',url:'https://taxslayer.com',price:'~$53 + state'}],
    assist:[{...tt,sub:'Unlimited live CPA/EA chat + expert final review before you file.',detail:'A credentialed expert reviews your entire return before it goes in. Included with TurboTax Live.',badge:'Most popular',price:'$89–$219 + state'},
      {n:'FreeTaxUSA Pro',sub:'Tax pro access + live screen share — incredible value.',em:'🌟',c:'#E04E1A',url:'https://freetaxusa.com',badge:'Best value',price:'~$50 + state'},
      {n:'H&R Block Expert',sub:'Expert reviews + in-person option at 10k+ offices.',em:'🏢',c:'#046B3D',url:'https://hrblock.com',price:'$85–$215 + state'},
      {n:'TaxAct Xpert',sub:'On-demand pro help, strong for business filers.',em:'💼',c:'#0066CC',url:'https://taxact.com',price:'$60–$100 + state'}],
    pro:[{...tt,sub:'A dedicated tax expert prepares and files your entire return.',detail:'Just upload your docs — a dedicated expert handles everything. Guaranteed accuracy, max refund.',badge:'Most popular',price:'$129–$500+'},
      {n:'H&R Block Full Service',sub:'Online or in-person at 10,000+ locations.',em:'🏢',c:'#046B3D',url:'https://hrblock.com',price:'$89–$500+'},
      {n:'Jackson Hewitt',sub:'Simple flat-fee filing — no surprise charges.',em:'💛',c:'#F59E0B',url:'https://jacksonhewitt.com',badge:'Flat fee',price:'$25–$200 flat'},
      {n:'Find a Local CPA',sub:'Best for genuinely complex situations — personalized.',em:'🏅',c:'#374151',url:'https://aicpa-cima.com/forthepublic/findacpa',price:'$200–$2,000+'}],
  };
};

// ─── TAX MATH ─────────────────────────────────────────────────────
// ─── TAX YEAR DATA ──────────────────────────────────────────────────
// Source: IRS Rev. Proc. 2024-40 (2025) and Rev. Proc. 2025-32 (2026) + IRS Notice 2025-67
const TAX_DATA = {
  2025: {
    brackets: {
      single:[[0,11925,.10],[11925,48475,.12],[48475,103350,.22],[103350,197300,.24],[197300,250525,.32],[250525,626350,.35],[626350,9e8,.37]],
      mfj:   [[0,23850,.10],[23850,96950,.12],[96950,206700,.22],[206700,394600,.24],[394600,501050,.32],[501050,751600,.35],[751600,9e8,.37]],
      hoh:   [[0,17000,.10],[17000,64850,.12],[64850,103350,.22],[103350,197300,.24],[197300,250500,.32],[250500,626350,.35],[626350,9e8,.37]],
      mfs:   [[0,11925,.10],[11925,48475,.12],[48475,103350,.22],[103350,197300,.24],[197300,250525,.32],[250525,626350,.35],[626350,9e8,.37]],
    },
    stdDed:{single:15750,mfj:31500,hoh:23625,mfs:15750},
    age65Bonus:{single:2000,mfj:3200},  // additional std ded per qualifying person
    seniorDeduction:0,                   // new OBBBA senior deduction (2025 has none)
    r401kMax:23500,
    iraMax:7000,
    hsaMax:{self:4300,family:8550},
    slanMax:2500,
    saltCap:40000,
    ctc:2200,
    changes:[],
  },
  2026: {
    brackets: {
      // Source: IRS Rev. Proc. 2025-32 (Oct 9, 2025)
      single:[[0,12400,.10],[12400,50400,.12],[50400,105700,.22],[105700,201775,.24],[201775,256225,.32],[256225,640000,.35],[640000,9e8,.37]],
      mfj:   [[0,24800,.10],[24800,100800,.12],[100800,211400,.22],[211400,403550,.24],[403550,512450,.32],[512450,731100,.35],[731100,9e8,.37]],
      hoh:   [[0,17450,.10],[17450,66600,.12],[66600,106100,.22],[106100,202600,.24],[202600,257250,.32],[257250,643200,.35],[643200,9e8,.37]],
      mfs:   [[0,12400,.10],[12400,50400,.12],[50400,105700,.22],[105700,201775,.24],[201775,256225,.32],[256225,640000,.35],[640000,9e8,.37]],
    },
    stdDed:{single:16100,mfj:32200,hoh:24150,mfs:16100},
    age65Bonus:{single:2050,mfj:3300},  // per qualifying person (2026 adjusted)
    seniorDeduction:6000,                // NEW: OBBBA $6k deduction for 65+, phases out $75k-$175k single / $150k-$250k MFJ
    r401kMax:24500,                      // IRS Notice 2025-67
    iraMax:7500,
    hsaMax:{self:4400,family:8750},
    slanMax:2500,
    saltCap:40400,                       // +1% from 2025's $40,000
    ctc:2200,                            // unchanged per Rev. Proc. 2025-32
    changes:[
      {icon:'📈',title:'Higher standard deduction',detail:'Single: $16,100 (+$350) · Married: $32,200 (+$700) · HoH: $24,150 (+$525)'},
      {icon:'💰',title:'Higher 401(k) & IRA limits',detail:'401(k): $24,500 (+$1,000) · IRA: $7,500 (+$500) · HSA: $4,400/$8,750'},
      {icon:'🏡',title:'SALT cap increases to $40,400',detail:'Up +$400 from 2025\'s $40,000 (1% annual increase through 2029)'},
      {icon:'🎁',title:'NEW: $6,000 Senior Deduction',detail:'For age 65+, on top of standard deduction. Phases out above $75k (single) or $150k (joint). Valid 2025–2028.'},
      {icon:'📊',title:'Wider tax brackets (~2–4%)',detail:'All bracket thresholds increased for inflation. More income taxed at lower rates vs 2025.'},
    ],
  },
};

function calcTax(d, year=2025){
  const Y = TAX_DATA[year] || TAX_DATA[2025];
  const fs=d.fs||'single';
  const bk=Y.brackets;
  const sdMap=Y.stdDed;
  const bizExpTotal=Object.values(d.bizExp||{}).reduce((a,v)=>a+(+v||0),0);
  const seExpTotal=(d.seV||0)+(d.seH||0)+(d.seE||0)+(d.seO||0)+Object.values(d.seExp||{}).reduce((a,v)=>a+(+v||0),0);
  const seNet=Math.max(0,(d.seInc||0)-seExpTotal);
  const bizNet=Math.max(0,(d.bizRev||0)-(d.bizPay||0)-bizExpTotal);
  const bizPT=d.bizSal?0:bizNet;
  const totalSE=seNet+bizPT;
  const seTax=totalSE>400?totalSE*0.9235*0.153:0;
  const capGainST=d.capGainST||0;  // short-term: ordinary income rates
  const capGainLT=d.capGainLT||0;  // long-term: preferential rates (0/15/20%)
  const gross=(d.w2||0)+(d.sw2||0)+totalSE+(d.otherInc||0)+capGainST+capGainLT;
  const adj=Math.min(d.r401k||0,Y.r401kMax)+Math.min(d.ira||0,Y.iraMax)+Math.min(d.hsa||0,Y.hsaMax.family)+Math.min(d.sloan||0,Y.slanMax)+seTax*0.5+(d.seHI||0);
  // Age 65+ bonus standard deduction
  const a65bonus = d.age==='65plus' ? (fs==='mfj'?Y.age65Bonus.mfj:Y.age65Bonus.single) : 0;
  // 2026 NEW: OBBBA senior deduction ($6k for 65+, simplified - full phase-out ignored for estimator)
  const seniorDed = (d.age==='65plus' && Y.seniorDeduction>0) ? Y.seniorDeduction : 0;
  const qbi=totalSE>0?Math.max(0,totalSE*0.2):0;
  const agi=Math.max(0,gross-adj);
  const sd=(sdMap[fs]||sdMap.single)+a65bonus;
  const item=(d.mortInt||0)+Math.min(d.salt||0,Y.saltCap)+(d.charity||0);
  const useItem=item>sd;
  const ded=Math.max(sd,item)+qbi+seniorDed;
  const taxable=Math.max(0,agi-ded);
  const bkts=bk[fs]||bk.single;
  // Ordinary income tax (excludes LTCG which gets preferential rates)
  const ordinaryTaxable=Math.max(0,taxable-capGainLT);
  let fT=0,mg=.10;
  for(const[lo,hi,r]of bkts){if(ordinaryTaxable>lo){fT+=Math.min(ordinaryTaxable-lo,hi-lo)*r;mg=r;}}
  // Long-term capital gains tax (preferential rates)
  const ltcgBrackets={single:[[0,47025,0],[47025,518900,.15],[518900,9e8,.20]],mfj:[[0,94050,0],[94050,583750,.15],[583750,9e8,.20]],hoh:[[0,63000,0],[63000,551350,.15],[551350,9e8,.20]],mfs:[[0,47025,0],[47025,291850,.15],[291850,9e8,.20]]};
  const ltcgBkts=ltcgBrackets[fs]||ltcgBrackets.single;
  let ltcgTax=0;
  if(capGainLT>0){
    // LTCG stacks on top of ordinary income for rate determination
    const ltcgBase=ordinaryTaxable;
    const ltcgTop=ltcgBase+capGainLT;
    for(const[lo,hi,r]of ltcgBkts){
      if(ltcgTop>lo&&ltcgBase<hi){
        const gain=Math.min(ltcgTop,hi)-Math.max(ltcgBase,lo);
        ltcgTax+=gain*r;
      }
    }
  }
  fT+=ltcgTax;
  let cr=(d.kids||0)*Y.ctc;
  if((d.ccAmt||0)>0)cr+=Math.min(d.ccAmt,(d.kids||0)>=2?6000:3000)*.2;
  if((d.edu||0)>0)cr+=Math.min(d.edu,10000)*.25;
  const uC=Math.min(cr,fT);
  const nF=Math.max(0,fT-uC);
  const stT=calcStateTax(agi,d.st,fs,year);
  const nycT=(d.nycResident&&d.st==='NY')?agi*0.034:0; // NYC avg 3.4%
  const stTfinal=stT+nycT;
  const tot=nF+seTax+stTfinal;
  const paid=(d.wh||0)+(d.estP||0);
  return{gross,agi,taxable,fT,nF,uC,seTax,stT:stTfinal,tot,paid,res:tot-paid,eff:gross>0?tot/gross:0,mg,sd,item,useItem,ded,adj,seNet,bizNet,seniorDed,a65bonus};
}

function getCx(d){
  let s=0;
  if(d.wt?.includes('biz'))s+=3;if(d.bizEntity==='scorp'||d.bizEntity==='ccorp')s+=3;else if(d.bizEntity==='partner')s+=2;if(d.bizEmp)s+=1;
  if(d.wt?.includes('se'))s+=2;if((d.wt?.length||0)>1)s+=1;
  if(d.home)s+=1;if((d.kids||0)>0)s+=1;if(d.fs==='mfj'&&(d.sw2||0)>0)s+=1;
  if(s<=1)return{level:'low',label:'Low',color:'#14803D',bg:'#DCFCE7',desc:'Simple — a free DIY tool handles this easily.'};
  if(s<=4)return{level:'med',label:'Medium',color:'#A16207',bg:'#FEF9C3',desc:'A few moving parts — the right tool makes it easy.'};
  if(s<=7)return{level:'high',label:'High',color:'#C2410C',bg:'#FFEDD5',desc:'Worth getting a second set of eyes on this.'};
  return{level:'vhigh',label:'Complex',color:'#B91C1C',bg:'#FEE2E2',desc:'A pro could save you more than they cost.'};
}
function gFC(cx,p){const t={diy:{low:'$0–$30',med:'$0–$100',high:'$50–$150',vhigh:'$100–$200'},assist:{low:'$50–$150',med:'$100–$300',high:'$200–$450',vhigh:'$300–$550'},pro:{low:'$150–$300',med:'$250–$500',high:'$400–$900',vhigh:'$600–$2,000+'}};return t[p]?.[cx.level]||'—';}
const fm=(n,s)=>{if(n==null)return'—';const a=Math.abs(Math.round(n));if(s&&a>=1000)return`$${Math.round(a/1000)}k`;return`$${a.toLocaleString()}`};
const D0={wt:[],st:'',age:'',fs:'single',w2:0,sw2:0,wh:0,seInc:0,seV:0,seH:0,seE:0,seO:0,seExp:{},estP:0,bizSal:false,bizOnly:true,bizReg:false,bizEmp:false,bizEntity:null,bizRev:0,bizPay:0,bizDesc:'',bizExp:{},bizTypeId:null,r401k:0,ira:0,hsa:0,sloan:0,seHI:0,kids:0,cc:false,ccAmt:0,home:false,mort:false,mortInt:0,salt:0,charity:0,edu:0,otherInc:0,capGainLT:0,capGainST:0,nycResident:false};
const OP0={work:true,hh:true,inc:true,sav:true,ded:true};

// ─── UI ATOMS ─────────────────────────────────────────────────────
function Tog({on,onChange}){return(<label style={{position:'relative',display:'inline-flex',width:40,height:22,cursor:'pointer',flexShrink:0}}><input type="checkbox" checked={on} onChange={e=>onChange(e.target.checked)} style={{opacity:0,width:0,height:0}}/><span style={{position:'absolute',inset:0,background:on?'var(--coral)':'var(--border2)',borderRadius:11,transition:'background .2s'}}><span style={{position:'absolute',width:16,height:16,borderRadius:'50%',background:'white',top:3,left:on?'calc(100% - 19px)':3,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/></span></label>);}
function Chip({children,color='var(--coral)',bg='var(--coral-lt)'}){return <span style={{display:'inline-flex',alignItems:'center',gap:3,background:bg,color,borderRadius:100,padding:'2px 7px',fontSize:'.68rem',fontWeight:700,lineHeight:1.5,whiteSpace:'nowrap'}}>{children}</span>;}

function Sld({label,val,min,max,step=500,onChange,tip}){
  const[edit,setEdit]=useState(false);
  const[raw,setRaw]=useState('');
  const pct=max>min?Math.min(100,Math.max(0,Math.round(((val-min)/(max-min))*100))):0;
  const commit=()=>{const n=parseInt((raw||'').replace(/[^0-9]/g,''),10);if(!isNaN(n))onChange(Math.min(max,Math.max(min,n)));setEdit(false);};
  return(<div style={{display:'flex',flexDirection:'column',gap:6}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
      <span style={{fontSize:'.8rem',fontWeight:600,color:'var(--ink2)',flex:1,lineHeight:1.35}}>{label}</span>
      {edit?(<div style={{display:'flex',alignItems:'center',gap:3}}><span style={{fontSize:'.875rem',color:'var(--ink3)'}}>$</span><input type="number" value={raw} onChange={e=>setRaw(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')commit();if(e.key==='Escape')setEdit(false);}} autoFocus style={{width:88,padding:'3px 6px',border:'1.5px solid var(--coral)',borderRadius:6,fontSize:'.9rem',fontWeight:700,outline:'none',textAlign:'right'}}/><button onClick={commit} style={{background:'var(--coral)',color:'white',border:'none',borderRadius:6,padding:'3px 8px',fontSize:'.7rem',fontWeight:700,cursor:'pointer'}}>✓</button></div>
      ):(<button onClick={()=>{setRaw(String(val));setEdit(true);}} title="Click to enter exact number" style={{display:'flex',alignItems:'center',gap:4,background:'none',border:'1px solid var(--border2)',borderRadius:7,padding:'3px 9px',cursor:'pointer',color:'var(--ink)',transition:'all .14s',whiteSpace:'nowrap',flexShrink:0}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--coral)';e.currentTarget.style.color='var(--coral)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--ink)';}}>
        <span style={{fontFamily:'var(--fs)',fontSize:'.95rem',fontWeight:600}}>{fm(val)}</span><Edit2 size={10} style={{color:'var(--ink3)'}}/>
      </button>)}
    </div>
    <div style={{padding:'3px 0'}}><input type="range" min={min} max={max} step={step} value={val} onChange={e=>onChange(+e.target.value)} style={{background:`linear-gradient(90deg,var(--coral) ${pct}%,var(--track) ${pct}%)`}}/></div>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:'.68rem',fontWeight:500,color:'var(--ink3)'}}><span>{fm(min,true)}</span><span>{fm(max,true)}</span></div>
    {tip&&<div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'7px 10px',display:'flex',gap:7,alignItems:'flex-start'}}><Info size={12} style={{color:'#92400E',flexShrink:0,marginTop:1}}/><span style={{fontSize:'.74rem',color:'#78350F',lineHeight:1.6}}>{tip}</span></div>}
  </div>);
}

function TileG({opts,val,onChange,multi=false,cols=2,sm=false,hint}){
  const sel=v=>multi?(val||[]).includes(v):val===v;
  const h=v=>{if(multi){const a=val||[];onChange(sel(v)?a.filter(x=>x!==v):[...a,v]);}else onChange(v);};
  return(<div>{hint&&<div style={{fontSize:'.73rem',color:'var(--ink3)',marginBottom:5,fontWeight:500}}>{hint}</div>}<div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:5}}>{opts.map(o=>{const a=sel(o.v);const Ic=o.Icon;return(<button key={o.v} onClick={()=>h(o.v)} style={{background:a?'var(--coral-lt)':'var(--white)',border:`1.5px solid ${a?'var(--coral)':'var(--border)'}`,borderRadius:'var(--r-lg)',padding:sm?'8px 7px':'10px 8px',cursor:'pointer',textAlign:'center',transition:'all .14s',boxShadow:a?'0 0 0 3px rgba(224,78,26,.09)':'var(--sh-xs)',display:'flex',flexDirection:'column',alignItems:'center',gap:3}} onMouseEnter={e=>{if(!a){e.currentTarget.style.borderColor='var(--coral)';e.currentTarget.style.background='var(--coral-lt)';}}} onMouseLeave={e=>{if(!a){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--white)';}}}>{Ic&&<Ic size={sm?15:17} style={{color:a?'var(--coral)':'var(--ink2)',strokeWidth:1.75}}/>}<span style={{fontWeight:700,fontSize:sm?'.75rem':'.82rem',color:a?'var(--coral)':'var(--ink)',lineHeight:1.25}}>{o.label}</span>{o.sub&&<span style={{fontSize:'.64rem',color:a?'var(--coral)':'var(--ink3)',lineHeight:1.3}}>{o.sub}</span>}</button>);})}</div></div>);
}
function TR({label,sub,checked,onChange}){return(<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,padding:'9px 11px',background:'var(--bg)',borderRadius:'var(--r)'}}><div><div style={{fontWeight:600,fontSize:'.84rem'}}>{label}</div>{sub&&<div style={{fontSize:'.71rem',color:'var(--ink3)',marginTop:1}}>{sub}</div>}</div><Tog on={checked} onChange={onChange}/></div>);}
function Stp({val,min=0,max=10,onChange,label}){return(<div style={{display:'flex',flexDirection:'column',gap:5}}>{label&&<span style={{fontSize:'.79rem',fontWeight:600,color:'var(--ink2)'}}>{label}</span>}<div style={{display:'inline-flex',alignItems:'center',border:'1.5px solid var(--border)',borderRadius:'var(--r)',overflow:'hidden',width:'fit-content'}}><button onClick={()=>onChange(Math.max(min,val-1))} style={{background:'none',border:'none',padding:'6px 13px',fontSize:'1.1rem',cursor:'pointer',transition:'background .14s'}} onMouseEnter={e=>e.target.style.background='var(--bg)'} onMouseLeave={e=>e.target.style.background='none'}>−</button><span style={{padding:'6px 16px',fontWeight:700,fontSize:'1.1rem',fontFamily:'var(--fs)',minWidth:44,textAlign:'center'}}>{val}</span><button onClick={()=>onChange(Math.min(max,val+1))} style={{background:'none',border:'none',padding:'6px 13px',fontSize:'1.1rem',cursor:'pointer',transition:'background .14s'}} onMouseEnter={e=>e.target.style.background='var(--bg)'} onMouseLeave={e=>e.target.style.background='none'}>+</button></div></div>);}
function Bx({children}){return <div style={{background:'var(--bg)',border:'1px dashed var(--border2)',borderRadius:'var(--r)',padding:'.875rem',display:'flex',flexDirection:'column',gap:'.875rem'}}>{children}</div>;}

function DCard({id,title,sub,Icon,open,onToggle,done,children,required,optional}){
  const ac=done?'var(--teal)':open?(optional?'#94A3B8':'var(--coral)'):'var(--border)';
  const shadow=done?'0 0 0 3px rgba(11,122,109,.05)':open?(optional?'0 2px 8px rgba(0,0,0,.05)':'0 0 0 4px rgba(224,78,26,.07)'):'var(--sh-xs)';
  const bg=open&&optional&&!done?'#FAFAF8':'var(--white)';
  return(<div id={id} style={{background:bg,borderRadius:'var(--r-xl)',border:`1.5px solid ${ac}`,overflow:'hidden',transition:'all .22s',boxShadow:shadow}}><button onClick={onToggle} style={{width:'100%',background:'none',border:'none',padding:'1rem 1.125rem',display:'flex',alignItems:'center',gap:9,cursor:'pointer',textAlign:'left',transition:'background .13s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,.015)'} onMouseLeave={e=>e.currentTarget.style.background='none'}><div style={{width:28,height:28,borderRadius:'50%',background:done?'var(--teal)':open?(optional?'#EAE6E1':'var(--coral)'):'var(--bg)',border:`1.5px solid ${ac}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .2s'}}>{done?<Check size={14} style={{color:'white',strokeWidth:2.5}}/>:<Icon size={13} style={{color:open?(optional?'var(--ink2)':'white'):'var(--ink2)',strokeWidth:1.75}}/>}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:'.875rem',color:done?'var(--ink)':open?(optional?'var(--ink2)':'var(--coral)'):'var(--ink)',display:'flex',alignItems:'center',gap:5}}>{title}{required&&!done&&<span style={{fontSize:'.62rem',background:'var(--coral)',color:'white',borderRadius:100,padding:'1px 6px',fontWeight:700}}>Required</span>}{optional&&!done&&<span style={{fontSize:'.62rem',background:open?'#EFF6FF':'var(--bg)',color:open?'#3B82F6':'var(--ink3)',borderRadius:100,padding:'1px 6px',fontWeight:600,border:`1px solid ${open?'#BFDBFE':'var(--border)'}`}}>Optional</span>}</div><div style={{fontSize:'.72rem',fontWeight:500,color:'var(--ink3)',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sub}</div></div>{done&&!open&&<Chip color='var(--teal)' bg='var(--teal-lt)'><Check size={9} style={{strokeWidth:2.5}}/>Done</Chip>}<ChevronDown size={15} style={{color:'var(--ink3)',transition:'transform .22s',transform:open?'rotate(180deg)':'none',flexShrink:0}}/></button><div style={{overflow:'hidden',maxHeight:open?'5000px':'0',transition:'max-height .4s cubic-bezier(.4,0,.2,1)'}}><div style={{padding:'0 1.125rem 1.375rem',display:'flex',flexDirection:'column',gap:'1rem'}}>{open&&children}</div></div></div>);
}

// ─── BIZ SECTION ──────────────────────────────────────────────────
function BizSection({d,upd}){
  const[catFilter,setCatFilter]=useState(null);
  const detected=useMemo(()=>detectBizType(d.bizDesc),[d.bizDesc]);
  const active=BIZ_TYPES.find(b=>b.id===d.bizTypeId)||detected;
  const bizExpTotal=Object.values(d.bizExp||{}).reduce((a,v)=>a+(+v||0),0);
  // Entity label driven by direct selection (bizEntity field)
  const ENTITY_INFO = {
    sole_prop: { label:'Sole Proprietor / Schedule C', tax:'Income on your personal return (Schedule C). SE tax applies on net profit.', complexity:'Low' },
    smllc:     { label:'Single-Member LLC', tax:'Taxed like a sole prop by default (disregarded entity). Income on Schedule C unless you elect S-Corp status.', complexity:'Low–Medium' },
    scorp:     { label:'S-Corporation', tax:'Two returns required: Form 1120-S for the business + personal 1040. You must pay yourself a reasonable salary (W-2) and take remaining profit as distributions.', complexity:'High' },
    partner:   { label:'Partnership / Multi-Member LLC', tax:'Business files Form 1065. Partners receive K-1s and report their share on personal returns.', complexity:'High' },
    ccorp:     { label:'C-Corporation', tax:'Double taxation: corp pays tax on profits (Form 1120), then you pay personal tax on dividends or salary. Most small businesses avoid this structure.', complexity:'Very High' },
    not_sure:  { label:'Not sure yet', tax:"Answer a few more questions and we'll give you our best read.", complexity:'Unknown' },
  };
  const entityInfo = ENTITY_INFO[d.bizEntity] || null;
  const entityLabel = entityInfo ? entityInfo.label : null;

  const filtered=catFilter?BIZ_TYPES.filter(b=>b.cat===catFilter):BIZ_TYPES;

  return(<div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
    <div>
      <label style={{fontSize:'.8rem',fontWeight:700,color:'var(--ink2)',marginBottom:5,display:'block'}}>What does your business do? <span style={{fontWeight:400,color:'var(--ink3)'}}>(type it — we'll find the right deductions)</span></label>
      <input type="text" value={d.bizDesc||''} onChange={e=>{upd('bizDesc',e.target.value);upd('bizTypeId',null);}} placeholder="e.g. rideshare driver, photographer, restaurant, painter, nurse..." style={{width:'100%',padding:'10px 13px',border:'1.5px solid var(--border)',borderRadius:'var(--r)',fontSize:'.875rem',outline:'none',transition:'border-color .15s',background:'var(--white)'}} onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
      {detected&&!d.bizTypeId&&<div style={{marginTop:6,padding:'7px 11px',background:'var(--coral-lt)',borderRadius:'var(--r)',display:'flex',alignItems:'center',gap:7,justifyContent:'space-between',flexWrap:'wrap'}}><span style={{fontSize:'.74rem',color:'var(--coral)',fontWeight:600}}>Detected: <strong>{detected.label}</strong></span><button onClick={()=>upd('bizTypeId',detected.id)} style={{background:'var(--coral)',color:'white',border:'none',borderRadius:100,padding:'3px 10px',fontSize:'.71rem',fontWeight:700,cursor:'pointer',flexShrink:0}}>Use this ✓</button></div>}
    </div>
    {!active&&d.bizDesc.length>2&&(
      <div>
        <div style={{fontSize:'.75rem',color:'var(--ink3)',marginBottom:6}}>Can't find it automatically? Browse by category:</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
          <button onClick={()=>setCatFilter(null)} style={{background:!catFilter?'var(--ink)':'var(--white)',color:!catFilter?'white':'var(--ink2)',border:'1px solid var(--border)',borderRadius:100,padding:'3px 10px',fontSize:'.71rem',fontWeight:600,cursor:'pointer'}}>All</button>
          {BIZ_CATS.map(cat=><button key={cat} onClick={()=>setCatFilter(cat===catFilter?null:cat)} style={{background:catFilter===cat?'var(--ink)':'var(--white)',color:catFilter===cat?'white':'var(--ink2)',border:'1px solid var(--border)',borderRadius:100,padding:'3px 10px',fontSize:'.71rem',fontWeight:600,cursor:'pointer',transition:'all .13s'}}>{cat}</button>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:4,maxHeight:200,overflowY:'auto'}}>
          {filtered.map(bt=>{const Ic=bt.icon;return(<button key={bt.id} onClick={()=>{upd('bizTypeId',bt.id);setCatFilter(null);}} style={{background:'var(--white)',border:'1.5px solid var(--border)',borderRadius:'var(--r)',padding:'7px 8px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:'.73rem',fontWeight:600,transition:'all .13s',textAlign:'left'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--coral)';e.currentTarget.style.background='var(--coral-lt)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--white)';}}>
            <Ic size={12} style={{color:'var(--ink2)',flexShrink:0}}/><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{bt.label.split('/')[0].trim()}</span>
          </button>);})}
        </div>
      </div>
    )}
    <div style={{fontWeight:700,fontSize:'.79rem',color:'var(--ink2)'}}>Your business setup:</div>
    <div>
      <label style={{fontSize:'.8rem',fontWeight:700,color:'var(--ink2)',marginBottom:6,display:'block'}}>What is your business structure?</label>
      <div style={{display:'flex',flexDirection:'column',gap:5}}>
        {[
          {v:'sole_prop', label:'Sole Proprietor / Schedule C', sub:'Just you, no formal business entity — most freelancers & contractors'},
          {v:'smllc',     label:'Single-Member LLC', sub:'You formed an LLC with just yourself as the owner'},
          {v:'scorp',     label:'S-Corporation', sub:'You elected S-Corp status and pay yourself a W-2 salary'},
          {v:'partner',   label:'Partnership / Multi-Member LLC', sub:'2+ owners sharing profits via K-1s'},
          {v:'ccorp',     label:'C-Corporation', sub:'Separate taxable entity (Form 1120) — uncommon for small biz'},
          {v:'not_sure',  label:"I'm not sure", sub:"We'll make our best estimate based on your other answers"},
        ].map(o=>{
          const sel=d.bizEntity===o.v;
          return(<button key={o.v} onClick={()=>upd('bizEntity',o.v)} style={{background:sel?'var(--teal-lt)':'var(--white)',border:`1.5px solid ${sel?'var(--teal)':'var(--border)'}`,borderRadius:'var(--r)',padding:'9px 12px',cursor:'pointer',textAlign:'left',transition:'all .13s',boxShadow:sel?'0 0 0 3px rgba(11,122,109,.06)':'none'}} onMouseEnter={e=>{if(!sel){e.currentTarget.style.borderColor='var(--teal)';e.currentTarget.style.background='var(--teal-lt)';}}} onMouseLeave={e=>{if(!sel){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--white)';}}} >
            <div style={{fontWeight:700,fontSize:'.83rem',color:sel?'var(--teal)':'var(--ink)'}}>{o.label}</div>
            <div style={{fontSize:'.71rem',color:sel?'var(--teal)':'var(--ink3)',marginTop:2}}>{o.sub}</div>
          </button>);
        })}
      </div>
    </div>
    {entityInfo&&<div style={{background:entityInfo.complexity==='High'||entityInfo.complexity==='Very High'?'#FFFBEB':'var(--teal-lt)',border:`1.5px solid ${entityInfo.complexity==='High'||entityInfo.complexity==='Very High'?'#FDE68A':'var(--teal)'}`,borderRadius:'var(--r-lg)',padding:'10px 13px'}}>
      <div style={{fontWeight:700,fontSize:'.82rem',color:entityInfo.complexity==='High'||entityInfo.complexity==='Very High'?'var(--gold)':'var(--teal)',marginBottom:3}}>{entityInfo.label} — Tax treatment</div>
      <div style={{fontSize:'.73rem',color:'var(--ink2)',lineHeight:1.65}}>{entityInfo.tax}</div>
      <div style={{marginTop:5,fontSize:'.68rem',fontWeight:600,color:'var(--ink3)'}}>Filing complexity: {entityInfo.complexity}</div>
    </div>}
    <TR label="Do you have W-2 employees?" checked={d.bizEmp} onChange={v=>upd('bizEmp',v)}/>
    <Sld label="Annual business revenue" val={d.bizRev} min={0} max={20000000} step={50000} onChange={v=>upd('bizRev',v)}/>
    <Sld label="Payroll (employees + your own salary if on W-2)" val={d.bizPay} min={0} max={10000000} step={50000} onChange={v=>upd('bizPay',v)}/>
    {active&&(<div>
      <div style={{background:'linear-gradient(135deg,var(--coral-lt),var(--bg))',border:'1.5px solid var(--coral-md)',borderRadius:'var(--r-lg)',padding:'9px 13px',marginBottom:9}}>
        <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}>{(()=>{const Ic=active.icon;return <Ic size={13} style={{color:'var(--coral)',strokeWidth:2}}/>;})()}<div style={{fontWeight:700,fontSize:'.83rem',color:'var(--coral)'}}>Common deductions for {active.label}</div></div>
        <div style={{fontSize:'.72rem',color:'var(--ink2)'}}>Add only what applies — document everything you claim.</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {active.expenses.map(ex=><Sld key={ex.k} label={ex.l} val={+(d.bizExp||{})[ex.k]||0} min={0} max={ex.max} step={Math.max(50,Math.round(ex.max/60)*50)} onChange={v=>upd('bizExp',{...d.bizExp,[ex.k]:v})} tip={ex.tip}/>)}
      </div>
      {bizExpTotal>0&&<div style={{marginTop:9,background:'var(--teal-lt)',borderRadius:'var(--r)',padding:'7px 11px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontWeight:600,fontSize:'.78rem',color:'var(--teal)'}}>Total deductions entered</span><span style={{fontFamily:'var(--fs)',fontSize:'1rem',fontWeight:700,color:'var(--teal)'}}>{fm(bizExpTotal)}</span></div>}
      <div style={{marginTop:7,padding:'6px 9px',background:'var(--bg)',borderRadius:'var(--r)',fontSize:'.72rem',color:'var(--ink3)',display:'flex',gap:5,alignItems:'flex-start'}}><Info size={11} style={{flexShrink:0,marginTop:1}}/>There may be more deductions for your situation — a tax pro often finds more. This raises your complexity rating.</div>
    </div>)}
    <div style={{background:'var(--teal-lt)',borderRadius:'var(--r)',padding:'7px 11px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontWeight:600,fontSize:'.78rem',color:'var(--teal)'}}>Net business income (est.)</span><span style={{fontFamily:'var(--fs)',fontSize:'1rem',fontWeight:700,color:'var(--teal)'}}>{fm(Math.max(0,(d.bizRev||0)-(d.bizPay||0)-Object.values(d.bizExp||{}).reduce((a,v)=>a+(+v||0),0)))}</span></div>
  </div>);
}

// ─── RESULTS DRAWER ───────────────────────────────────────────────
function ResultsDrawer({calc,calc26,yearDiff,bigDiff,data,onClose,closing=false}){
  const[comfort,setComfort]=useState(5);
  const[openPath,setOpenPath]=useState(null);
  const cx=getCx(data);
  const isR=calc.res<=-1,isO=calc.res>=1;
  const amt=Math.abs(calc.res);
  const mainC=isR?'var(--teal)':isO&&amt>3000?'var(--red)':'var(--gold)';
  const autoP=comfort<=3?'pro':comfort<=6?'assist':'diy';
  const PRODS=mkProds(cx.level);
  const prods4=pid=>pid==='diy'?(cx.level==='low'?PRODS.diy_low:cx.level==='vhigh'||cx.level==='high'?PRODS.diy_high:PRODS.diy_med):pid==='assist'?PRODS.assist:PRODS.pro;
  const PATHS=[{id:'diy',Icon:Laptop,t:"I've got this — I'll do it myself",desc:"I'm comfortable using tax software on my own."},{id:'assist',Icon:Star,t:'I want a pro to check my work',desc:"I'll fill it in — then an expert reviews before I file."},{id:'pro',Icon:Briefcase,t:'Just take care of it for me',desc:"I'd rather hand everything to a professional."}];
  const chartD=[{n:'Gross',v:calc.gross,c:'#93C5FD'},{n:'After Adj.',v:calc.agi,c:'#6EE7B7'},{n:'Taxable',v:calc.taxable,c:'#FCA5A5'},{n:'Total Tax',v:calc.tot,c:'#FCD34D'}].filter(x=>x.v>0);
  return(<div style={{background:'var(--white)',borderTop:'3px solid var(--coral)',maxHeight:'88vh',overflowY:'auto',animation:closing?'drawerDown .4s cubic-bezier(.4,0,1,1) both':'drawerUp 1.1s cubic-bezier(.16,1,.3,1) both'}} onWheel={e=>e.stopPropagation()} onTouchMove={e=>e.stopPropagation()}>
    <div style={{maxWidth:900,margin:'0 auto',padding:'1.5rem 1.5rem 3rem'}}>
      {/* Sticky close header */}
      <div style={{position:'sticky',top:0,zIndex:10,background:'var(--white)',borderBottom:'1px solid var(--border)',padding:'.875rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
        <div style={{fontWeight:800,fontSize:'1rem',display:'flex',alignItems:'center',gap:6}}><Target size={16} style={{color:'var(--coral)'}}/>Your Full Tax Estimate</div>
        <button onClick={onClose} aria-label="Close" style={{width:32,height:32,borderRadius:'50%',background:'var(--bg)',border:'1.5px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',flexShrink:0}} onMouseEnter={e=>{e.currentTarget.style.background='var(--ink)';e.currentTarget.style.color='white';e.currentTarget.style.borderColor='var(--ink)';e.currentTarget.querySelector('svg').style.stroke='white';}} onMouseLeave={e=>{e.currentTarget.style.background='var(--bg)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.querySelector('svg').style.stroke='var(--ink2)';}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink2)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style={{textAlign:'center',padding:'1.25rem',background:isR?'#F0FDF4':isO&&amt>1500?'#FEF2F2':'#FEFCE8',borderRadius:'var(--r-xl)',marginBottom:'1.25rem',border:`1.5px solid ${isR?'#86EFAC':isO&&amt>1500?'#FECACA':'#FDE68A'}`}}>
        <div style={{fontSize:'.64rem',fontWeight:700,color:mainC,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:4}}>{isR?'Estimated Refund 🎉':isO?'Estimated Balance Due':'≈ Break Even'}</div>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',gap:1}}>
          <span style={{fontSize:'1.3rem',fontWeight:800,color:mainC,opacity:.45,marginTop:5,fontFamily:'var(--f)'}}>~</span>
          <div style={{fontFamily:'var(--fs)',fontSize:'clamp(2.5rem,7vw,4rem)',fontWeight:400,color:mainC,lineHeight:1}}>{isR&&'+'}{isO&&'−'}{fm(amt)}</div>
        </div>
        <div style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(0,0,0,.05)',borderRadius:100,padding:'3px 11px',marginTop:6,fontSize:'.73rem',color:mainC,fontWeight:600}}><TrendingUp size={10}/>Range: {isR&&'+'}{isO&&'−'}~{fm(amt*.87,true)} – {fm(amt*1.13,true)}</div>
        <div style={{color:mainC,opacity:.5,fontSize:'.72rem',marginTop:4}}>Eff. rate: {(calc.eff*100).toFixed(1)}% · Top bracket: {Math.round(calc.mg*100)}% · Sandbox estimate only</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'1rem',marginBottom:'1.25rem'}}>
        <div style={{background:'var(--bg)',borderRadius:'var(--r-xl)',padding:'1rem'}}><div style={{fontWeight:700,fontSize:'.84rem',marginBottom:'.875rem'}}>Income flow</div><ResponsiveContainer width="100%" height={130}><BarChart data={chartD} margin={{top:0,right:0,left:0,bottom:0}}><XAxis dataKey="n" tick={{fontSize:10,fill:'#ADA59B',fontFamily:'Plus Jakarta Sans'}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip formatter={v=>[fm(v),'Amount']} contentStyle={{fontFamily:'Plus Jakarta Sans',borderRadius:8,border:'1px solid var(--border)',fontSize:'.77rem'}}/><Bar dataKey="v" radius={[4,4,0,0]}>{chartD.map((e,i)=><Cell key={i} fill={e.c}/>)}</Bar></BarChart></ResponsiveContainer></div>
        <div style={{background:'var(--bg)',borderRadius:'var(--r-xl)',padding:'1rem'}}><div style={{fontWeight:700,fontSize:'.84rem',marginBottom:'.875rem'}}>Tax breakdown</div>{(()=>{
  const rows=[
    ['Federal Tax',fm(calc.nF),'#EF4444'],
    NT.has(data.st)?['State Tax','$0 🎉','#14803D']:['State Tax',fm(calc.stT),'#EF4444'],
    calc.seTax>0?['SE Tax',fm(calc.seTax),'#F59E0B']:null,
    calc.uC>0?['Credits',`−${fm(calc.uC)}`,'#14803D']:null,
  ].filter(Boolean);
  return(<>
    {rows.map((r,i)=>(
      <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:'.78rem'}}>
        <span style={{color:'var(--ink2)'}}>{r[0]}</span>
        <span style={{fontWeight:500,color:r[2]}}>{r[1]}</span>
      </div>
    ))}
    <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0 5px',fontSize:'.78rem',borderTop:'1px solid var(--border)',marginTop:4}}>
      <span style={{color:'var(--ink2)'}}>Total Tax</span>
      <span style={{fontWeight:700,fontFamily:'var(--fs)',color:'var(--ink)'}}>{fm(calc.tot)}</span>
    </div>
    {calc.paid>0&&<div style={{display:'flex',justifyContent:'space-between',padding:'5px 0',fontSize:'.78rem'}}>
      <span style={{color:'var(--ink2)'}}>Paid Already</span>
      <span style={{fontWeight:500,color:'#14803D'}}>−{fm(calc.paid)}</span>
    </div>}
  </>);
})()}
<div style={{marginTop:8,paddingTop:7,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:'.69rem',color:'var(--ink3)'}}>Complexity</span><Chip color={cx.color} bg={cx.bg}>{cx.label}</Chip></div>{!NT.has(data.st)&&<div style={{marginTop:6,fontSize:'.67rem',color:'var(--ink3)',lineHeight:1.5,fontStyle:'italic'}}>⚠ State tax is estimated using a single effective rate. Graduated brackets, local taxes, and state-specific credits are not modeled.</div>}</div>
      </div>
      <div style={{background:'var(--bg)',borderRadius:'var(--r-xl)',padding:'1.25rem',marginBottom:'1rem'}}>
        <div style={{fontWeight:700,fontSize:'.875rem',marginBottom:3}}>How confident do you feel about filing?</div>
        <div style={{fontSize:'.78rem',color:'var(--ink2)',marginBottom:'1rem'}}>Drag to set your level — we'll suggest the right approach.</div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'1.75rem',flexShrink:0}}>{comfort<=2?'😰':comfort<=4?'😟':comfort<=6?'😐':comfort<=8?'🙂':'😎'}</span>
          <div style={{flex:1}}><input type="range" min={1} max={10} value={comfort} onChange={e=>setComfort(+e.target.value)} style={{background:`linear-gradient(90deg,var(--coral) ${(comfort-1)/9*100}%,var(--track) ${(comfort-1)/9*100}%)`}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:'.68rem',fontWeight:500,color:'var(--ink3)',marginTop:3}}><span>Need help</span><span>Totally got this</span></div></div>
        </div>
      </div>
      <div>
        {/* ── FILING SECTION CARD ── */}
        <div style={{background:'linear-gradient(135deg,var(--teal-lt),var(--white))',borderRadius:'var(--r-xl)',border:'1.5px solid var(--teal)',padding:'1.25rem',marginTop:'.25rem',boxShadow:'0 0 0 4px rgba(11,122,109,.05)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1.5px solid rgba(11,122,109,.2)'}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 2px 8px rgba(11,122,109,.25)'}}><Briefcase size={15} style={{color:'white',strokeWidth:2}}/></div>
          <div>
            <div style={{fontWeight:800,fontSize:'.95rem',color:'var(--teal)'}}>How do you want to file?</div>
            <div style={{fontSize:'.75rem',fontWeight:500,color:'var(--ink2)',marginTop:1}}>Choose your style — we'll show the best tools for each.</div>
          </div>
        </div>
        <div style={{background:'var(--gold-lt)',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'7px 10px',fontSize:'.73rem',color:'#78350F',marginBottom:'.625rem',lineHeight:1.6,display:'flex',gap:6,alignItems:'flex-start'}}><Info size={11} style={{flexShrink:0,marginTop:1}}/><span><strong>About costs:</strong> These are avg. ranges for what software charges <em>to prepare your return</em> — not additional taxes owed. DIY avg. <strong>{gFC(cx,'diy')}</strong> · Full service avg. <strong>{gFC(cx,'pro')}</strong></span></div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {PATHS.map(p=>{const isSuggested=autoP===p.id;const isOpen=openPath===p.id;const prods=prods4(p.id);return(<div key={p.id} style={{border:`1.5px solid ${isOpen?'var(--teal)':'var(--border)'}`,borderRadius:'var(--r-xl)',overflow:'hidden',background:isOpen?'var(--teal-lt)':'var(--white)',transition:'all .17s',boxShadow:isOpen?'0 0 0 3px rgba(11,122,109,.07)':'var(--sh-xs)'}}><button onClick={()=>{const newPath=openPath===p.id?null:p.id;setOpenPath(newPath);if(newPath)track('filing_path_selected',{path:p.id,is_suggested:isSuggested,complexity:cx.level});}} style={{width:'100%',background:'none',border:'none',padding:'.875rem 1.1rem',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:9,justifyContent:'space-between'}}><div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}><p.Icon size={15} style={{color:isOpen?'var(--teal)':'var(--ink2)',flexShrink:0,strokeWidth:1.75}}/><div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:'.875rem',color:isOpen?'var(--teal)':'var(--ink)',display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>{p.t}{isSuggested&&<Chip color='#7C3AED' bg='#EDE9FE'>✦ Suggested</Chip>}</div><div style={{fontSize:'.75rem',fontWeight:500,color:'var(--ink2)',marginTop:1}}>{p.desc}</div></div></div><div style={{textAlign:'right',flexShrink:0,marginLeft:8}}><div style={{fontWeight:700,color:'var(--teal)',fontSize:'.83rem',whiteSpace:'nowrap'}}>{gFC(cx,p.id)}</div><div style={{fontSize:'.6rem',color:'var(--ink3)',whiteSpace:'nowrap'}}>avg. cost</div><ChevronDown size={12} style={{color:'var(--ink3)',transition:'transform .2s',transform:isOpen?'rotate(180deg)':'none',marginTop:2}}/></div></button>
          <div style={{overflow:'hidden',maxHeight:isOpen?'3000px':'0',transition:'max-height .4s cubic-bezier(.4,0,.2,1)'}}>{isOpen&&(<div style={{borderTop:'1px solid rgba(11,122,109,.2)',padding:'.9rem 1.1rem 1.1rem'}}><div style={{fontSize:'.73rem',fontWeight:700,color:'var(--ink2)',marginBottom:7}}>Top picks for your situation:</div><div style={{display:'flex',flexDirection:'column',gap:6}}>{prods.map((pr,i)=>(<a key={i} href={pr.url} target="_blank" rel="noopener noreferrer" style={{background:'var(--white)',borderRadius:'var(--r-lg)',padding:'9px 12px',display:'flex',alignItems:'flex-start',gap:10,border:'1.5px solid var(--border)',transition:'all .14s',textDecoration:'none',color:'inherit'}} onClick={()=>track('product_clicked',{product:pr.n,path:p.id,rank:i+1,complexity:cx.level})} onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh)';e.currentTarget.style.transform='translateX(3px)';e.currentTarget.style.borderColor='var(--coral)';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='var(--border)';}}>
            <div style={{width:34,height:34,borderRadius:8,background:`${pr.c}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.15rem',flexShrink:0,border:`1px solid ${pr.c}22`,marginTop:1}}>{pr.em}</div>
            <div style={{flex:1,minWidth:0}}><div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginBottom:2}}><span style={{fontWeight:700,fontSize:'.83rem'}}>{pr.n}</span>{pr.badge&&<Chip color={pr.c} bg={`${pr.c}15`}>{pr.badge}</Chip>}</div><div style={{fontSize:'.71rem',color:'var(--ink3)',lineHeight:1.45}}>{pr.sub}</div>{i===0&&pr.detail&&<div style={{fontSize:'.69rem',color:'var(--ink2)',marginTop:4,lineHeight:1.5,fontStyle:'italic',borderTop:'1px solid rgba(11,122,109,.2)',paddingTop:4}}>{pr.detail}</div>}</div>
            <div style={{textAlign:'right',flexShrink:0,paddingLeft:8}}><div style={{fontWeight:700,color:'var(--teal)',fontSize:'.78rem',whiteSpace:'nowrap'}}>{pr.price}</div><div style={{fontSize:'.6rem',color:'var(--ink3)',marginTop:2,display:'flex',alignItems:'center',gap:2,justifyContent:'flex-end'}}><ArrowRight size={8}/>Visit</div></div>
          </a>))}</div></div>)}</div>
          </div>);})}
        </div>

        </div>{/* end filing card */}

        {/* 2026 PLANNING PANEL — standalone card */}
        {calc26&&calc.gross>0&&(
          <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'1.25rem',marginTop:'1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--border)'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <TrendingUp size={13} style={{color:'var(--ink2)'}}/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:'.875rem',color:'var(--ink2)'}}>Plan ahead for 2026</div>
                <div style={{fontSize:'.71rem',color:'var(--ink3)',marginTop:1}}>You're earning 2026 income right now — here's what changes.</div>
              </div>
            </div>
            {bigDiff&&(
              <div style={{background:'white',borderRadius:'var(--r)',padding:'10px 13px',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                <div style={{fontSize:'.79rem',color:'var(--ink2)'}}><strong>With 2026 tax rules, your estimate would be:</strong></div>
                <div style={{fontFamily:'var(--fs)',fontSize:'1.25rem',fontWeight:700,color:yearDiff<0?'var(--teal)':'var(--red)',flexShrink:0}}>
                  {yearDiff<0?`${fm(Math.abs(calc26.res))} refund`:`${fm(Math.abs(calc26.res))} owed`}
                  <span style={{fontSize:'.65rem',fontWeight:500,color:'var(--ink3)',marginLeft:5}}>({yearDiff<0?'+':'-'}{fm(Math.abs(yearDiff))} vs 2025)</span>
                </div>
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {TAX_DATA[2026].changes.map((c,i)=>(
                <div key={i} style={{background:'white',borderRadius:'var(--r)',padding:'8px 11px',display:'flex',gap:8,alignItems:'flex-start'}}>
                  <span style={{fontSize:'1rem',flexShrink:0,lineHeight:1.4}}>{c.icon}</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:'.79rem',color:'var(--ink2)'}}>{c.title}</div>
                    <div style={{fontSize:'.72rem',color:'var(--ink3)',marginTop:1,lineHeight:1.5}}>{c.detail}</div>
                  </div>
                </div>
              ))}
              {data.age==='65plus'&&(
                <div style={{background:'#ECFDF5',borderRadius:'var(--r)',padding:'8px 11px',display:'flex',gap:8,alignItems:'flex-start',border:'1px solid #86EFAC'}}>
                  <span style={{fontSize:'1rem',flexShrink:0}}>🎉</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:'.79rem',color:'#14803D'}}>You qualify for the new $6,000 Senior Deduction!</div>
                    <div style={{fontSize:'.72rem',color:'#15803D',marginTop:1,lineHeight:1.5}}>Brand new for 2026 (2025–2028): $6,000 additional deduction for filers 65+. Phases out above $75k (single) / $150k (joint).</div>
                  </div>
                </div>
              )}
            </div>
            <div style={{marginTop:10,fontSize:'.69rem',color:'var(--ink3)',textAlign:'center'}}>
              Estimates only · 2026 rules: IRS Rev. Proc. 2025-32 · Files April 2027
            </div>
          </div>
        )}

        <div style={{marginTop:'1rem',padding:'8px 12px',background:'var(--bg)',borderRadius:'var(--r-lg)',fontSize:'.69rem',color:'var(--ink3)',lineHeight:1.7,textAlign:'center'}}>🔒 TaxScope is a free sandbox estimator — not tax advice. Numbers are estimates based on 2025 & 2026 tax data (IRS Rev. Proc. 2024-40, 2025-32). Always consult a tax professional for your actual return.</div>
      </div>
    </div>
  </div>);
}

// ─── APP ──────────────────────────────────────────────────────────
export default function App(){
  const[d,setD]=useState({...D0});
  const[op,setOp]=useState({...OP0});
  const[started,setStarted]=useState(false);
  const[drawerOpen,setDrawerOpen]=useState(false);
  const[selectedPersona,setSelectedPersona]=useState(null);
  const[drawerDismissed,setDrawerDismissed]=useState(false);
  const[drawerPeek,setDrawerPeek]=useState(0);
  const[drawerClosing,setDrawerClosing]=useState(false); // 0=hidden, 1=fully visible, 0<x<1=animating in
  const upd=useCallback((k,v)=>setD(p=>({...p,[k]:v})),[]);
  const tog=k=>setOp(o=>({...o,[k]:!o[k]}));

  // Always calculate 2025 (current filing season) + 2026 (current income year) in parallel
  const calc=useMemo(()=>calcTax(d,2025),[d]);       // 2025 = primary (filing NOW)
  const calc26=useMemo(()=>calcTax(d,2026),[d]);      // 2026 = planning (earning NOW)
  const yearDiff=Math.round(calc26.res - calc.res);   // negative = bigger refund/less owed in 2026
  const bigDiff=Math.abs(yearDiff)>=150;              // show 2026 callout when diff is meaningful

  const cx=getCx(d);
  const Y25=TAX_DATA[2025];
  const Y26=TAX_DATA[2026];

  useEffect(()=>{const el=document.createElement('style');el.textContent=CSS;document.head.prepend(el);return()=>el.remove();},[]);
  const reset=useCallback(()=>{setD({...D0});setOp({...OP0});setStarted(false);setDrawerOpen(false);setSelectedPersona(null);setDrawerDismissed(false);},[]);

  // Track when estimate becomes meaningful (first time gross > 0)
  const hasTrackedEstimate = useRef(false);
  useEffect(()=>{
    if(calc.gross>0&&started&&!hasTrackedEstimate.current){
      hasTrackedEstimate.current=true;
      track('estimate_completed',{
        result:calc.res<-1?'refund':calc.res>1?'owed':'even',
        amount:Math.round(Math.abs(calc.res)),
        complexity:getCx(d).level,
        income_types:d.wt.join(','),
        state:d.st,
      });
    }
    if(!calc.gross) hasTrackedEstimate.current=false;
  },[calc.gross,started]);
  const load=p=>{setD({...D0,...p.data,bizExp:p.data.bizExp||{},seExp:{}});setOp({...OP0});setSelectedPersona(p.id);setStarted(true);track('persona_selected',{persona_id:p.id,persona_name:p.name,persona_role:p.role});};
  const startOwn=()=>{setD({...D0});setOp({...OP0});setSelectedPersona(null);setStarted(true);track('start_own_estimate');};
  const hasW2=d.wt.includes('w2'),hasSE=d.wt.includes('se'),hasBiz=d.wt.includes('biz'),hasRet=d.wt.includes('ret');
  const doneWork=d.wt.length>0&&d.st&&d.age;
  const doneInc=calc.gross>0;
  const doneHH=d.fs!=='single'||(d.kids||0)>0||d.cc||d.edu>0;
  const doneSav=(d.r401k||0)>0||(d.ira||0)>0||(d.hsa||0)>0||(d.sloan||0)>0||(d.seHI||0)>0;
  const doneDed=d.home||(d.salt||0)>0||(d.charity||0)>0;
  // Who likely needs quarterly estimated payments:
  // SE/freelance, biz owner (draw not salary), retiree with unwithheld income,
  // or anyone likely owing $1k+ with withholding gap
  // IRS rule: quarterly estimated tax required if expect to owe $1k+ and
  // withholding covers <90% of current year tax or <100% of prior year tax.
  // Practically: SE income, business draws, retirement distributions, or significant underwithholding.
  const needsQuarterly=(
    d.wt.includes('se')||
    d.wt.includes('biz')||          // all business owners — draws AND salary scenarios can require it
    d.wt.includes('ret')||          // retirees: SS, pension, IRA distributions often under-withheld
    (calc.res>1000&&(d.wh||0)<calc.tot*.85)  // W2 workers who are significantly under-withheld
  );
  const isR=calc.res<=-1,isO=calc.res>=1;
  const amt=Math.abs(calc.res);

  // Scroll-linked drawer: slides in as user enters footer zone, re-triggers every scroll
  useEffect(()=>{
    if(!calc.gross||!started)return;
    const onScroll=()=>{
      if(drawerOpen)return;
      const footer=document.querySelector('footer');
      if(!footer)return;
      const vh=window.innerHeight;
      const footerTop=footer.getBoundingClientRect().top;
      // Reset dismissed state whenever user scrolls back above footer zone
      if(footerTop>vh&&drawerDismissed){setDrawerDismissed(false);setDrawerPeek(0);return;}
      // Compute peek: 0 when footer is at bottom of screen, 1 when footer is 50% up screen
      const progress=Math.max(0,Math.min(1,(vh-footerTop)/(vh*0.5)));
      if(!drawerDismissed){
        setDrawerPeek(progress);
        if(progress>=1)setDrawerOpen(true); // fully open when fully scrolled in
      }
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[calc.gross,started,drawerOpen,drawerDismissed]);

  const closeDrawer=useCallback(()=>{
    setDrawerClosing(true);
    setTimeout(()=>{setDrawerOpen(false);setDrawerClosing(false);setDrawerDismissed(true);setDrawerPeek(0);},420);
  },[]);

  // Required fields
  const missingItems=[];
  if(!d.wt.length)missingItems.push({id:'card-work',label:'Work situation'});
  if(!d.st)missingItems.push({id:'card-work',label:'State'});
  if(!d.age)missingItems.push({id:'card-work',label:'Age range'});
  if(started&&!doneInc&&d.wt.length>0)missingItems.push({id:'card-inc',label:'Income amount'});

  // ── 2026 PLANNING HINT: shown contextually inline on relevant inputs
  // "You're earning 2026 income right now — here's how the rules are different"
  const Hint26=({show=true,icon='📅',children})=>{
    if(!show)return null;
    return(
      <div style={{background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)',border:'1px solid #BFDBFE',borderRadius:'var(--r)',padding:'8px 11px',display:'flex',gap:7,alignItems:'flex-start',marginTop:4}}>
        <span style={{fontSize:'.875rem',flexShrink:0,lineHeight:1.5}}>{icon}</span>
        <div style={{fontSize:'.75rem',color:'#1E3A8A',lineHeight:1.65}}><strong style={{color:'#1E40AF'}}>2026 planning tip:</strong> {children}</div>
      </div>
    );
  };

  return(<div style={{minHeight:'100vh',paddingBottom:drawerOpen?0:70}}>
    {/* NAV */}
    <nav style={{background:'rgba(245,242,236,.94)',backdropFilter:'blur(14px)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:100,padding:'.75rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'var(--sh-xs)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:6,fontWeight:800,fontSize:'.9375rem'}}>
          <Target size={17} style={{color:'var(--coral)'}}/>TaxScope
        </div>
        <span style={{fontSize:'.75rem',color:'var(--ink2)',fontWeight:600,whiteSpace:'nowrap'}}>Free Tax Estimator</span>

      </div>
      <div style={{display:'flex',alignItems:'center',gap:'.875rem'}}>
        
        
      </div>
    </nav>

    {/* HERO */}
    <div style={{background:'linear-gradient(160deg,var(--white) 0%,var(--bg) 100%)',borderBottom:'1px solid var(--border)',padding:'2.5rem 1.5rem 2rem'}}>
      <div style={{maxWidth:960,margin:'0 auto',textAlign:'center'}}>
        <h1 className="fu" style={{fontFamily:'var(--fs)',fontSize:'clamp(1.85rem,4.5vw,3.25rem)',fontWeight:400,lineHeight:1.12,letterSpacing:'-.02em',marginBottom:'.75rem'}}>
          Will you get <em style={{color:'var(--coral)'}}>money back</em>,<br/>or owe more this year?
        </h1>
        <p className="fu d1" style={{fontSize:'.9rem',fontWeight:500,color:'var(--ink2)',maxWidth:440,margin:'0 auto 1.75rem',lineHeight:1.8}}>
          Free, anonymous tax estimator — no signup, no sensitive data needed. Works for W-2 employees, freelancers, business owners, retirees, and everyone in between.
        </p>
        <div className="fu d2" style={{marginBottom:'1.5rem'}}>
          <div style={{background:'var(--gold-lt)',border:'1px solid #FDE68A',borderRadius:100,padding:'4px 14px',fontSize:'.75rem',fontWeight:700,color:'#78350F',display:'inline-flex',alignItems:'center',gap:5,marginBottom:'.625rem'}}>
            <Star size={11}/> Try a pre-filled demo — pick any persona below to see how it works
          </div>
          <p style={{fontSize:'.75rem',color:'var(--ink3)',marginBottom:'.75rem'}}>10 fictional people, fully pre-filled. Explore their scenario or scroll down to enter your own.</p>
          <div style={{display:'flex',gap:5,overflowX:'auto',justifyContent:'center',flexWrap:'wrap',padding:'0 .5rem .25rem',maxWidth:920,margin:'0 auto'}}>
            {PERSONAS.map(p=>{const sel=selectedPersona===p.id;return(<button key={p.id} onClick={()=>load(p)} style={{background:sel?'var(--coral)':'var(--white)',border:`1.5px solid ${sel?'var(--coral)':'var(--border)'}`,borderRadius:100,padding:'5px 12px',fontWeight:600,fontSize:'.73rem',cursor:'pointer',display:'flex',alignItems:'center',gap:4,transition:'all .14s',flexShrink:0,whiteSpace:'nowrap',boxShadow:sel?'0 2px 8px rgba(224,78,26,.3)':'none',transform:sel?'translateY(-2px)':'none'}} onMouseEnter={e=>{if(!sel){e.currentTarget.style.borderColor='var(--coral)';e.currentTarget.style.background='var(--coral-lt)';e.currentTarget.style.transform='translateY(-2px)';}}} onMouseLeave={e=>{if(!sel){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--white)';e.currentTarget.style.transform='none';}}}><span style={{fontWeight:700,color:sel?'white':'var(--ink)'}}>{p.name}</span><span style={{color:sel?'rgba(255,255,255,.75)':'var(--ink3)',fontWeight:400}}>({p.role})</span></button>);})}
          </div>
        </div>
        <div className="fu d3" style={{display:'flex',alignItems:'center',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <div style={{flex:1,maxWidth:110,height:1,background:'var(--border)'}}/>
          <button onClick={started?reset:startOwn} style={{background:'var(--coral)',color:'white',border:'none',borderRadius:100,padding:'12px 26px',fontWeight:700,fontSize:'.9375rem',cursor:'pointer',display:'flex',alignItems:'center',gap:7,transition:'all .17s',boxShadow:'0 4px 18px rgba(224,78,26,.32)',whiteSpace:'nowrap'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 7px 28px rgba(224,78,26,.44)';}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 18px rgba(224,78,26,.32)';}}>
            {started?<><RefreshCw size={15}/>Start over</>:<><Calculator size={15}/>Run my own estimate — let's go!</>}
          </button>
          <div style={{flex:1,maxWidth:110,height:1,background:'var(--border)'}}/>
        </div>
      </div>
    </div>

    {/* DASHBOARD */}
    {started&&<div style={{maxWidth:1100,margin:'0 auto',padding:'1.75rem 1.5rem'}}>
      {d._n&&<div className="fu" style={{background:'linear-gradient(135deg,var(--teal),#0D9488)',color:'white',borderRadius:'var(--r-xl)',padding:'.875rem 1.25rem',display:'flex',gap:10,alignItems:'center',marginBottom:'1rem'}}><div style={{width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Briefcase size={15} style={{color:'white'}}/></div><div><div style={{fontWeight:700}}>Meet {d._n} ({d._t})</div><div style={{fontSize:'.75rem',opacity:.75,marginTop:1}}>Pre-filled — tweak anything to match your own situation.</div></div><button onClick={startOwn} style={{marginLeft:'auto',background:'rgba(255,255,255,.18)',border:'1px solid rgba(255,255,255,.28)',color:'white',borderRadius:100,padding:'4px 11px',fontSize:'.71rem',fontWeight:600,cursor:'pointer',flexShrink:0,transition:'background .13s',whiteSpace:'nowrap'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.28)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.18)'}>Start fresh</button></div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1rem',marginBottom:'1rem'}}>
        <DCard id="card-work" title="Work Situation" sub="How do you earn your income?" Icon={Briefcase} open={op.work} onToggle={()=>tog('work')} done={doneWork} required>
          <TileG multi val={d.wt} onChange={v=>upd('wt',v)} hint="Select all that apply:" opts={[{v:'w2',label:'Regular job',sub:'W-2 employee',Icon:Briefcase},{v:'se',label:'Freelance / 1099',sub:'Self-employed',Icon:DollarSign},{v:'biz',label:'Run a business',sub:'Revenue & expenses',Icon:Building2},{v:'ret',label:'Retired',sub:'SS, IRA, investments',Icon:PiggyBank}]}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:'.74rem',fontWeight:600,color:'var(--ink2)',display:'flex',alignItems:'center',gap:3}}><MapPin size={10}/>State</label>
              <select value={d.st} onChange={e=>upd('st',e.target.value)} style={{width:'100%',padding:'8px 28px 8px 10px',border:'1.5px solid var(--border)',borderRadius:'var(--r)',fontSize:'.83rem',background:'var(--white)',outline:'none',transition:'border-color .15s'}} onFocus={e=>e.target.style.borderColor='var(--coral)'} onBlur={e=>e.target.style.borderColor='var(--border)'}>
                <option value="">Pick state...</option>{STATES.map(s=><option key={s} value={s}>{SN[s]}{NT.has(s)?' · no income tax':''}  </option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:'.74rem',fontWeight:600,color:'var(--ink2)'}}>Age range</label>
              <TileG val={d.age} onChange={v=>upd('age',v)} cols={2} sm opts={[{v:'under30',label:'<30'},{v:'30-44',label:'30–44'},{v:'45-64',label:'45–64'},{v:'65plus',label:'65+'}]}/>
            </div>
          </div>
          {d.st&&NT.has(d.st)&&<div style={{background:'var(--green-lt)',borderRadius:'var(--r)',padding:'7px 10px',fontSize:'.74rem',color:'var(--green)',fontWeight:600,display:'flex',gap:4,alignItems:'center'}}><Check size={11}/>Zero state income tax in {SN[d.st]}</div>}
          {d.st==='NY'&&<TR label="NYC resident?" sub="New York City adds 3.078%–3.876% on top of state tax" checked={d.nycResident||false} onChange={v=>upd('nycResident',v)}/>}
          {d.st==='MD'&&<div style={{background:'var(--gold-lt)',borderRadius:'var(--r)',padding:'7px 10px',fontSize:'.73rem',color:'#78350F',display:'flex',gap:5,alignItems:'flex-start'}}><Info size={11} style={{flexShrink:0,marginTop:1}}/>Maryland has a mandatory county/local income tax (~2.5% avg) added to your estimate.</div>}
        </DCard>
        <DCard id="card-hh" title="Household" sub="Family affects deductions and credits" Icon={Users} open={op.hh} onToggle={()=>tog('hh')} done={doneHH} optional>
          <TileG val={d.fs} onChange={v=>{upd('fs',v);if(v==='single')upd('sw2',0);}} cols={2} opts={[{v:'single',label:'Single',sub:'Filing solo',Icon:Briefcase},{v:'mfj',label:'Married jointly',sub:'Usually better',Icon:Users},{v:'hoh',label:'Head of household',sub:'Single parent',Icon:Users},{v:'mfs',label:'Married separately',Icon:Briefcase}]}/>
          <Stp val={d.kids} onChange={v=>upd('kids',v)} label="Kids or dependents under 17"/>
          {d.kids>0&&<div style={{background:'var(--teal-lt)',borderRadius:'var(--r)',padding:'8px 11px'}}><div style={{fontSize:'.78rem',color:'var(--teal)',fontWeight:700,marginBottom:2}}>{d.kids} kid{d.kids>1?'s':''} × $2,200 credit = {fm(d.kids*2200)} off your tax bill</div><div style={{fontSize:'.7rem',color:'var(--teal)',opacity:.85}}>That's a credit — reduces your tax bill dollar-for-dollar.</div></div>}
          {d.kids>0&&<Bx><div style={{fontSize:'.75rem',fontWeight:700,color:'var(--ink2)',display:'flex',gap:4,alignItems:'center'}}><Gift size={11}/>More ways to lower taxes with kids:</div><TR label="Pay for childcare so you can work?" sub="Child & Dependent Care Credit — up to 20% back" checked={d.cc} onChange={v=>upd('cc',v)}/>{d.cc&&<Sld label="Annual childcare cost" val={d.ccAmt} min={0} max={25000} step={500} onChange={v=>upd('ccAmt',v)} tip="You may get up to 20% of qualifying costs as a credit — up to $6k for 2+ kids."/>}<TR label="Anyone in household in college?" sub="American Opportunity Credit — up to $2,500/yr" checked={d.edu>0} onChange={v=>upd('edu',v?8000:0)}/>{d.edu>0&&<Sld label="Tuition + fees paid this year" val={d.edu} min={0} max={20000} step={500} onChange={v=>upd('edu',v)} tip="AOC: up to $2,500/yr, first 4 years of college. Up to $1k is refundable!"/>}</Bx>}
        </DCard>
        <DCard id="card-sav" title="Retirement & Savings" sub="Lowers your taxable income before anything else" Icon={PiggyBank} open={op.sav} onToggle={()=>tog('sav')} done={doneSav} optional>
          <Sld label="401(k) / 403(b) contributions" val={d.r401k} min={0} max={24500} step={250} onChange={v=>upd('r401k',v)} tip={d.r401k>0?`${fm(d.r401k)} comes directly off your taxable income. 2025 max: $23,500.`:undefined}/>
          <Hint26 show={d.r401k>=23000}>The 2026 401(k) limit just increased to <strong>$24,500</strong> (+$1,000). If you're earning income right now, you can contribute up to that new limit this year.</Hint26>
          <Sld label="Traditional IRA contributions" val={d.ira} min={0} max={7500} step={500} onChange={v=>upd('ira',v)} tip="2025 max: $7,000. Traditional IRA reduces taxes now — Roth doesn't."/>
          <Hint26 show={d.ira>=6500}>For 2026 income, the IRA limit rises to <strong>$7,500</strong> (+$500). Good time to bump your contributions.</Hint26>
          <Sld label="HSA (Health Savings Account)" val={d.hsa} min={0} max={8750} step={200} onChange={v=>upd('hsa',v)} tip="2025 max: $4,300 self · $8,550 family. Triple tax advantage."/>
          <Hint26 show={d.hsa>=4000}>2026 HSA limits: <strong>$4,400</strong> individual · <strong>$8,750</strong> family. The earlier you max it, the more tax-free growth time you get.</Hint26>
          <Sld label="Student loan interest paid" val={d.sloan} min={0} max={2500} step={100} onChange={v=>upd('sloan',v)}/>
          {(hasSE||hasBiz)&&<Sld label="Self-employed health insurance" val={d.seHI} min={0} max={200000} step={5000} onChange={v=>upd('seHI',v)} tip="100% deductible if you're self-employed!"/>}
        </DCard>
      </div>

      <div style={{marginBottom:'1rem'}}>
        <DCard id="card-inc" title="Income" sub="Ballpark is totally fine — no exact figures needed" Icon={DollarSign} open={op.inc} onToggle={()=>tog('inc')} done={doneInc} required>
          {!d.wt.length&&<div style={{padding:'1.5rem',textAlign:'center',color:'var(--ink3)',fontSize:'.875rem',display:'flex',gap:7,alignItems:'center',justifyContent:'center'}}><AlertCircle size={15}/>Fill in Work Situation first, then come back here.</div>}
          {d.wt.length>0&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:'1.5rem'}}>
            {(hasW2||(!hasSE&&!hasBiz&&!hasRet))&&<div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{fontWeight:700,fontSize:'.82rem',color:'var(--ink2)',display:'flex',gap:4,alignItems:'center'}}><Briefcase size={11}/>W-2 / Employment</div>
              <Sld label="Annual salary / wages" val={d.w2} min={0} max={2000000} step={5000} onChange={v=>upd('w2',v)}/>
              {(d.fs==='mfj'||d.fs==='mfs')&&<Sld label="Partner / spouse income" val={d.sw2} min={0} max={2000000} step={5000} onChange={v=>upd('sw2',v)}/>}
              <Sld label="Federal tax withheld from paychecks" val={d.wh} min={0} max={2000000} step={5000} onChange={v=>upd('wh',v)} tip="Check Box 2 on your W-2. Rough estimate: 15–22% of salary."/>
            </div>}
            {hasSE&&<div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{fontWeight:700,fontSize:'.82rem',color:'var(--ink2)',display:'flex',gap:4,alignItems:'center'}}><DollarSign size={11}/>Freelance / 1099</div>
              <Sld label="Gross 1099 / freelance income" val={d.seInc} min={0} max={5000000} step={5000} onChange={v=>upd('seInc',v)} tip={d.seInc>400?"Self-employed = you pay both sides of SS + Medicare (15.3% SE tax). Auto-calculated.":undefined}/>
              <Bx>
                <div style={{fontSize:'.74rem',fontWeight:700,color:'var(--ink2)'}}>Core business expenses:</div>
                <Sld label="Vehicle / mileage" val={d.seV} min={0} max={30000} step={200} onChange={v=>upd('seV',v)} tip="IRS mileage: $0.70/mile in 2025."/>
                <Sld label="Home office" val={d.seH} min={0} max={15000} step={200} onChange={v=>upd('seH',v)}/>
                <Sld label="Equipment & software" val={d.seE} min={0} max={20000} step={200} onChange={v=>upd('seE',v)}/>
                <Sld label="Other expenses" val={d.seO} min={0} max={20000} step={200} onChange={v=>upd('seO',v)}/>
              </Bx>
              <div style={{background:'var(--teal-lt)',borderRadius:'var(--r)',padding:'7px 11px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontWeight:600,fontSize:'.78rem',color:'var(--teal)'}}>Net after expenses</span><span style={{fontFamily:'var(--fs)',fontSize:'1rem',fontWeight:700,color:'var(--teal)'}}>{fm(calc.seNet)}</span></div>
              {/* QUARTERLY TAX — moved to shared section below */}
            </div>}
            {hasBiz&&<BizSection d={d} upd={upd}/>}
            {hasRet&&<div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{fontWeight:700,fontSize:'.82rem',color:'var(--ink2)',display:'flex',gap:4,alignItems:'center'}}><PiggyBank size={11}/>Retirement Income</div>
              <Sld label="SS, pensions, IRA withdrawals, etc." val={d.otherInc||0} min={0} max={2000000} step={5000} onChange={v=>upd('otherInc',v)} tip="Up to 85% of Social Security may be taxable depending on total income."/>
              <Sld label="Tax already withheld" val={d.wh} min={0} max={500000} step={5000} onChange={v=>upd('wh',v)}/>
            </div>}
            {/* Capital Gains — shown for all filers */}
            {d.wt.length>0&&<div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{fontWeight:700,fontSize:'.82rem',color:'var(--ink2)',display:'flex',gap:4,alignItems:'center'}}><TrendingUp size={11}/>Capital Gains</div>
              <Sld label="Long-term capital gains" val={d.capGainLT||0} min={0} max={5000000} step={10000} onChange={v=>upd('capGainLT',v)} tip={d.capGainLT>0?"Long-term gains (assets held 12+ months) are taxed at 0%, 15%, or 20% — much lower than ordinary income rates. Your rate depends on your total taxable income.":undefined}/>
              <Sld label="Short-term capital gains" val={d.capGainST||0} min={0} max={3000000} step={10000} onChange={v=>upd('capGainST',v)} tip={d.capGainST>0?"Short-term gains (assets held under 12 months) are taxed as ordinary income — same as your salary.":undefined}/>
              {(d.capGainLT>0||d.capGainST>0)&&<div style={{background:'var(--teal-lt)',borderRadius:'var(--r)',padding:'8px 11px',fontSize:'.74rem',color:'var(--teal)',lineHeight:1.65}}>
                {d.capGainLT>0&&<div><strong>Long-term rate:</strong> {(()=>{const ti=(d.w2||0)+(d.sw2||0)-Math.min(d.r401k||0,23500);return ti<47025?'0% — you qualify for the lowest bracket!':ti<518900?'15%':'20%';})()}</div>}
                {d.capGainST>0&&<div style={{marginTop:d.capGainLT>0?4:0}}><strong>Short-term:</strong> Taxed as ordinary income at your marginal rate</div>}
              </div>}
            </div>}
          </div>}
        </DCard>
      </div>

      {/* ── QUARTERLY ESTIMATED TAX — shown for SE, biz draws, retirees, anyone likely underpaying ── */}
      {needsQuarterly&&<div style={{marginBottom:'1rem'}}>
        <div style={{background:'var(--white)',borderRadius:'var(--r-xl)',border:'1.5px solid #FDE68A',overflow:'hidden',boxShadow:'var(--sh-xs)'}}>
          <div style={{padding:'1rem 1.125rem',display:'flex',alignItems:'center',gap:9,borderBottom:'1px solid #FEF5D4'}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'#FEF5D4',border:'1.5px solid #FDE68A',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Calculator size={13} style={{color:'var(--gold)'}}/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:'.875rem',color:'var(--gold)',display:'flex',alignItems:'center',gap:6}}>
                Quarterly Estimated Taxes
                <span style={{fontSize:'.62rem',background:'#FEF5D4',color:'var(--gold)',borderRadius:100,padding:'1px 7px',fontWeight:700,border:'1px solid #FDE68A'}}>
                  {d.wt.includes('se')?'Freelance / 1099':d.wt.includes('biz')&&!d.bizSal?'Business owner':d.wt.includes('ret')?'Retiree':'Likely applies to you'}
                </span>
              </div>
              <div style={{fontSize:'.71rem',color:'var(--ink3)',marginTop:1}}>You may need to pay taxes quarterly — not just at filing time</div>
            </div>
          </div>
          <div style={{padding:'1rem 1.125rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={{fontSize:'.8rem',color:'var(--ink2)',lineHeight:1.7,background:'var(--bg)',borderRadius:'var(--r)',padding:'10px 12px'}}>
              <strong>Why quarterly?</strong> The US tax system is pay-as-you-go. W-2 employees have taxes withheld automatically each paycheck. But if you have income without withholding — from freelancing, a business draw, retirement distributions, or investments — the IRS expects you to pay taxes in <strong>4 installments</strong> throughout the year. Miss them and you'll owe a penalty even if you pay in full when you file.
            </div>
            {/* Who owes — context-aware explanation */}
            {d.wt.includes('se')&&<div style={{fontSize:'.77rem',color:'#78350F',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'9px 12px',lineHeight:1.65}}>
              <strong>Self-employed:</strong> No employer is withholding taxes for you. You owe self-employment tax (15.3%) + income tax on your net profit. The IRS expects quarterly payments or you'll face an ~8% annualized underpayment penalty.
            </div>}
            {d.wt.includes('biz')&&!d.bizSal&&<div style={{fontSize:'.77rem',color:'#78350F',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'9px 12px',lineHeight:1.65}}>
              <strong>Business owner (draw):</strong> Owner's draws aren't subject to withholding. Your business profit flows to your personal return — you're responsible for quarterly payments on that income.
            </div>}
            {d.wt.includes('ret')&&<div style={{fontSize:'.77rem',color:'#78350F',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'9px 12px',lineHeight:1.65}}>
              <strong>Retirees:</strong> Up to 85% of Social Security may be taxable. Pension and IRA withdrawals are taxable. If your withholding doesn't cover your tax bill, you'll owe estimated payments — or you can ask your plan administrator to increase withholding.
            </div>}
            {!d.wt.includes('se')&&!d.wt.includes('biz')&&!d.wt.includes('ret')&&calc.res>1000&&<div style={{fontSize:'.77rem',color:'#78350F',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'9px 12px',lineHeight:1.65}}>
              <strong>Heads up:</strong> Your current estimate shows you may owe {fm(calc.res)} at filing. If your withholding isn't covering at least 90% of your tax bill, you may need quarterly payments — or owe a penalty on top of the balance due.
            </div>}
            {/* Quarter grid */}
            <div>
              <div style={{fontSize:'.75rem',fontWeight:700,color:'var(--ink2)',marginBottom:7}}>2026 payment schedule:</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:6}}>
                {[['Q1','Jan 1 – Mar 31','Apr 15, 2026'],['Q2','Apr 1 – May 31','Jun 16, 2026'],['Q3','Jun 1 – Aug 31','Sep 15, 2026'],['Q4','Sep 1 – Dec 31','Jan 15, 2027']].map(([q,period,due],i)=>{
                  const dueDates=[new Date('2026-04-15'),new Date('2026-06-16'),new Date('2026-09-15'),new Date('2027-01-15')];
                  const now=new Date();
                  const isPast=dueDates[i]<now;
                  const isCurrent=!isPast&&(i===0||dueDates[i-1]<now);
                  return(
                    <div key={q} style={{background:isPast?'var(--bg)':isCurrent?'#FFFBEB':'var(--white)',border:`1px solid ${isCurrent?'#FDE68A':'var(--border)'}`,borderRadius:'var(--r)',padding:'8px 10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
                        <span style={{fontWeight:800,fontSize:'.78rem',color:isPast?'var(--ink3)':isCurrent?'var(--gold)':'var(--ink)'}}>{q}</span>
                        {isCurrent&&<span style={{fontSize:'.56rem',background:'#FDE68A',color:'#78350F',borderRadius:100,padding:'1px 5px',fontWeight:700}}>Current</span>}
                        {isPast&&<span style={{fontSize:'.56rem',color:'var(--ink3)',fontWeight:500}}>Past</span>}
                      </div>
                      <div style={{fontSize:'.66rem',color:'var(--ink3)',lineHeight:1.4,marginBottom:2}}>{period}</div>
                      <div style={{fontSize:'.68rem',fontWeight:600,color:isPast?'var(--ink3)':isCurrent?'var(--gold)':'var(--ink2)'}}>Due {due}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Safe harbor rule */}
            <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'9px 12px',fontSize:'.75rem',color:'var(--ink2)',lineHeight:1.7}}>
              <strong style={{color:'var(--ink)'}}>Safe harbor rule (avoid penalties):</strong> Pay at least <strong>90%</strong> of this year's tax, OR <strong>100% of last year's total tax</strong> (110% if your income exceeds $150k). Whichever is smaller — hit that and you won't be penalized, even if you owe more at filing.
            </div>
            {/* Dynamic payment suggestion */}
            {calc.tot>500&&<div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'var(--r)',padding:'9px 12px',fontSize:'.75rem',color:'#78350F',lineHeight:1.7}}>
              <strong>Rough quarterly payment:</strong> Based on your estimate, aim for about <strong>{fm(Math.round(calc.tot/4))}/quarter</strong> to cover your federal tax bill. This is a ballpark — use IRS Form 1040-ES for the exact amount.
            </div>}
            {/* Payments made slider */}
            <Sld label="Estimated quarterly payments made so far this year" val={d.estP} min={0} max={2000000} step={5000} onChange={v=>upd('estP',v)} tip={d.estP>0?"Payments already made reduce your balance due dollar-for-dollar and are reflected in your estimate above.":calc.tot>1000?"No payments entered yet — if you haven't paid any, the full amount may be due at filing plus an underpayment penalty (~8% annualized on the shortfall).":undefined}/>
            <div style={{fontSize:'.69rem',color:'var(--ink3)',lineHeight:1.6}}>
              Pay online at <strong>irs.gov/payments</strong> (IRS Direct Pay — free) or use the IRS2Go app. Select "Estimated Tax" and "2026" as the tax year.
            </div>
          </div>
        </div>
      </div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1rem'}}>
        <DCard id="card-ded" title="Deductions" sub="We auto-pick whichever saves you more" Icon={Calculator} open={op.ded} onToggle={()=>tog('ded')} done={doneDed} optional>
          <div style={{background:'var(--bg)',borderRadius:'var(--r)',padding:'8px 11px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:4}}>
            <span style={{fontSize:'.73rem',color:'var(--ink3)'}}>Standard: <strong style={{color:'var(--ink)'}}>{fm(calc.sd)}</strong></span>
            <span style={{fontSize:'.73rem',color:'var(--ink3)'}}>vs Itemized: <strong style={{color:calc.useItem?'var(--teal)':'var(--ink)'}}>{fm(calc.item)}</strong></span>
            <Chip color={calc.useItem?'var(--teal)':'var(--coral)'} bg={calc.useItem?'var(--teal-lt)':'var(--coral-lt)'}>{calc.useItem?'Itemized':'Standard'} ✓</Chip>
          </div>
          <TR label="Do you own a home?" checked={d.home} onChange={v=>upd('home',v)}/>
          {d.home&&<Bx><TR label="Have a mortgage?" checked={d.mort} onChange={v=>upd('mort',v)}/>{d.mort&&<Sld label="Mortgage interest paid" val={d.mortInt} min={0} max={100000} step={500} onChange={v=>upd('mortInt',v)} tip="Check your 1098 from your lender."/>}</Bx>}
          <Sld label="State & local taxes (SALT) paid" val={d.salt} min={0} max={40000} step={500} onChange={v=>upd('salt',v)} tip="Property + state income taxes. 2025 SALT cap: $40,000."/>
          <Sld label="Charitable donations" val={d.charity} min={0} max={2000000} step={5000} onChange={v=>upd('charity',v)}/>
          {calc.useItem&&<div style={{background:'var(--teal-lt)',borderRadius:'var(--r)',padding:'7px 10px',fontSize:'.74rem',color:'var(--teal)',fontWeight:600,display:'flex',gap:4,alignItems:'center'}}><TrendingUp size={11}/>Itemizing saves {fm(calc.item-calc.sd)} more — auto-applied.</div>}
        </DCard>

        {/* INLINE RESULT + REQUIRED FIELDS CALLOUT */}
        <div style={{background:isR?'linear-gradient(135deg,#F0FDF4,#D3F0EB)':isO&&amt>1500?'linear-gradient(135deg,#FEF2F2,#FEE2E2)':'linear-gradient(135deg,#FEFCE8,#FEF5D4)',borderRadius:'var(--r-xl)',padding:'1.5rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',border:`1.5px solid ${isR?'#86EFAC':isO&&amt>1500?'#FECACA':'#FDE68A'}`,minHeight:220,boxShadow:'var(--sh-xs)'}}>
          {calc.gross>0?(
            <>{/* has estimate */}
              <div style={{fontSize:'.62rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',color:isR?'var(--teal)':isO&&amt>1500?'var(--red)':'var(--gold)',marginBottom:4}}>{isR?'Estimated Refund':isO?'Estimated Balance Due':'≈ Break Even'}</div>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',gap:1}}>
                <span style={{fontSize:'1.1rem',fontWeight:800,color:isR?'var(--teal)':isO&&amt>1500?'var(--red)':'var(--gold)',opacity:.45,marginTop:4,fontFamily:'var(--f)'}}>~</span>
                <div style={{fontFamily:'var(--fs)',fontSize:'clamp(2rem,5vw,2.875rem)',fontWeight:400,color:isR?'var(--teal)':isO&&amt>1500?'var(--red)':'var(--gold)',lineHeight:1}}>{isR&&'+'}{isO&&'−'}{fm(amt)}</div>
              </div>
              <div style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(0,0,0,.06)',borderRadius:100,padding:'2px 9px',marginTop:5,fontSize:'.69rem',color:isR?'var(--teal)':isO&&amt>1500?'var(--red)':'var(--gold)',fontWeight:600}}>Range: {fm(amt*.87,true)} – {fm(amt*1.13,true)}</div>
              <Chip color={cx.color} bg={cx.bg} style={{marginTop:7}}>{cx.label} complexity</Chip>
              <div style={{fontSize:'.69rem',color:'var(--ink3)',marginTop:4,marginBottom:8}}>{cx.desc}</div>
              <button onClick={()=>setDrawerOpen(true)} style={{marginTop:4,background:'var(--white)',border:'1.5px solid var(--border)',borderRadius:'var(--r-lg)',padding:'8px 14px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:'.78rem',fontWeight:700,color:'var(--ink2)',width:'100%',transition:'all .16s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--coral)';e.currentTarget.style.color='var(--coral)';e.currentTarget.style.background='var(--coral-lt)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--ink2)';e.currentTarget.style.background='var(--white)';}}>
                <TrendingUp size={12}/>See full breakdown &amp; filing options
              </button>
              {bigDiff&&calc26&&(
                <div style={{marginTop:8,padding:'6px 10px',background:'#EFF6FF',borderRadius:'var(--r)',border:'1px solid #BFDBFE',fontSize:'.68rem',color:'#1E40AF',display:'flex',gap:4,alignItems:'center',justifyContent:'center',flexWrap:'wrap'}}>
                  <TrendingUp size={10} style={{flexShrink:0}}/>
                  <span><strong>2026 planning estimate: {yearDiff<0?`${fm(Math.abs(calc26.res))} refund`:`${fm(Math.abs(calc26.res))} owed`}</strong> — {yearDiff<0?`${fm(Math.abs(yearDiff))} better than 2025`:`${fm(Math.abs(yearDiff))} more than 2025`}</span>
                </div>
              )}
            </>
          ):(
            /* EMPTY STATE with required fields callout */
            <div style={{width:'100%'}}>
              <TrendingUp size={26} style={{marginBottom:8,opacity:.3,color:'var(--ink2)'}}/>
              <div style={{fontWeight:700,fontSize:'.9rem',marginBottom:4,color:'var(--ink)'}}>Your estimate shows here</div>
              {missingItems.length>0?(
                <div style={{marginTop:8,textAlign:'left'}}>
                  <div style={{fontSize:'.74rem',color:'var(--ink2)',marginBottom:6,fontWeight:600,display:'flex',gap:4,alignItems:'center',justifyContent:'center'}}><AlertCircle size={12} style={{color:'var(--coral)'}}/>To see your estimate, fill in:</div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',justifyContent:'center'}}>
                    {missingItems.map(f=>(
                      <a key={f.id} href={`#${f.id}`} onClick={e=>{e.preventDefault();document.getElementById(f.id)?.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>setOp(o=>({...o,[f.id.replace('card-','')]:true})),300);}} style={{display:'inline-flex',alignItems:'center',gap:4,background:'white',border:'1.5px solid var(--coral-md)',borderRadius:100,padding:'3px 10px',fontSize:'.72rem',fontWeight:600,color:'var(--coral)',textDecoration:'none',cursor:'pointer',transition:'all .13s'}} onMouseEnter={e=>e.currentTarget.style.background='var(--coral-lt)'} onMouseLeave={e=>e.currentTarget.style.background='white'}>
                        <ArrowRight size={9}/>{f.label}
                      </a>
                    ))}
                  </div>
                </div>
              ):(
                <div style={{fontSize:'.78rem',color:'var(--ink3)',marginTop:4}}>Fill in the cards above — updates live.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>}

    {/* EMPTY PRE-START STATE */}
    {!started&&<div style={{maxWidth:500,margin:'3rem auto',padding:'0 1.5rem',textAlign:'center'}}><div style={{background:'var(--white)',borderRadius:'var(--r-xl)',padding:'2.5rem',boxShadow:'var(--sh)',border:'1.5px solid var(--border)'}}><Target size={30} style={{color:'var(--coral)',marginBottom:'1rem'}}/><div style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'.5rem'}}>Ready when you are</div><div style={{fontSize:'.875rem',color:'var(--ink2)',lineHeight:1.7,marginBottom:'1.5rem'}}>Pick a persona above to explore a demo, or click below to enter your own numbers. Takes about 4 minutes.</div><button onClick={startOwn} style={{background:'var(--coral)',color:'white',border:'none',borderRadius:100,padding:'12px 26px',fontWeight:700,fontSize:'.9375rem',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:7,transition:'all .17s',boxShadow:'0 4px 18px rgba(224,78,26,.32)'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 7px 28px rgba(224,78,26,.44)';}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 18px rgba(224,78,26,.32)';}}>
      <Calculator size={15}/>Run my own estimate
    </button></div></div>}

    {/* STICKY BAR + SCRIM + SCROLL-LINKED PEEK */}
    {calc.gross>0&&<div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200}}>
      {/* Background scrim when drawer is open */}
      {(drawerOpen&&!drawerClosing)&&<div onClick={closeDrawer} style={{position:'fixed',inset:0,background:'rgba(23,20,14,.45)',zIndex:-1,backdropFilter:'blur(2px)',animation:'fadeIn .25s ease'}}/>}
      {/* Peek preview bar — animates in with scroll, disappears when drawer opens */}
      {!drawerOpen&&drawerPeek>0&&drawerPeek<1&&(
        <div style={{position:'absolute',bottom:'100%',left:0,right:0,height:4,background:`linear-gradient(90deg, var(--coral) ${drawerPeek*100}%, transparent ${drawerPeek*100}%)`,opacity:drawerPeek}}/>
      )}
      {(!drawerOpen||drawerClosing)&&<div style={{background:'var(--ink)',boxShadow:'var(--sh-up)',transform:'translateY(0)',opacity:1}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'10px 16px 10px',display:'flex',flexDirection:'column',gap:8}}>

          {/* Row 1: big number left | top bracket | eff rate | complexity — never wraps */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,minWidth:0}}>

            {/* Left: primary result */}
            <div style={{display:'flex',alignItems:'baseline',gap:5,flexShrink:0}}>
              <div style={{fontFamily:'var(--fs)',fontSize:'1.5rem',fontWeight:600,color:isR?'#5EEAD4':isO&&amt>3000?'#FCA5A5':'#FCD34D',lineHeight:1,whiteSpace:'nowrap'}}>{isR&&'+'}{isO&&'−'}{fm(amt)}</div>
              <div style={{fontSize:'.65rem',fontWeight:700,color:'rgba(255,255,255,.55)',textTransform:'uppercase',letterSpacing:'.06em',whiteSpace:'nowrap'}}>{isR?'refund':isO?'owed':'~even'}</div>
            </div>

            {/* Right: 3 stats — flex-shrink:0 on each, no wrap possible */}
            <div style={{display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'.55rem',fontWeight:700,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Top bracket</div>
                <div style={{fontSize:'.92rem',fontWeight:700,color:'rgba(255,255,255,.72)'}}>{Math.round(calc.mg*100)}%</div>
              </div>
              <div style={{width:1,height:20,background:'rgba(255,255,255,.1)',flexShrink:0}}/>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'.55rem',fontWeight:700,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Eff. rate</div>
                <div style={{fontSize:'.92rem',fontWeight:700,color:'rgba(255,255,255,.72)'}}>{(calc.eff*100).toFixed(1)}%</div>
              </div>
              <div style={{width:1,height:20,background:'rgba(255,255,255,.1)',flexShrink:0}}/>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'.55rem',fontWeight:700,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Complexity</div>
                <div style={{display:'flex',alignItems:'center',gap:3,justifyContent:'flex-end'}}>
                  <div style={{width:5,height:5,borderRadius:'50%',background:cx.color,flexShrink:0}}/>
                  <div style={{fontSize:'.92rem',fontWeight:700,color:'rgba(255,255,255,.72)'}}>{cx.label}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: start over (secondary, left) + main CTA (dominant, right) */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {started&&<button onClick={reset} style={{flexShrink:0,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',borderRadius:'var(--r)',padding:'11px 13px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,.55)',fontSize:'.8rem',fontWeight:600,transition:'all .15s',whiteSpace:'nowrap'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.13)';e.currentTarget.style.color='white';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.color='rgba(255,255,255,.55)';}}>
              <RefreshCw size={12}/>Reset
            </button>}
            <button onClick={()=>{setDrawerOpen(true);track('full_breakdown_opened',{estimated_result:isR?'refund':isO?'owed':'even',amount:Math.round(amt),complexity:cx.level});}} style={{flex:1,background:'var(--coral)',color:'white',border:'none',borderRadius:'var(--r)',padding:'12px',fontWeight:700,fontSize:'.9rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:'0 2px 8px rgba(224,78,26,.4)',transition:'opacity .14s'}} onMouseEnter={e=>e.currentTarget.style.opacity='.88'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              <TrendingUp size={14}/>Full breakdown + filing options ↑
            </button>
          </div>

        </div>
      </div>}
      {(drawerOpen||drawerClosing)&&<ResultsDrawer calc={calc} calc26={calc26} yearDiff={yearDiff} bigDiff={bigDiff} data={d} onClose={closeDrawer} closing={drawerClosing}/>}
    </div>}

    {/* ── LEGAL FOOTER ── */}
    <footer style={{background:'var(--ink)',color:'rgba(255,255,255,.55)',marginTop:'4rem',padding:'3rem 1.5rem 2.5rem'}}>
      <div style={{maxWidth:960,margin:'0 auto'}}>
        {/* Logo row */}
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:'1.5rem'}}>
          <Target size={16} style={{color:'var(--coral)'}}/><span style={{fontWeight:800,fontSize:'.9375rem',color:'white'}}>TaxScope</span>
          <span style={{fontSize:'.65rem',padding:'2px 7px',background:'rgba(255,255,255,.1)',borderRadius:100,color:'rgba(255,255,255,.5)'}}>Free Tax Estimator</span>
        </div>

        {/* Key disclaimers grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
          <div>
            <div style={{fontWeight:700,fontSize:'.8rem',color:'rgba(255,255,255,.75)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
              <Info size={13} style={{color:'var(--coral)'}}/>Estimation Only — Not Tax Advice
            </div>
            <p style={{fontSize:'.75rem',lineHeight:1.7}}>TaxScope is a free educational estimator. All results are approximations based on simplified calculations and should not be used as a substitute for professional tax preparation or advice. Numbers are estimates only — your actual tax liability may differ significantly.</p>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:'.8rem',color:'rgba(255,255,255,.75)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
              <Shield size={13} style={{color:'var(--coral)'}}/>No Professional Relationship
            </div>
            <p style={{fontSize:'.75rem',lineHeight:1.7}}>Using TaxScope does not create a client-preparer relationship, attorney-client relationship, or any other professional relationship. We are not a licensed tax professional, CPA, enrolled agent, or financial advisor. Always consult a qualified tax professional before making financial decisions.</p>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:'.8rem',color:'rgba(255,255,255,.75)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
              <Globe size={13} style={{color:'var(--coral)'}}/>No Data Collected or Stored
            </div>
            <p style={{fontSize:'.75rem',lineHeight:1.7}}>TaxScope does not collect, store, or transmit any personal information you enter. All calculations happen entirely in your browser. We do not have access to your inputs. No account, login, or personal data is required or retained.</p>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:'.8rem',color:'rgba(255,255,255,.75)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
              <TrendingUp size={13} style={{color:'var(--coral)'}}/>Tax Law Changes Frequently
            </div>
            <p style={{fontSize:'.75rem',lineHeight:1.7}}>Tax laws, rates, credits, and deductions change regularly. This tool reflects our best understanding of 2025 federal tax law (including the One Big Beautiful Bill Act signed July 4, 2025) and selected state rates as of early 2026. Always verify current rules with the IRS or a licensed tax professional.</p>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:'.8rem',color:'rgba(255,255,255,.75)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
              <Star size={13} style={{color:'var(--coral)'}}/>Product Recommendations Disclosure
            </div>
            <p style={{fontSize:'.75rem',lineHeight:1.7}}>The tax software products and services shown are for informational purposes only. TaxScope may receive compensation if you click on or purchase products linked from this site (affiliate relationships). Recommendations are based on publicly available pricing and features and do not constitute an endorsement. Prices and features may change.</p>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:'.8rem',color:'rgba(255,255,255,.75)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
              <Calculator size={13} style={{color:'var(--coral)'}}/>Known Simplifications
            </div>
            <p style={{fontSize:'.75rem',lineHeight:1.7}}>This tool simplifies many aspects of tax law: it does not account for AMT, phase-outs above $500k, net investment income tax (NIIT), passive activity rules, depreciation, carryforwards, foreign income, multiple state filings, tribal income, or many other complex situations. Results for high-income or complex returns may be significantly off.</p>
          </div>
        </div>

        {/* Legal text block */}
        <div style={{borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:'1.5rem',marginBottom:'1.25rem'}}>
          <p style={{fontSize:'.72rem',lineHeight:1.8,color:'rgba(255,255,255,.4)'}}>
            <strong style={{color:'rgba(255,255,255,.6)'}}>IMPORTANT LEGAL NOTICE:</strong> TaxScope is provided "as is" without warranty of any kind, express or implied. The creators of TaxScope make no representations or warranties regarding the accuracy, completeness, or suitability of any information provided. TaxScope shall not be liable for any errors or omissions, or for any actions taken in reliance on information provided herein. The information on this site does not constitute legal, financial, tax, or investment advice, and is not a substitute for advice from a qualified professional who is aware of your specific circumstances. IRS and state tax agency rules are complex and subject to change. For authoritative guidance, consult the IRS at <strong style={{color:'rgba(255,255,255,.6)'}}>irs.gov</strong> or a licensed tax professional. Federal income tax filing deadlines vary; most individual returns are due April 15, with extensions available. See IRS.gov for current deadlines and requirements.
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.08)'}}>
          <div style={{fontSize:'.7rem',color:'rgba(255,255,255,.3)'}}>
            © {new Date().getFullYear()} TaxScope · Free Tax Estimator · Tax Years 2025 & 2026 · Not affiliated with the IRS
          </div>
          <div style={{display:'flex',gap:'1.25rem',fontSize:'.7rem'}}>
            <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" style={{color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .14s'}} onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>IRS.gov</a>
            <a href="https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free" target="_blank" rel="noopener noreferrer" style={{color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .14s'}} onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>Free File</a>
            <a href="https://www.irs.gov/help/contact-the-irs" target="_blank" rel="noopener noreferrer" style={{color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .14s'}} onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>IRS Help</a>
            <a href="https://www.irs.gov/taxpayer-advocate" target="_blank" rel="noopener noreferrer" style={{color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .14s'}} onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.7)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>Taxpayer Advocate</a>
          </div>
        </div>
      </div>
    </footer>

    <style>{`@keyframes barIn{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}@keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes drawerDown{from{transform:translateY(0)}to{transform:translateY(100%)}}@media(max-width:580px){nav>div:last-child>span{display:none!important}}`}</style>
  </div>);
}
