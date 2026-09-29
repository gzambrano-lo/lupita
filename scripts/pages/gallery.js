(function () {
  const gallery = document.querySelector("[data-gallery-scroll]");
  const emptyMessage = document.querySelector("[data-gallery-empty]");
  const count = document.querySelector("[data-gallery-count]");
  const previousButton = document.querySelector("[data-gallery-previous]");
  const nextButton = document.querySelector("[data-gallery-next]");
  const images = Array.isArray(window.lupitaGalleryImages) ? window.lupitaGalleryImages : [];

  if (!gallery) return;

  const validImages = images.filter(function (image) {
    return image && typeof image.src === "string" && image.src.trim();
  });

  if (!validImages.length) {
    if (count) count.textContent = "0 photos";
    if (previousButton) previousButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
    return;
  }

  if (emptyMessage) emptyMessage.remove();

  const slides = validImages.map(function (image, index) {
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
    photo.style.setProperty("--photo-position", image.position || "center 30%");

    captionText.textContent = image.caption || "";
    date.className = "gallery-photo-date";
    date.textContent = image.date || "";
    caption.append(captionText, date);
    if (!image.caption && !image.date) caption.hidden = true;

    inner.append(photo, caption);
    figure.append(inner);
    gallery.append(figure);
    return figure;
  });

  let currentIndex = 0;
  let scrollFrame = 0;

  function updateCount() {
    if (count) count.textContent = (currentIndex + 1) + " / " + slides.length;
  }

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    const slideLeft = slides[currentIndex].getBoundingClientRect().left
      - gallery.getBoundingClientRect().left
      + gallery.scrollLeft;
    gallery.scrollTo({
      left: slideLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    updateCount();
  }

  if (previousButton) previousButton.addEventListener("click", function () {
    goTo(currentIndex - 1);
  });

  if (nextButton) nextButton.addEventListener("click", function () {
    goTo(currentIndex + 1);
  });

  gallery.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  });

  gallery.addEventListener("scroll", function () {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(function () {
      const nextIndex = Math.round(gallery.scrollLeft / Math.max(gallery.clientWidth, 1));
      currentIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1);
      updateCount();
    });
  }, { passive: true });

  updateCount();
})();
