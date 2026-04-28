/**
 * generateShareCard
 * Captures the off-screen card DOM node with html2canvas
 * and returns both a Blob (for Web Share API) and a dataUrl (for download fallback).
 *
 * @param {HTMLElement} element - ref to the card container
 * @returns {Promise<{ blob: Blob, dataUrl: string }>}
 */
export async function generateShareCard(element) {
  if (!element) throw new Error('Card element not found');

  // Dynamically import so it only loads when needed
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale: 2,            // 2× for crisp retina output
    useCORS: true,
    backgroundColor: null,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  const dataUrl = canvas.toDataURL('image/png');

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );

  return { blob, dataUrl };
}
