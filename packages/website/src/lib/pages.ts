export const Pages = {
  Articles: 'articles',
  CaseStudies: 'caseStudies',
  ReleaseNotes: 'releaseNotes',
  Home: 'home',
  Partners: 'partners',
  Pricing: 'pricing',
  Product: 'product',
  WhyBades: 'whyBades',
} as const;

export type Page = (typeof Pages)[keyof typeof Pages];
