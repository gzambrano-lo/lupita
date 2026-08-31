(function () {
  const species = [
    { id: "fish", icon: "&#128031;", label: "fish" },
    { id: "jelly", icon: "&#129756;", label: "jelly" },
    { id: "crab", icon: "&#129408;", label: "crab" },
    { id: "squid", image: "/assets/fishbowl/species/squid.png", label: "squid" },
    { id: "shrimp", image: "/assets/fishbowl/species/shrimp.png", label: "shrimp" },
    { id: "whale", image: "/assets/fishbowl/species/whale.png", label: "whale" },
    { id: "star", icon: "&#11088;", label: "star" },
    { id: "turtle", icon: "&#128034;", label: "turtle" }
  ];

  const colors = [
    { id: "coral", hex: "#F28482", filter: "none" },
    { id: "sage", hex: "#84A59D", filter: "hue-rotate(150deg) saturate(1.3)" },
    { id: "pink", hex: "#F5CAC3", filter: "hue-rotate(300deg) saturate(1.1)" },
    { id: "gold", hex: "#E8C173", filter: "hue-rotate(45deg) saturate(1.4)" },
    { id: "lavender", hex: "#C9B8E8", filter: "hue-rotate(230deg) saturate(1.3)" },
    { id: "soft", hex: "#D8E2DC", filter: "saturate(.5) brightness(1.05)" }
  ];

  const accessories = [
    { id: "none", icon: "", label: "none" },
    { id: "bow", image: "/assets/fishbowl/accessory/bow.PNG", label: "bow" },
    { id: "sparkle", icon: "&#10024;", label: "sparkle" },
    { id: "crown", icon: "&#128081;", label: "crown" }
  ];

  const storageKey = "fishbowl-creatures-v1";
  const state = {
    name: "",
    species: "fish",
    color: "coral",
    accessory: "none",
    creatures: []
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const findById = (list, id) => list.find((item) => item.id === id) || list[0];

  const renderSpeciesVisual = (item, className) => item.image
    ? `<img class="${className} creature-image" src="${item.image}" alt="" aria-hidden="true">`
    : `<span class="${className}" aria-hidden="true">${item.icon}</span>`;

  const renderAccessoryVisual = (item, className) => item.image
    ? `<img class="${className} accessory-image" src="${item.image}" alt="" aria-hidden="true">`
    : `<span class="${className}" aria-hidden="true">${item.icon || "&#128683;"}</span>`;

  const renderCreatureVisual = (creature) => creature.speciesImage
    ? `<img class="tank-creature-image" src="${creature.speciesImage}" alt="" aria-hidden="true">`
    : `<span class="tank-creature-emoji" aria-hidden="true">${creature.speciesIcon}</span>`;

  const getCreatureSpeciesId = (creature) => {
    if (creature.speciesId) return creature.speciesId;
    const matchedSpecies = species.find((item) => (
      (item.image && item.image === creature.speciesImage) ||
      (item.icon && item.icon === creature.speciesIcon)
    ));
    return matchedSpecies ? matchedSpecies.id : "unknown";
  };

  const seededRand = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const readSavedCreatures = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  };

  const persist = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.creatures));
    } catch (error) {
      return;
    }
  };

  const setButtonSelection = (group, value) => {
    document.querySelectorAll(`[data-choice-group="${group}"]`).forEach((button) => {
      const selected = button.dataset.choiceId === value;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const renderOptions = () => {
    const speciesTarget = document.querySelector('[data-option-group="species"]');
    const colorTarget = document.querySelector('[data-option-group="color"]');
    const accessoryTarget = document.querySelector('[data-option-group="accessory"]');

    speciesTarget.innerHTML = species.map((item) => `
      <button class="creature-option" type="button" data-choice-group="species" data-choice-id="${item.id}" aria-pressed="false">
        ${renderSpeciesVisual(item, "creature-emoji")}
        <span class="creature-label">${item.label}</span>
      </button>
    `).join("");

    colorTarget.innerHTML = colors.map((item) => `
      <button class="color-option" type="button" data-choice-group="color" data-choice-id="${item.id}" aria-label="${item.id}" aria-pressed="false" style="--swatch:${item.hex}"></button>
    `).join("");

    accessoryTarget.innerHTML = accessories.map((item) => `
      <button class="creature-option" type="button" data-choice-group="accessory" data-choice-id="${item.id}" aria-pressed="false">
        ${renderAccessoryVisual(item, "creature-emoji")}
        <span class="creature-label">${item.label}</span>
      </button>
    `).join("");
  };

  const renderPreview = () => {
    const selectedSpecies = findById(species, state.species);
    const selectedColor = findById(colors, state.color);
    const selectedAccessory = findById(accessories, state.accessory);
    const previewCreature = document.querySelector(".preview-creature");

    document.querySelector("[data-preview-species]").innerHTML = renderSpeciesVisual(selectedSpecies, "preview-species-visual");
    document.querySelector("[data-preview-accessory]").innerHTML = selectedAccessory.id === "none"
      ? ""
      : renderAccessoryVisual(selectedAccessory, "preview-accessory-visual");
    document.querySelector("[data-preview-name]").textContent = state.name.trim() || `${selectedSpecies.label} friend`;
    previewCreature.style.setProperty("--preview-filter", selectedColor.filter);
    setButtonSelection("species", state.species);
    setButtonSelection("color", state.color);
    setButtonSelection("accessory", state.accessory);
  };

  const renderCreatures = () => {
    const tank = document.querySelector("[data-tank]");
    const list = document.querySelector("[data-creature-list]");
    const empty = document.querySelector("[data-empty-message]");
    const note = document.querySelector("[data-population-note]");

    tank.querySelectorAll(".tank-creature").forEach((node) => node.remove());

    state.creatures.forEach((creature) => {
      const item = document.createElement("div");
      item.className = "tank-creature";
      item.dataset.speciesId = getCreatureSpeciesId(creature);
      item.title = creature.name;
      item.style.setProperty("--creature-left", `${creature.left}%`);
      item.style.setProperty("--creature-top", `${creature.top}%`);
      item.style.setProperty("--creature-filter", creature.colorFilter);
      item.style.setProperty("--creature-duration", `${creature.duration}s`);
      item.style.setProperty("--creature-delay", `${creature.delay}s`);
      item.innerHTML = `
        ${renderCreatureVisual(creature)}
        ${creature.accessoryImage ? `<img class="tank-creature-accessory tank-accessory-image" src="${creature.accessoryImage}" alt="" aria-hidden="true">` : ""}
        ${!creature.accessoryImage && creature.accessoryIcon ? `<span class="tank-creature-accessory" aria-hidden="true">${creature.accessoryIcon}</span>` : ""}
        <span class="tank-creature-name">${escapeHtml(creature.name)}</span>
      `;
      tank.append(item);
    });

    list.innerHTML = state.creatures.map((creature) => `
      <li>
        ${creature.speciesImage
          ? `<img class="creature-list-image" src="${creature.speciesImage}" alt="" aria-hidden="true">`
          : `<span aria-hidden="true">${creature.speciesIcon}</span>`}
        <span>${escapeHtml(creature.name)}</span>
        <button class="remove-creature" type="button" data-remove-creature="${creature.id}" aria-label="remove ${escapeHtml(creature.name)} from the tank">&times;</button>
      </li>
    `).join("");

    const count = state.creatures.length;
    empty.hidden = count > 0;
    note.textContent = count === 0
      ? "no creatures yet."
      : `${count} ${count === 1 ? "creature has" : "creatures have"} been added to the tank.`;
  };

  const releaseCreature = () => {
    const selectedSpecies = findById(species, state.species);
    const selectedColor = findById(colors, state.color);
    const selectedAccessory = findById(accessories, state.accessory);
    const seed = Date.now() + Math.random() * 1000;
    const name = state.name.trim() || `${selectedSpecies.label} friend`;

    state.creatures = state.creatures.concat({
      id: `c${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name,
      speciesId: selectedSpecies.id,
      speciesIcon: selectedSpecies.icon,
      speciesImage: selectedSpecies.image,
      colorFilter: selectedColor.filter,
      accessoryIcon: selectedAccessory.icon,
      accessoryImage: selectedAccessory.image,
      left: Math.round((8 + seededRand(seed) * 78) * 10) / 10,
      top: Math.round((10 + seededRand(seed + 1) * 62) * 10) / 10,
      duration: Math.round((9 + seededRand(seed + 2) * 8) * 10) / 10,
      delay: Math.round((seededRand(seed + 3) * -6) * 10) / 10
    });

    state.name = "";
    document.querySelector("#creature-name").value = "";
    persist();
    renderPreview();
    renderCreatures();
  };

  window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#fishbowl-form");
    const nameInput = document.querySelector("#creature-name");

    if (!form || !nameInput) return;

    state.creatures = readSavedCreatures();
    renderOptions();
    renderPreview();
    renderCreatures();

    nameInput.addEventListener("input", (event) => {
      state.name = event.target.value;
      renderPreview();
    });

    document.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-choice-group]");
      if (choice) {
        state[choice.dataset.choiceGroup] = choice.dataset.choiceId;
        renderPreview();
        return;
      }

      const removeButton = event.target.closest("[data-remove-creature]");
      if (removeButton) {
        state.creatures = state.creatures.filter((creature) => creature.id !== removeButton.dataset.removeCreature);
        persist();
        renderCreatures();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      releaseCreature();
    });
  });
}());
