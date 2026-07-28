/* ============================================================
   comments.js - talks to the blog-comments Cloudflare Worker.
   Drop-in for standalone post pages.
   ============================================================ */
(function () {
  const API_BASE = "https://blog-comments.tinywebpractice.workers.dev";

  const root = document.querySelector(".comments-card");
  if (!root) return;

  const slug = root.dataset.commentsSlug;
  const listEl = root.querySelector("#commentList");
  const countEl = root.querySelector("#commentCount");
  const emptyEl = root.querySelector("#commentEmpty");
  const form = root.querySelector("#commentForm");
  const postBtn = form ? form.querySelector(".post-btn") : null;

  if (!slug || !listEl || !countEl || !emptyEl || !form || !postBtn) return;

  let comments = [];
  let sort = "newest";

  function rel(t) {
    const s = Math.max(0, (Date.now() - t) / 1000 | 0);
    if (s < 45) return "just now";
    const m = (s / 60) | 0;
    if (m < 60) return m + "m ago";
    const h = (m / 60) | 0;
    if (h < 24) return h + "h ago";
    const d = (h / 24) | 0;
    if (d < 7) return d + "d ago";
    const dt = new Date(t);
    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + String(dt.getFullYear()).slice(2);
  }

  function makeReactionButton(type, label, count) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill-btn react-btn";
    btn.dataset.type = type;
    btn.append(document.createTextNode(label + " "));

    const countEl = document.createElement("span");
    countEl.textContent = count;
    btn.append(countEl);

    return btn;
  }

  function makeCommentItem(comment) {
    const item = document.createElement("li");
    item.className = "comment-item";
    item.dataset.id = comment.id;

    const head = document.createElement("div");
    head.className = "comment-head";

    const name = document.createElement("span");
    name.className = "comment-name";
    name.textContent = comment.name;

    const time = document.createElement("span");
    time.className = "comment-time";
    time.textContent = rel(comment.created_at);

    head.append(name, time);

    const body = document.createElement("p");
    body.className = "comment-body";
    body.textContent = comment.body;

    const reactions = document.createElement("div");
    reactions.className = "comment-reactions";
    reactions.append(
      makeReactionButton("hearts", "\u2661", comment.hearts),
      makeReactionButton("headpats", "head pat", comment.headpats)
    );

    item.append(head, body, reactions);
    return item;
  }

  function render() {
    const arr = [...comments].sort((a, b) =>
      sort === "newest" ? b.created_at - a.created_at : a.created_at - b.created_at
    );
    countEl.textContent = comments.length;
    emptyEl.style.display = comments.length ? "none" : "block";

    listEl.replaceChildren(...arr.map(makeCommentItem));
  }

  async function load() {
    try {
      const res = await fetch(API_BASE + "/api/comments?slug=" + encodeURIComponent(slug));
      if (!res.ok) throw new Error("failed to load comments");
      const data = await res.json();
      comments = data.comments || [];
      render();
    } catch (err) {
      console.error(err);
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = form.name.value;
    const body = form.body.value.trim();
    if (!body) return;
    postBtn.disabled = true;
    try {
      const res = await fetch(API_BASE + "/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, body }),
      });
      if (!res.ok) throw new Error("failed to post comment");
      const data = await res.json();
      if (data.comment) {
        comments.push(data.comment);
        form.reset();
        render();
      }
    } catch (err) {
      console.error(err);
    } finally {
      postBtn.disabled = false;
    }
  });

  root.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      sort = btn.dataset.sort;
      root.querySelectorAll(".sort-btn").forEach((x) =>
        x.classList.toggle("is-active", x === btn)
      );
      render();
    });
  });

  listEl.addEventListener("click", async function (e) {
    const btn = e.target.closest(".react-btn");
    if (!btn) return;
    const li = btn.closest(".comment-item");
    const id = Number(li.dataset.id);
    const type = btn.dataset.type;
    try {
      const res = await fetch(API_BASE + "/api/comments/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, id, type }),
      });
      if (!res.ok) throw new Error("failed to react");
      const data = await res.json();
      const c = comments.find((x) => String(x.id) === String(id));
      if (c) {
        c.hearts = data.hearts;
        c.headpats = data.headpats;
        render();
      }
    } catch (err) {
      console.error(err);
    }
  });

  load();
})();
