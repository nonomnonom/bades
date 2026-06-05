import { SID_STANDARD_MAP_NAVIGATION_ITEMS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-map-navigation.constant';

describe('SID_STANDARD_MAP_NAVIGATION_ITEMS', () => {
  it('should define four unique map navigation entries', () => {
    expect(SID_STANDARD_MAP_NAVIGATION_ITEMS).toHaveLength(4);

    const mapViewKeys = SID_STANDARD_MAP_NAVIGATION_ITEMS.map(
      (item) => item.mapViewKey,
    );

    expect(new Set(mapViewKeys).size).toBe(4);
    expect(
      SID_STANDARD_MAP_NAVIGATION_ITEMS.every((item) =>
        item.name.startsWith('Peta'),
      ),
    ).toBe(true);
  });
});
