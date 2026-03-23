(function () {
    const configNode = document.getElementById("languageToggleConfig");
    const toggleBtn = document.querySelector("[data-language-toggle]");

    if (!configNode || !toggleBtn) {
        return;
    }

    let config;

    try {
        config = JSON.parse(configNode.textContent);
    } catch (jsonError) {
        try {
            config = Function("return (" + configNode.textContent + ");")();
        } catch (evalError) {
            console.error("Failed to parse language toggle config.", jsonError, evalError);
            return;
        }
    }

    const translations = config.translations || {};
    const defaultLanguage = config.defaultLanguage || "en";
    const storageKey = config.storageKey || "site-language";
    const toggleLabel = config.toggleLabel || "EN / ES";
    const toggleAria = config.toggleAria || {};
    const note = document.querySelector("[data-language-note]");
    const noteCloseBtn = document.querySelector("[data-language-note-close]");

    function readStoredLanguage() {
        try {
            return localStorage.getItem(storageKey) || defaultLanguage;
        } catch (error) {
            console.error(error);
            return defaultLanguage;
        }
    }

    function storeLanguage(language) {
        try {
            localStorage.setItem(storageKey, language);
        } catch (error) {
            console.error(error);
        }
    }

    function applyText(language) {
        const copy = translations[language] || translations[defaultLanguage];

        document.querySelectorAll("[data-i18n]").forEach(function (node) {
            const key = node.dataset.i18n;
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                node.textContent = copy[key];
            }
        });

        document.querySelectorAll("[data-i18n-html]").forEach(function (node) {
            const key = node.dataset.i18nHtml;
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                node.innerHTML = copy[key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
            const key = node.dataset.i18nPlaceholder;
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                node.setAttribute("placeholder", copy[key]);
            }
        });

        document.querySelectorAll("[data-i18n-value]").forEach(function (node) {
            const key = node.dataset.i18nValue;
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                node.value = copy[key];
            }
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach(function (node) {
            const key = node.dataset.i18nAriaLabel;
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                node.setAttribute("aria-label", copy[key]);
            }
        });

        document.querySelectorAll("[data-i18n-title]").forEach(function (node) {
            const key = node.dataset.i18nTitle;
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                node.setAttribute("title", copy[key]);
            }
        });

        if (copy.pageTitle) {
            document.title = copy.pageTitle;
        }

        document.documentElement.lang = language;
        toggleBtn.textContent = toggleLabel;
        toggleBtn.setAttribute("aria-pressed", language === "es" ? "true" : "false");
        toggleBtn.setAttribute(
            "aria-label",
            language === "es"
                ? (toggleAria.esToEn || "Switch page language to English")
                : (toggleAria.enToEs || "Switch page language to Spanish")
        );

        storeLanguage(language);
    }

    toggleBtn.addEventListener("click", function () {
        const currentLanguage = document.documentElement.lang === "es" ? "es" : "en";
        const nextLanguage = currentLanguage === "es" ? "en" : "es";
        applyText(nextLanguage);
    });

    if (note && noteCloseBtn) {
        noteCloseBtn.addEventListener("click", function () {
            note.hidden = true;
        });
    }

    applyText(readStoredLanguage());
})();
