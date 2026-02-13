(() => {
    const WORKER_ENDPOINT = "https://lupita-vibe-agent-worker.gzamlo98.workers.dev/api/vibe";
    const REQUEST_TIMEOUT_MS = 10000;

    const logEl = document.getElementById("va-log");
    const form = document.getElementById("va-form");
    const input = document.getElementById("va-input");
    const pill = document.getElementById("va-state");
    const resetBtn = document.getElementById("va-reset");
    const toggleBtn = document.getElementById("va-toggle");

    if (!logEl || !form || !input || !pill || !resetBtn || !toggleBtn) return;

    let chaos = false;
    const states = ["calm", "anxious", "rage", "numb", "embarrassed"];
    let state = "calm";
    let typingEl = null;

    const tone = {
        calm: {
            opener: ["okay okay we can handle this", "cill out. ur good.", "we got this. slowly."],
            style: "helpful"
        },
        anxious: {
            opener: ["wait... are we sure", "hold on i need reassurance", "my brain is buffering"],
            style: "overthink"
        },
        rage: {
            opener: ["absolutely not.", "nope. disrespect detected.", "i am choosing metaphorical violence."],
            style: "boundaries"
        },
        numb: {
            opener: ["whatever.", "it is fine. i guess.", "nothing matters lol."],
            style: "minimal"
        },
        embarrassed: {
            opener: ["delete this conversation", "why did i say that.", "i would like to evaporate now."],
            style: "selfaware"
        }
    };

    function addMsg(text, who = "bot") {
        const div = document.createElement("div");
        div.className = "va-msg " + (who === "me" ? "va-me" : "va-bot");
        div.textContent = text;
        logEl.appendChild(div);
        logEl.scrollTop = logEl.scrollHeight;
    }

    function showTyping() {
        if (typingEl) return;
        typingEl = document.createElement("div");
        typingEl.className = "va-msg va-bot va-typing";
        typingEl.innerHTML = "<span></span><span></span><span></span>";
        logEl.appendChild(typingEl);
        logEl.scrollTop = logEl.scrollHeight;
    }

    function hideTyping() {
        if (!typingEl) return;
        typingEl.remove();
        typingEl = null;
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function setState(next) {
        if (!states.includes(next)) return;
        state = next;
        pill.textContent = state;
    }

    function maybeSwitchState(userText) {
        const t = userText.toLowerCase();

        if (t.includes("sorry") || t.includes("my bad")) return "embarrassed";
        if (t.includes("deadline") || t.includes("late") || t.includes("test")) return "anxious";
        if (t.includes("dish") || t.includes("disrespect") || t.includes("annoy")) return "rage";
        if (t.includes("idk") || t.includes("whatever")) return "numb";

        if (chaos && Math.random() < 0.45) return pick(states);
        if (Math.random() < 0.15) return pick(states);
        return state;
    }

    function respondLocal(userText) {
        const s = tone[state];
        const opener = pick(s.opener);

        let body = "";
        if (s.style === "helpful") {
            body = "tell me the goal in 1 sentence, and i will give you 3 tiny next steps.";
        } else if (s.style === "overthink") {
            body = "quick question: are we spiraling or problem-solving. choose one.";
        } else if (s.style === "boundaries") {
            body = 'boundary suggestion: "i cannot do that right now. i will reply when i can."';
        } else if (s.style === "minimal") {
            body = "noted. (i support you from a distance.)";
        } else {
            body = "anyway. we move forward. like nothing happened.";
        }

        if (userText.toLowerCase().includes("blog")) {
            body = "write the hook first. one sentence. then we build.";
        }

        return opener + " " + body;
    }

    async function withTimeout(fetchPromise, timeoutMs) {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
        });

        try {
            return await Promise.race([fetchPromise, timeoutPromise]);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function respondViaWorker(userText) {
        const response = await withTimeout(
            fetch(WORKER_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText, state, chaos })
            }),
            REQUEST_TIMEOUT_MS
        );

        if (!response.ok) {
            throw new Error("Worker returned HTTP " + response.status);
        }

        const data = await response.json();

        return {
            nextState: states.includes(data.state) ? data.state : state,
            reply: typeof data.reply === "string" ? data.reply : ""
        };
    }

    function boot() {
        logEl.innerHTML = "";
        setState("calm");
        addMsg("what do you want?", "bot");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addMsg(text, "me");
        input.value = "";
        input.focus();

        showTyping();
        try {
            const fromWorker = await respondViaWorker(text);
            setState(fromWorker.nextState);
            hideTyping();

            addMsg(fromWorker.reply || "no reply came back from worker.", "bot");
        } catch (err) {
            console.error("[vibe-agent] worker failed, using local fallback:", err);
            setState(maybeSwitchState(text));
            hideTyping();
            addMsg(respondLocal(text), "bot");
        }
    });

    resetBtn.addEventListener("click", () => {
        boot();
        input.focus();
    });

    toggleBtn.addEventListener("click", () => {
        chaos = !chaos;
        addMsg(chaos ? "chaos mode: ON" : "chaos mode: OFF", "bot");
    });

    boot();
})();
