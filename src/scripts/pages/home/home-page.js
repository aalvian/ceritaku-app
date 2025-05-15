import HomePresenter from "./home-presenter";
import StoryMap from "../../utils/map";
import { saveStory, checkIfStorySaved } from "../../data/database";

class HomePage {
  constructor() {
    this._map = null;
    this._markers = [];
    this.storyMap = null;
    this.stories = [];
    this.saveButtons = [];
  }

  async render() {
    return `
      <div id="loading" class="loading" style="display:none;">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>

      <h1>Daftar Cerita</h1>
      <section class="home">
        <div id="story-list"></div>
        <div id="map-container" style="height: 400px; margin-top: 60px;"></div>
      </section>
    `;
  }

  async afterRender() {
    this.initMap();
    const presenter = new HomePresenter(this);
    await presenter.showStories();
  }

  initMap() {
    this.storyMap = new StoryMap("map-container");
    this._map = this.storyMap.getMapInstance();
    this._markers = [];
  }

  async renderStories(stories) {
    this.stories = stories;
    const container = document.getElementById("story-list");

    if (!container) {
      console.error("Story list container not found");
      return;
    }

    try {
      const storiesWithSaveStatus = await Promise.all(
        stories.map(async (story) => {
          return {
            ...story,
            isSaved: await checkIfStorySaved(story.id),
          };
        }),
      );

      container.innerHTML = storiesWithSaveStatus
        .map((story) => this.createStoryCard(story))
        .join("");

      this.addStoryMarkers(stories);
      this.setupSaveButtons();
    } catch (error) {
      console.error("Error rendering stories:", error);
    }
  }

  createStoryCard(story) {
    return `
      <div class="story" data-id="${story.id}" data-lat="${story.lat || ""}" data-lon="${story.lon || ""}">
        <img src="${story.photoUrl}" alt="${story.description}">
        <p>${story.name}</p>
        <p>${story.description}</p>
        ${
          story.lat && story.lon
            ? `
          <small class="location">
            <i class="fas fa-map-marker-alt"></i> Lokasi
            ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
          </small>
        `
            : ""
        }
        <small>Dibuat Pada: ${new Date(story.createdAt).toLocaleString("id-ID")}</small>
        <button class="save-btn" data-id="${story.id}">
          Simpan
        </button>
      </div>
    `;
  }

  setupSaveButtons() {
    this.saveButtons.forEach(({ button, handler }) => {
      button.removeEventListener("click", handler);
    });
    this.saveButtons = [];

    const buttons = document.querySelectorAll(".save-btn");
    buttons.forEach((button) => {
      const handler = this.handleSaveClick.bind(this);
      button.addEventListener("click", handler);
      this.saveButtons.push({ button, handler });
    });
  }

  async handleSaveClick(e) {
    const button = e.currentTarget;
    button.disabled = true;

    try {
      const storyId = button.dataset.id;
      const story = this.stories.find((s) => s.id === storyId);

      if (!story) return;

      const isCurrentlySaved = await checkIfStorySaved(storyId);
      if (isCurrentlySaved) {
        alert("Cerita ini sudah disimpan sebelumnya");
        return;
      }

      await saveStory(story);
      alert("Cerita berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan cerita:", error);
      alert("Gagal menyimpan cerita");
    } finally {
      button.disabled = false;
    }
  }

  addStoryMarkers(stories) {
    this.storyMap.addMarkers(stories);
    this._markers = this.storyMap.markers;
  }

  showLoading() {
    document.getElementById("loading").style.display = "flex";
  }

  hideLoading() {
    document.getElementById("loading").style.display = "none";
  }
}

export default HomePage;
