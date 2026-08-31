window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".js-carousel").forEach((carousel) => {
        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const prevBtn = carousel.querySelector(".carousel-btn.prev");
        const nextBtn = carousel.querySelector(".carousel-btn.next");
        const dotsWrap = carousel.querySelector(".carousel-dots");

        if (!slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

        let index = slides.findIndex((s) => s.classList.contains("is-active"));
        if (index < 0) index = 0;

        const dots = slides.map((_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `Go to image ${i + 1}`);
            dot.addEventListener("click", () => setSlide(i));
            dotsWrap.appendChild(dot);
            return dot;
        });

        function setSlide(nextIndex) {
            slides[index].classList.remove("is-active");
            dots[index].classList.remove("is-active");

            index = (nextIndex + slides.length) % slides.length;

            slides[index].classList.add("is-active");
            dots[index].classList.add("is-active");
        }

        prevBtn.addEventListener("click", () => setSlide(index - 1));
        nextBtn.addEventListener("click", () => setSlide(index + 1));

        carousel.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") setSlide(index - 1);
            if (e.key === "ArrowRight") setSlide(index + 1);
        });

        carousel.setAttribute("tabindex", "0");
        setSlide(index);
    });
});
