(function () {
  const gallery = document.querySelector("[data-gallery-scroll]");
  const emptyMessage = document.querySelector("[data-gallery-empty]");
  const count = document.querySelector("[data-gallery-count]");
  const images = Array.isArray(window.lupitaGalleryImages) ? window.lupitaGalleryImages : [];

  if (!gallery) return;

  const validImages = images.filter(function (image) {
    return image && typeof image.src === "string" && image.src.trim();
  });

  if (!validImages.length) {
    if (count) count.textContent = "0 photos";
    return;
  }

  if (emptyMessage) emptyMessage.remove();

  validImages.forEach(function (image, index) {
    const figure = document.createElement("figure");
    const inner = document.createElement("div");
    const photo = document.createElement("img");
    const caption = document.createElement("figcaption");
    const captionText = document.createElement("span");
    const date = document.createElement("span");

    figure.className = "gallery-photo";
    inner.className = "gallery-photo-inner";
    photo.src = image.src;
    photo.alt = image.alt || "Photo of Lupita";
    photo.loading = index === 0 ? "eager" : "lazy";
    photo.decoding = "async";
    photo.style.setProperty("--photo-position", image.position || "center");

    captionText.textContent = image.caption || "";
    date.className = "gallery-photo-date";
    date.textContent = image.date || "";
    caption.append(captionText, date);
    if (!image.caption && !image.date) caption.hidden = true;

    inner.append(photo, caption);
    figure.append(inner);
    gallery.append(figure);
  });

  if (count) {
    count.textContent = validImages.length + (validImages.length === 1 ? " photo" : " photos");
  }
})();
