import {
  isMapUsable,
  safeGetMapSource,
  safeRemoveMapControl,
} from '@/object-record/record-map/utils/isMapStyleLoaded';

const createMockMap = (options: {
  styleLoaded?: boolean;
  style?: object;
  getSourceThrows?: boolean;
  removeControlThrows?: boolean;
}) => {
  const {
    styleLoaded = true,
    style = { layers: [] },
    getSourceThrows = false,
    removeControlThrows = false,
  } = options;

  return {
    getStyle: jest.fn(() => style),
    isStyleLoaded: jest.fn(() => styleLoaded),
    getSource: jest.fn(() => {
      if (getSourceThrows) {
        throw new Error('style undefined');
      }
      return { id: 'records' };
    }),
    removeControl: jest.fn(() => {
      if (removeControlThrows) {
        throw new Error('control already removed');
      }
    }),
  } as unknown as mapboxgl.Map;
};

describe('isMapStyleLoaded utils', () => {
  it('isMapUsable mengembalikan false untuk map null', () => {
    expect(isMapUsable(null)).toBe(false);
  });

  it('isMapUsable mengembalikan false jika getStyle melempar', () => {
    const map = {
      getStyle: jest.fn(() => {
        throw new Error('removed');
      }),
      isStyleLoaded: jest.fn(() => true),
    } as unknown as mapboxgl.Map;

    expect(isMapUsable(map)).toBe(false);
  });

  it('safeGetMapSource tidak melempar saat style sudah di-teardown', () => {
    const map = createMockMap({ getSourceThrows: true });

    expect(safeGetMapSource(map, 'records')).toBeUndefined();
  });

  it('safeRemoveMapControl menelan error removeControl', () => {
    const map = createMockMap({ removeControlThrows: true });
    const control = {} as mapboxgl.IControl;

    expect(() => safeRemoveMapControl(map, control)).not.toThrow();
  });
});
