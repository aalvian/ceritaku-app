import AddPresenter from "./add-presenter";

class AddPage {
  constructor() {
    this._presenter = null;
  }

  async render() {
    return `
    <h1>Tambah Cerita</h1>

    <section class="add-story">
        <form id="add-story-form">
          <label for="description">Deskripsi</label>
          <textarea id="description" required></textarea>

          <label for="open-camera">Gambar</label>
          <div class="camera-buttons">
            <button type="button" id="open-camera">Buka Kamera</button>
            <button type="button" id="close-camera">Tutup Kamera</button>
          </div>
          <video id="camera-preview" autoplay playsinline style="display:none; width:100%; max-width:300px;"></video>
          <button type="button" id="take-photo" style="display:none;">Ambil Gambar</button>
          <canvas id="photo-canvas" style="display:none;"></canvas>
          <img id="photo-result" src="" alt="Hasil Foto" style="display:none; width:100%; max-width:300px;"/>

          <label for="file-input">Pilih Gambar</label>
          <input type="file" id="file-input" class="input-image" accept="image/*" />

          <label>Lokasi</label>
          <div id="map" style="height: 300px;"></div>
          <input type="hidden" id="lat">
          <input type="hidden" id="lon">

          <button type="button" id="use-my-location">Lokasi Saya</button>
          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }
  async afterRender() {
    this._presenter = new AddPresenter();
    this._presenter.init();
  }
}

export default AddPage;
