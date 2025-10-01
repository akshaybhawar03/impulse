// src/data/servicesData.ts
import { IconType } from "react-icons";
import { MdBloodtype } from "react-icons/md";
import { GiKidneys, GiStomach } from "react-icons/gi";
import { FaFlask, FaMicroscope, FaVials, FaSyringe } from "react-icons/fa";
import { BiDna } from "react-icons/bi";

export interface SubTest {
  name: string;
  price: number;
  preparation: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  subTests: SubTest[];
  preparation: string;
  gradient: string;
  icon: IconType;
}

export const serviceData: Record<string, Service> = {
  // 🩸 Hematology
  hematology: {
    slug: "hematology",
    title: "Hematology",
    description: "Blood analysis including CBC, clotting, and related tests.",
    subTests: [
      { name: "Haemogram", price: 200, preparation: "No fasting required." },
      { name: "ESR", price: 100, preparation: "No preparation required." },
      { name: "HB%", price: 100, preparation: "No preparation required." },
      { name: "PBS MP", price: 150, preparation: "No preparation required." },
      { name: "Optimal (RMP)", price: 400, preparation: "No fasting required." },
      { name: "BT-CT", price: 150, preparation: "Avoid blood thinners." },
      { name: "PT INR", price: 400, preparation: "Avoid alcohol before test." },
      { name: "PTTK", price: 400, preparation: "Consult doctor for medication guidelines." },
      { name: "Blood Group", price: 100, preparation: "No preparation required." },
      { name: "Coombs Test", price: 500, preparation: "No special preparation required." },
      { name: "AEC", price: 200, preparation: "No preparation required." },
      { name: "HB Electrophoresis", price: 1400, preparation: "No fasting required." },
      { name: "HLAB 27", price: 3500, preparation: "Consult doctor before test." },
    ],
    preparation: "Routine blood sample collection.",
    gradient: "from-red-400 to-red-600",
    icon: MdBloodtype,
  },

  // 🧪 Biochemistry
  biochemistry: {
    slug: "biochemistry",
    title: "Biochemistry",
    description: "Tests for sugar, kidney, liver, enzymes, and vitamins.",
    subTests: [
      { name: "GTT", price: 600, preparation: "Fast overnight, avoid smoking before test." },
      { name: "OGCT", price: 300, preparation: "Fast 8 hours, avoid high sugar foods before test." },
      { name: "Blood Sugar F & PP", price: 150, preparation: "Fasting and post meal samples required." },
      { name: "BSL R", price: 100, preparation: "No fasting required." },
      { name: "HbA1C", price: 600, preparation: "No fasting required." },
      { name: "Blood Urea", price: 150, preparation: "Stay hydrated before test." },
      { name: "Creatinine", price: 150, preparation: "Stay hydrated before sample." },
      { name: "Uric Acid", price: 150, preparation: "Avoid alcohol and purine-rich food 24 hours prior." },
      { name: "Lipid Profile", price: 600, preparation: "Fasting 10–12 hours required." },
      { name: "LFT", price: 600, preparation: "Fasting 8 hours recommended." },
      { name: "SGOT", price: 150, preparation: "No fasting required." },
      { name: "SGPT", price: 150, preparation: "No fasting required." },
      { name: "Alkaline Phosphatase", price: 150, preparation: "No fasting required." },
      { name: "Total Protein", price: 150, preparation: "No fasting required." },
      { name: "Albumin", price: 150, preparation: "No fasting required." },
      { name: "Calcium", price: 200, preparation: "No fasting required." },
      { name: "Amylase", price: 500, preparation: "No fasting required." },
      { name: "Lipase", price: 500, preparation: "No fasting required." },
      { name: "Electrolytes", price: 500, preparation: "No fasting required." },
      { name: "CK", price: 500, preparation: "Avoid strenuous activity before test." },
      { name: "CKMB", price: 500, preparation: "Avoid exercise 24 hours before test." },
      { name: "LDH", price: 500, preparation: "No fasting required." },
      { name: "Urine Micral", price: 700, preparation: "First morning urine sample required." },
      { name: "Phosphate (PO4)", price: 200, preparation: "No fasting required." },
      { name: "Magnesium", price: 600, preparation: "No fasting required." },
      { name: "eGFR", price: 500, preparation: "No fasting required." },
      { name: "BUN", price: 250, preparation: "Stay hydrated before test." },
      { name: "Ionic Calcium", price: 900, preparation: "No fasting required." },
      { name: "VBG", price: 1000, preparation: "Doctor advised." },
      { name: "ABG", price: 1000, preparation: "Doctor advised." },
    ],
    preparation: "Some require fasting (8–12 hrs).",
    gradient: "from-blue-400 to-blue-600",
    icon: FaFlask,
  },

  // 🧫 Clinical Pathology
  "clinical-path": {
    slug: "clinical-path",
    title: "Clinical Pathology",
    description: "Urine, stool, semen, and fluid analysis.",
    subTests: [
      { name: "Urine Routine", price: 100, preparation: "Midstream urine sample required." },
      { name: "Urine Protein 24 hrs", price: 700, preparation: "Collect all urine for 24 hrs." },
      { name: "ACR", price: 750, preparation: "Collect urine in sterile container." },
      { name: "Micro ALB", price: 700, preparation: "First morning urine preferred." },
      { name: "Urine Ketone", price: 100, preparation: "No preparation required." },
      { name: "Stool Routine", price: 200, preparation: "Fresh stool sample in clean container." },
      { name: "Occult Blood (OB)", price: 100, preparation: "Avoid red meat 48 hrs before test." },
      { name: "UPT", price: 300, preparation: "Morning urine sample recommended." },
      { name: "Semen Analysis", price: 300, preparation: "Abstain 2–5 days before test." },
    ],
    preparation: "Collect in sterile containers.",
    gradient: "from-yellow-400 to-yellow-600",
    icon: GiKidneys,
  },

  // ⭐ Special Test
  "special-test": {
    slug: "special-test",
    title: "Special Tests",
    description: "Advanced diagnostic tests.",
    subTests: [
      { name: "TFT", price: 600, preparation: "No fasting required." },
      { name: "Free TFT", price: 850, preparation: "Doctor advised." },
      { name: "Vitamin B12", price: 900, preparation: "No fasting required." },
      { name: "Vitamin D3", price: 1600, preparation: "No fasting required." },
      { name: "Iron TIBC", price: 800, preparation: "Fasting 8 hrs recommended." },
      { name: "Anti TPO", price: 1400, preparation: "Doctor advised." },
      { name: "Anti Thyroid Antibodies", price: 1600, preparation: "Doctor advised." },
      { name: "Rubella IgG", price: 1400, preparation: "No fasting required." },
      { name: "ADA", price: 900, preparation: "No fasting required." },
      { name: "TORCH", price: 3500, preparation: "Doctor advised." },
      { name: "IL-6", price: 4500, preparation: "Doctor advised." },
    ],
    preparation: "Doctor’s instructions required.",
    gradient: "from-purple-400 to-purple-600",
    icon: BiDna,
  },

  // 🫁 Sputum Test
  "sputum-test": {
    slug: "sputum-test",
    title: "Sputum Tests",
    description: "Infections, TB & lung health.",
    subTests: [
      { name: "Sputum IGE", price: 900, preparation: "Morning sample preferred." },
      { name: "Sputum Routine", price: 600, preparation: "Collect in sterile container." },
      { name: "Gram Stain", price: 300, preparation: "Fresh sputum sample required." },
      { name: "ZN Stain", price: 300, preparation: "Morning sample recommended." },
      { name: "Sputum Culture", price: 900, preparation: "Deep cough sample in sterile container." },
    ],
    preparation: "Morning sample best for accuracy.",
    gradient: "from-green-400 to-green-600",
    icon: GiStomach,
  },

  // 🎯 Marker Tests
  "marker-test": {
    slug: "marker-test",
    title: "Marker Tests",
    description: "Cancer markers and cardiac markers.",
    subTests: [
      { name: "Double Marker", price: 2500, preparation: "Doctor advised." },
      { name: "Triple Marker", price: 3500, preparation: "Doctor advised." },
      { name: "Quadruple Marker", price: 4000, preparation: "Doctor advised." },
      { name: "AFP", price: 900, preparation: "No fasting required." },
      { name: "PSA", price: 900, preparation: "Avoid ejaculation 24 hrs before." },
      { name: "Trop T", price: 2200, preparation: "Doctor advised." },
      { name: "Trop I", price: 2200, preparation: "Doctor advised." },
      { name: "Pro Calcitonin", price: 2600, preparation: "No fasting required." },
      { name: "D-Dimer", price: 1400, preparation: "No preparation required." },
    ],
    preparation: "Follow doctor’s advice.",
    gradient: "from-pink-400 to-pink-600",
    icon: FaVials,
  },

  // 🧬 Serology
  "serology-test": {
    slug: "serology-test",
    title: "Serology Tests",
    description: "Viral & infection antibody tests.",
    subTests: [
      { name: "RA", price: 500, preparation: "No fasting required." },
      { name: "CRP", price: 500, preparation: "No fasting required." },
      { name: "ASO", price: 300, preparation: "No fasting required." },
      { name: "Widal", price: 200, preparation: "No fasting required." },
      { name: "VDRL", price: 300, preparation: "No fasting required." },
      { name: "HIV", price: 400, preparation: "No fasting required." },
      { name: "HBsAg", price: 400, preparation: "No fasting required." },
      { name: "HCV", price: 900, preparation: "No fasting required." },
      { name: "Chikungunya", price: 900, preparation: "No fasting required." },
      { name: "Dengue NS1", price: 800, preparation: "No fasting required." },
      { name: "Dengue Combo", price: 1200, preparation: "No fasting required." },
      { name: "Covid Antibody", price: 1600, preparation: "No fasting required." },
    ],
    preparation: "No special preparation.",
    gradient: "from-indigo-400 to-indigo-600",
    icon: FaVials,
  },

  // 📦 Profiles
  profile: {
    slug: "profile",
    title: "Profiles",
    description: "Health checkup packages.",
    subTests: [
      { name: "Fever Panel", price: 550, preparation: "No fasting required." },
      { name: "Health Care Profile", price: 1300, preparation: "Fast 8 hrs recommended." },
      { name: "Covid Profile + IL6", price: 7500, preparation: "Doctor advised." },
      { name: "ANC Profile", price: 1400, preparation: "No fasting required." },
      { name: "LFT Profile", price: 600, preparation: "Fasting 8 hrs recommended." },
      { name: "RFT Profile", price: 500, preparation: "Fasting 8 hrs recommended." },
      { name: "Diabetic Profile", price: 1000, preparation: "Fasting 8–10 hrs required." },
      { name: "Cardiac Enzyme Profile", price: 1800, preparation: "Avoid caffeine 12 hrs before." },
      { name: "Arthritic Profile", price: 1200, preparation: "No fasting required." },
      { name: "Coagulation Profile", price: 2200, preparation: "Avoid blood thinners." },
      { name: "APLA", price: 1450, preparation: "No fasting required." },
      { name: "LA", price: 1400, preparation: "Doctor advised." },
    ],
    preparation: "Depends on profile chosen.",
    gradient: "from-cyan-400 to-cyan-600",
    icon: FaFlask,
  },

  // 🧬 Hormone
  "hormone-test": {
    slug: "hormone-test",
    title: "Hormone Tests",
    description: "Thyroid & reproductive hormones.",
    subTests: [
      { name: "FSH", price: 500, preparation: "No fasting required." },
      { name: "LH", price: 500, preparation: "No fasting required." },
      { name: "PRL", price: 550, preparation: "Morning fasting sample preferred." },
      { name: "Testosterone", price: 900, preparation: "Morning sample preferred." },
      { name: "Progesterone", price: 1500, preparation: "Sample timing depends on cycle." },
      { name: "PTH", price: 1800, preparation: "No fasting required." },
      { name: "AMH", price: 2200, preparation: "No fasting required." },
      { name: "E2", price: 1000, preparation: "Sample timing depends on cycle." },
    ],
    preparation: "Some require timing-based sample collection.",
    gradient: "from-orange-400 to-orange-600",
    icon: FaFlask,
  },

  // 🔬 Histopathology
  histopath: {
    slug: "histopath",
    title: "Histopathology",
    description: "Tissue biopsy analysis.",
    subTests: [
      { name: "FNAC", price: 3000, preparation: "Doctor advised." },
      { name: "Biopsy Small", price: 1200, preparation: "Doctor advised." },
      { name: "Biopsy Medium", price: 1800, preparation: "Doctor advised." },
      { name: "Biopsy Large", price: 2500, preparation: "Doctor advised." },
    ],
    preparation: "Depends on biopsy type.",
    gradient: "from-teal-400 to-teal-600",
    icon: FaMicroscope,
  },

  // 💉 Cytology
  cytology: {
    slug: "cytology",
    title: "Cytology",
    description: "Cell studies for early detection.",
    subTests: [
      { name: "Pap Smear", price: 300, preparation: "Avoid creams/intercourse 48 hrs before." },
      { name: "Cytology Smear", price: 1200, preparation: "Doctor advised." },
    ],
    preparation: "Doctor advised.",
    gradient: "from-emerald-400 to-emerald-600",
    icon: FaSyringe,
  },

  // 🧫 Culture
  "culture-test": {
    slug: "culture-test",
    title: "Culture Tests",
    description: "Detect bacterial/fungal infections.",
    subTests: [
      { name: "Urine C/S", price: 900, preparation: "Midstream urine sample required." },
      { name: "Blood C/S", price: 1400, preparation: "Fasting 4–6 hrs recommended." },
      { name: "Sputum C/S", price: 900, preparation: "Morning deep cough sample." },
      { name: "Ascitic Fluid C/S", price: 1000, preparation: "Doctor advised." },
      { name: "Pleural Fluid C/S", price: 1000, preparation: "Doctor advised." },
      { name: "Wound C/S", price: 900, preparation: "Doctor advised." },
      { name: "Pus C/S", price: 900, preparation: "Doctor advised." },
      { name: "CSF", price: 1200, preparation: "Doctor advised." },
      { name: "AFB C/S", price: 5000, preparation: "Doctor advised." },
    ],
    preparation: "Depends on sample site.",
    gradient: "from-gray-400 to-gray-600",
    icon: BiDna,
  },
};
