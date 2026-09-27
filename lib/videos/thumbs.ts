/**
 * Branded posters for the HTML §1.3 pilot (G2).
 * Solid #E34F26, white HTML5 mark and “HTML” together at the top left,
 * centered Oswald Bold topic, WebDevTV at the bottom left.
 * Clips without a branded poster keep `youtubeThumbUrl`
 * (`img.youtube.com/.../hqdefault.jpg`).
 * Keys are book TOC ids from `lecture-clips.json`, not YouTube ids — several
 * sections share one recording, and each card still needs its own title.
 */
export const HTML_1_3_POSTERS: Record<string, string> = {
  "sec-1-3": "/videos/thumbs/html-1-3/01-html-overview.jpg",
  "sec-1-3-1": "/videos/thumbs/html-1-3/02-headings-div.jpg",
  "sec-1-3-2": "/videos/thumbs/html-1-3/03-paragraphs.jpg",
  "sec-1-3-3": "/videos/thumbs/html-1-3/04-lists.jpg",
  "sec-1-3-6": "/videos/thumbs/html-1-3/05-html-forms.jpg",
  "sec-1-3-6-1": "/videos/thumbs/html-1-3/06-text-inputs.jpg",
  "sec-1-3-6-3": "/videos/thumbs/html-1-3/09-radio-buttons.jpg",
  "sec-1-3-6-4": "/videos/thumbs/html-1-3/10-checkboxes.jpg",
  "sec-1-3-6-5": "/videos/thumbs/html-1-3/11-dropdowns.jpg",
  "sec-1-3-6-7": "/videos/thumbs/html-1-3/12-buttons.jpg",
  "sec-1-3-9": "/videos/thumbs/html-1-3/07-anchors.jpg",
  "sec-1-3-11": "/videos/thumbs/html-1-3/08-layouts.jpg",
};

/**
 * Branded posters for CSS §2.1 (G2).
 * Solid #1572B6, white CSS3 mark + "CSS" top-left, Oswald Bold topic,
 * WebDevTV bottom-left.
 */
export const CSS_2_1_POSTERS: Record<string, string> = {
  "sec-2-1": "/videos/thumbs/css-2-1/01-what-is-css.jpg",
  "sec-2-1-1": "/videos/thumbs/css-2-1/02-style-attribute.jpg",
  "sec-2-1-2": "/videos/thumbs/css-2-1/03-importing-css.jpg",
  "sec-2-1-3": "/videos/thumbs/css-2-1/04-id-selectors.jpg",
  "sec-2-1-4": "/videos/thumbs/css-2-1/05-class-selectors.jpg",
  "sec-2-1-5": "/videos/thumbs/css-2-1/06-structure-selectors.jpg",
  "sec-2-1-6": "/videos/thumbs/css-2-1/07-specificity.jpg",
  "sec-2-1-7": "/videos/thumbs/css-2-1/08-text-color.jpg",
  "sec-2-1-8": "/videos/thumbs/css-2-1/09-background-color.jpg",
  "sec-2-1-9": "/videos/thumbs/css-2-1/10-borders.jpg",
  "sec-2-1-10": "/videos/thumbs/css-2-1/11-box-model.jpg",
  "sec-2-1-11": "/videos/thumbs/css-2-1/12-rounded-corners.jpg",
  "sec-2-1-12": "/videos/thumbs/css-2-1/13-dimensions.jpg",
  "sec-2-1-13": "/videos/thumbs/css-2-1/14-relative-position.jpg",
  "sec-2-1-14": "/videos/thumbs/css-2-1/15-absolute-position.jpg",
  "sec-2-1-15": "/videos/thumbs/css-2-1/16-fixed-position.jpg",
  "sec-2-1-16": "/videos/thumbs/css-2-1/17-z-index.jpg",
  "sec-2-1-17": "/videos/thumbs/css-2-1/18-float.jpg",
  "sec-2-1-18": "/videos/thumbs/css-2-1/19-float-grid.jpg",
  "sec-2-1-19": "/videos/thumbs/css-2-1/20-flexbox.jpg",
  "sec-2-1-20": "/videos/thumbs/css-2-1/21-media-queries.jpg",
};

/** Local poster for a mapped section, or null so the hub uses the YouTube still. */
export function brandedPosterUrl(bookSectionId: string): string | null {
  return HTML_1_3_POSTERS[bookSectionId] ?? CSS_2_1_POSTERS[bookSectionId] ?? null;
}
