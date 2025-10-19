export type Offer = {
  slug: string;
  title: string;
  price: number;
  mrp: number;
  includes: string;
  tag: string;
  start: string; // display date
  end: string;   // display date
  description?: string;
  tests?: string[];
};

export const offers: Offer[] = [
  {
    slug: "full-body-checkup",
    title: "Full Body Checkup",
    price: 1499,
    mrp: 2499,
    includes: "65+ tests",
    tag: "Best Seller",
    start: "1 Oct 2025",
    end: "31 Oct 2025",
    description: "Comprehensive health screening covering key organ functions.",
    tests: ["CBC", "LFT", "KFT", "Lipid Profile", "Thyroid (TSH)", "Fasting Glucose"],
  },
  {
    slug: "diabetes-package",
    title: "Diabetes Package",
    price: 699,
    mrp: 1099,
    includes: "HbA1c, FBS, PPBS",
    tag: "Popular",
    start: "1 Oct 2025",
    end: "31 Oct 2025",
    description: "Monitoring and screening for diabetes and glucose control.",
    tests: ["HbA1c", "Fasting Blood Sugar (FBS)", "Post Prandial Blood Sugar (PPBS)"],
  },
  {
    slug: "thyroid-profile",
    title: "Thyroid Profile",
    price: 499,
    mrp: 899,
    includes: "T3, T4, TSH",
    tag: "Limited Time",
    start: "1 Oct 2025",
    end: "31 Oct 2025",
    description: "Evaluate thyroid gland function and detect imbalances.",
    tests: ["Total T3", "Total T4", "TSH"],
  },
];
