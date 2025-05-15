import { addStory } from "../../data/story-api";
import L from "leaflet";

class AddPresenter {
  constructor() {
    this.video = null;
    this.stream = null;
    this.canvas = null;
    this.map = null;
    this.lat = null;
    this.lon = null;
    this.photoResult = null;
  }

  init() {
    this.video = document.getElementById("camera-preview");
    this.canvas = document.getElementById("photo-canvas");
    this.photoResult = document.getElementById("photo-result");
    const fileInput = document.getElementById("file-input");

    fileInput.addEventListener("change", (event) =>
      this.handleFileInput(event),
    );

    document
      .getElementById("open-camera")
      .addEventListener("click", () => this.openCamera());
    document
      .getElementById("close-camera")
      .addEventListener("click", () => this.closeCamera());
    document
      .getElementById("take-photo")
      .addEventListener("click", () => this.takePhoto());
    document
      .getElementById("add-story-form")
      .addEventListener("submit", (e) => this.submitForm(e));

    this.initMap();
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoResult.src = e.target.result;
        this.photoResult.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }

  async openCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = this.stream;
      this.video.style.display = "block";
      document.getElementById("take-photo").style.display = "inline-block";
      document.getElementById("close-camera").style.display = "inline-block";
    } catch (err) {
      alert("Gagal membuka kamera: " + err.message);
    }
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.video.style.display = "none";
    document.getElementById("take-photo").style.display = "none";
  }

  takePhoto() {
    const context = this.canvas.getContext("2d");
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    const photoResult = document.getElementById("photo-result");
    photoResult.src = this.canvas.toDataURL("image/jpeg");
    photoResult.style.display = "block";

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.video.style.display = "none";
      document.getElementById("take-photo").style.display = "none";
    }
  }

  initMap() {
    document
      .getElementById("use-my-location")
      .addEventListener("click", () => this.useMyLocation());

    this.map = L.map("map").setView([-7.797068, 110.370529], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    const marker = L.marker([0, 0], { draggable: true }).addTo(this.map);

    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;
      this.lat = lat;
      this.lon = lng;
    });
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.lat = latitude;
        this.lon = longitude;

        document.getElementById("lat").value = latitude;
        document.getElementById("lon").value = longitude;

        const marker = L.marker([latitude, longitude]).addTo(this.map);
        this.map.setView([latitude, longitude], 15);
      },
      (error) => {
        alert("Gagal mendapatkan lokasi: " + error.message);
      },
    );
  }

  async submitForm(e) {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const imageDataUrl = document.getElementById("photo-result").src;
    const lat = this.lat;
    const lon = this.lon;

    if (!imageDataUrl || !lat || !lon) {
      alert("Pastikan sudah mengambil gambar dan lokasi.");
      return;
    }

    const blob = await (await fetch(imageDataUrl)).blob();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", blob, "story.jpg");
    formData.append("lat", lat);
    formData.append("lon", lon);

    const token = localStorage.getItem("token");
    const result = await addStory(formData, token);
    alert(result.message);

    if (!result.error) {
      window.location.hash = "/";
    }
  }
}

export default AddPresenter;
