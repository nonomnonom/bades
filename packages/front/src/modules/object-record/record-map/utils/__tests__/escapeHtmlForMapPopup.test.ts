import { escapeHtmlForMapPopup } from '@/object-record/record-map/utils/escapeHtmlForMapPopup';

describe('escapeHtmlForMapPopup', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtmlForMapPopup(`<script>alert("xss")</script>`)).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
  });

  it('should escape ampersand and single quote', () => {
    expect(escapeHtmlForMapPopup(`Tom & Jerry's "House"`)).toBe(
      'Tom &amp; Jerry&#39;s &quot;House&quot;',
    );
  });

  it('should leave safe text unchanged', () => {
    expect(escapeHtmlForMapPopup('Keluarga Budi Santoso')).toBe(
      'Keluarga Budi Santoso',
    );
  });
});
