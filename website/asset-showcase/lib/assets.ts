/**
 * Catalogue for the Deconflict homepage "Section · Text · CTA · Image" table.
 *
 * The asset catalogue has been CLEARED — this is now an empty fill-in template.
 * The homepage section copy (heading / body / CTA) stays; the Image column is
 * blank, ready to be populated by adding rows to `sectionImages` below. The
 * original asset files still live under /public, so they can be re-referenced.
 */

/* -------------------------------------------------------------------------- *
 * Homepage sections + copy (from the Website 2.0 content doc)
 * -------------------------------------------------------------------------- */

export type SectionId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export type PageSection = { id: SectionId; title: string };

/** The homepage sections, in page order. */
export const pageSections: PageSection[] = [
  { id: 'S1', title: 'Banner' },
  { id: 'S2', title: 'Connected Intelligence' },
  { id: 'S3', title: 'Why Deconflict' },
  { id: 'S4', title: 'Verified Intelligence' },
  { id: 'S5', title: 'Resources & News' },
  { id: 'S6', title: 'Close' },
];

/** The homepage copy per section. */
export type HomeSectionContent = { id: SectionId; heading: string; text: string; cta: string };

export const homepageContent: HomeSectionContent[] = [
  {
    id: 'S1',
    heading: 'Investigative Intelligence for Compliance and Risk Teams',
    text: 'Go beyond standard transaction monitoring with direct, secure access to intelligence sourced straight from credentialed law enforcement.',
    cta: 'Schedule a Demo',
  },
  {
    id: 'S2',
    heading: 'Connected intelligence that goes beyond basic risk scoring',
    text: '',
    cta: 'Half-image link to respective product pages',
  },
  {
    id: 'S3',
    heading: 'Compliance Teams Need More Than Monitoring',
    text: 'Traditional blockchain analytics platforms generate alerts. Deconflict provides investigative context — visibility across the entire compliance lifecycle, from onboarding and monitoring to escalation and reporting. Built for scale: banks, exchanges, fintechs, and regulated institutions managing high-volume digital asset risk.',
    cta: '',
  },
  {
    id: 'S4',
    heading: 'Verified Intelligence for Faster Decisions',
    text: 'Three capability pillars — Law Enforcement Intelligence, Examiner-Ready Compliance, and Seamless Integration & Speed.',
    cta: '',
  },
  {
    id: 'S5',
    heading: 'Latest Resources & News',
    text: 'Pulls from the Blogs / resource section.',
    cta: '',
  },
  {
    id: 'S6',
    heading: 'Built for Institutions Managing Digital Asset Risk',
    text: 'Deconflict helps compliance and investigative teams operate with greater confidence in fast-moving digital asset environments.',
    cta: 'Schedule a Demo',
  },
];

/* -------------------------------------------------------------------------- *
 * Image rows — the fill-in catalogue
 *
 * Each entry renders one image in its section's Image cell. Add rows here to
 * populate the table. Types:
 *   - 'Background' / 'Raster' — a full-bleed plate (set `bgSrc`).
 *   - 'BG + SVG'              — a plate with an SVG on top (set `bgSrc` + `svgSrc`).
 *   - 'SVG only'              — a standalone vector (set `svgSrc`).
 * Paths are relative to /public, e.g. '/images/sections/s1-bg.png'.
 * -------------------------------------------------------------------------- */

export type ImageRowType = 'Background' | 'BG + SVG' | 'SVG only' | 'Raster';

export type ImageRow = {
  key: string;
  section: SectionId;
  name: string;
  type: ImageRowType;
  bgSrc?: string; // plate / render / raster
  svgSrc?: string; // SVG overlay or standalone vector
  dark?: boolean; // preview on a navy mat
  fit?: 'contain' | 'wide';
  paths: string[];
  note?: string;
};

/** The image catalogue — cleared. Add rows to fill the Image column. */
export const sectionImages: ImageRow[] = [];

/** One section's table block: its copy plus the image rows that fill it. */
export type SectionRows = { section: PageSection; content: HomeSectionContent; rows: ImageRow[] };

const contentFor = (id: SectionId): HomeSectionContent =>
  homepageContent.find((h) => h.id === id) as HomeSectionContent;

/** The homepage table: every section in page order with its (currently empty) image rows. */
export function homepageRows(): SectionRows[] {
  return pageSections.map((section) => ({
    section,
    content: contentFor(section.id),
    rows: sectionImages.filter((r) => r.section === section.id),
  }));
}
