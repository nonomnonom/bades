const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtmlForMapPopup = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) => HTML_ESCAPE_MAP[character] ?? character,
  );
