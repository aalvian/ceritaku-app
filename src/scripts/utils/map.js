import L from "leaflet";

class StoryMap {
  constructor(containerId) {
    this.map = L.map(containerId, {
      center: [-6.2025, 106.6186],
      zoom: 5,
      scrollWheelZoom: true,
    });

    this.markers = [];
    this._initBaseLayers();
  }

  _initBaseLayers() {
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const osmHOT = L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    );

    const openTopoMap = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    );

    this.baseLayers = {
      OpenStreetMap: osm,
      "OpenStreetMap.HOT": osmHOT,
      OpenTopoMap: openTopoMap,
    };

    L.control.layers(this.baseLayers).addTo(this.map);
  }

  addMarkers(stories) {
    this.clearMarkers();

    stories
      .filter((story) => story.lat && story.lon)
      .forEach((story) => {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`<b>${story.name}</b>`).openPopup();
        this.markers.push(marker);
      });
  }

  clearMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];
  }

  getMapInstance() {
    return this.map;
  }
}

export default StoryMap;
