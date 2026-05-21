import { localizeHref, stripLocale } from '../utils/localize-href';

describe('localizeHref', () => {
  it('does not emit locale prefixes for locales the website does not publish yet', () => {
    expect(localizeHref('de-DE' as never, '/pricing')).toBe('/pricing');
  });

  it('emits the URL-segment prefix (not the AppLocale) for published non-default locales', () => {
    expect(localizeHref('id-ID', '/pricing')).toBe('/id-ID/pricing');
    expect(localizeHref('id-ID', '/')).toBe('/id-ID');
  });

  it('strips the canonical /id-ID URL segment when re-localising to the default locale', () => {
    expect(localizeHref('en', '/id-ID/pricing')).toBe('/pricing');
    expect(localizeHref('en', '/id-ID')).toBe('/');
  });

  it('returns paths unprefixed for the default locale (English at root)', () => {
    expect(localizeHref('en', '/pricing')).toBe('/pricing');
    expect(localizeHref('en', '/')).toBe('/');
  });

  it('keeps the root path unprefixed for unpublished locales', () => {
    expect(localizeHref('de-DE' as never, '/')).toBe('/');
  });

  it('preserves query strings and hash fragments', () => {
    expect(localizeHref('de-DE' as never, '/customers?ref=hero#top')).toBe(
      '/customers?ref=hero#top',
    );
    expect(localizeHref('en', '/customers?ref=hero#top')).toBe(
      '/customers?ref=hero#top',
    );
  });

  it('strips a redundant /en prefix when targeting the default locale', () => {
    expect(localizeHref('en', '/en/why-bades')).toBe('/why-bades');
    expect(localizeHref('en', '/en')).toBe('/');
  });

  it('strips an /en-prefixed path when targeting an unpublished locale', () => {
    expect(localizeHref('de-DE' as never, '/en/why-bades')).toBe('/why-bades');
    expect(localizeHref('de-DE' as never, '/en')).toBe('/');
  });

  it('passes external https URLs through unchanged', () => {
    expect(localizeHref('en', 'https://docs.bades.id')).toBe(
      'https://docs.bades.id',
    );
  });

  it('passes protocol-relative URLs through unchanged', () => {
    expect(localizeHref('en', '//cdn.bades.id/asset.png')).toBe(
      '//cdn.bades.id/asset.png',
    );
  });

  it('passes mailto and tel links through unchanged', () => {
    expect(localizeHref('en', 'mailto:contact@bades.id')).toBe(
      'mailto:contact@bades.id',
    );
    expect(localizeHref('en', 'tel:+1234567890')).toBe('tel:+1234567890');
  });

  it('passes hash-only and relative hrefs through unchanged', () => {
    expect(localizeHref('en', '#top')).toBe('#top');
    expect(localizeHref('en', './sibling')).toBe('./sibling');
    expect(localizeHref('en', '../parent')).toBe('../parent');
  });

  it('handles a published locale segment immediately followed by a query string', () => {
    expect(localizeHref('en', '/en?ref=hero')).toBe('/?ref=hero');
    expect(localizeHref('en', '/id-ID?ref=hero')).toBe('/?ref=hero');
  });

  it('handles a published locale segment immediately followed by a hash fragment', () => {
    expect(localizeHref('en', '/en#anchor')).toBe('/#anchor');
    expect(localizeHref('en', '/id-ID#anchor')).toBe('/#anchor');
  });
});

describe('stripLocale', () => {
  it('removes a published-locale URL-segment prefix from the pathname', () => {
    expect(stripLocale('/en/why-bades')).toBe('/why-bades');
    expect(stripLocale('/id-ID/customers/bades-demo')).toBe(
      '/customers/bades-demo',
    );
  });

  it('returns the root path when the pathname is just the locale segment', () => {
    expect(stripLocale('/en')).toBe('/');
    expect(stripLocale('/id-ID')).toBe('/');
  });

  it('returns the pathname unchanged when no published locale prefix is present', () => {
    expect(stripLocale('/why-bades')).toBe('/why-bades');
    expect(stripLocale('/')).toBe('/');
    expect(stripLocale('/fr-FR/foo')).toBe('/fr-FR/foo');
    expect(stripLocale('/zh-CN')).toBe('/zh-CN');
  });

  it('returns the pathname unchanged when the input does not start with a slash', () => {
    expect(stripLocale('not-a-path')).toBe('not-a-path');
    expect(stripLocale('')).toBe('');
  });

  it('preserves query and hash when the locale segment is immediately followed by them', () => {
    expect(stripLocale('/en?ref=hero')).toBe('/?ref=hero');
    expect(stripLocale('/id-ID#anchor')).toBe('/#anchor');
    expect(stripLocale('/id-ID/customers?ref=hero#top')).toBe(
      '/customers?ref=hero#top',
    );
  });
});
