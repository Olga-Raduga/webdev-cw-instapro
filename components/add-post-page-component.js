import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea
            id="description-input"
            class="input"
            placeholder="Описание поста"
            rows="5"
          ></textarea>
          <button class="button" id="add-button">
            Добавить пост
          </button>
        </div>
      </div>
    </div>
  `;
  appEl.innerHTML = appHtml;
  renderHeaderComponent({
    element: appEl.querySelector(".header-container"),
  });
  renderUploadImageComponent({
    element: appEl.querySelector(".upload-image-container"),
    onImageUrlChange(newImageUrl) {
      imageUrl = newImageUrl;
    },
  });
  appEl.querySelector("#add-button").addEventListener("click", () => {
    const description = appEl
      .querySelector("#description-input")
      .value.trim();
    if (!description) {
      alert("Введите описание поста");
      return;
    }
    if (!imageUrl) {
      alert("Выберите фотографию");
      return;
    }
    onAddPostClick({
      description,
      imageUrl,
    });
  });
}
