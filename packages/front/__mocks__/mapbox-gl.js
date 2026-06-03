// Manual mock untuk `mapbox-gl` — dipakai oleh `RecordMap.test.tsx`.
// Constructor di sini minimal: hanya butuh memenuhi permukaan API yang
// dipakai RecordMap (Map, Marker, Popup, LngLatBounds, NavigationControl)
// dengan method no-op. Behavior WebGL/canvas tidak diperlukan di jsdom.

// Helper — setTimeout 0 supaya callback yang di-defer ke "load" event
// diproses setelah render test.
const defer = (callback) => setTimeout(callback, 0);

class MockMap {
  constructor(options) {
    this.options = options;
  }

  on(event, callback) {
    if (event === 'load') {
      defer(callback);
    }

    return this;
  }

  addControl() {
    return this;
  }

  remove() {}

  getCenter() {
    return { lng: 110.61, lat: -7.41 };
  }

  getZoom() {
    return 13;
  }

  fitBounds() {
    return this;
  }

  flyTo() {
    return this;
  }
}

class MockMarker {
  constructor(options) {
    this.element = options?.element ?? null;
  }

  setLngLat() {
    return this;
  }

  setPopup() {
    return this;
  }

  addTo() {
    return this;
  }

  remove() {}
}

class MockPopup {
  constructor() {}

  setHTML() {
    return this;
  }
}

class MockLngLatBounds {
  extend() {
    return this;
  }
}

class MockNavigationControl {}

const defaultExport = {
  Map: MockMap,
  Marker: MockMarker,
  Popup: MockPopup,
  LngLatBounds: MockLngLatBounds,
  NavigationControl: MockNavigationControl,
};

module.exports = defaultExport;
module.exports.default = defaultExport;
