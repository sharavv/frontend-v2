// === AI Entertainment Recommender Unified Script (FINAL COMPATIBLE) ===
(async function () {
  console.log("🚀 Script loaded and running...");

  // --- Helper: safe fetch wrapper ---
  async function safeFetch(url, options) {
    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp;
    } catch (err) {
      console.warn("⚠️ Fetch failed:", err);
      return null;
    }
  }

  // --- Generic handler ---
  async function handleRecommendation(type, query, resDiv) {
    resDiv.innerHTML = `<p style="color:var(--muted)">🔍 Searching ${type}s...</p>`;
    if (!query) {
      resDiv.innerHTML = `<p style="color:var(--muted)">Please enter a query.</p>`;
      return;
    }

    console.log(`🔹 Query for ${type}:`, query);

    const resp = await safeFetch("https://entertainment-ai-api.vercel.app/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: query, type }),
    });

    if (!resp) {
      resDiv.innerHTML = `<p style="color:var(--muted)">⚠️ Backend not available.</p>`;
      return;
    }

    const data = await resp.json();
    console.log(`✅ ${type.toUpperCase()} data received:`, data);
    renderResults(data.recommendations || [], resDiv, type);
  }

  // --- Button listeners ---
  const movieGo = document.getElementById("movieGo");
  if (movieGo) {
    movieGo.addEventListener("click", async () => {
      const q = document.getElementById("movieInput").value.trim();
      const resDiv = document.getElementById("movieResults");
      await handleRecommendation("movie", q, resDiv);
    });
  }

  const tvGo = document.getElementById("tvGo");
  if (tvGo) {
    tvGo.addEventListener("click", async () => {
      const q = document.getElementById("tvInput").value.trim();
      const resDiv = document.getElementById("tvResults");
      await handleRecommendation("tv", q, resDiv);
    });
  }

  const songGo = document.getElementById("songGo");
  if (songGo) {
    songGo.addEventListener("click", async () => {
      const q = document.getElementById("songInput").value.trim();
      const resDiv = document.getElementById("songResults");
      await handleRecommendation("song", q, resDiv);
    });
  }

  // --- Shared renderer ---
  function renderResults(items, container, type) {
    console.log(`🎬 Rendering ${items?.length || 0} ${type} results...`);
    container.innerHTML = "";

    if (!items || items.length === 0) {
      container.innerHTML = `<p style="color:var(--muted)">No ${type} results found.</p>`;
      return;
    }

    items.forEach((it) => {
      const title = it.title || it.name || "Unknown";
      const image = it.poster || it.image || `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`;
      const subtitle =
        type === "song"
          ? `${it.artist || ""} · ${it.album || ""}`
          : it.release_date || it.first_air_date || "";

      const linkUrl =
        type === "song" && it.spotify_url
          ? it.spotify_url
          : `https://www.google.com/search?q=${encodeURIComponent(title + " " + type)}`;

      // Card element
      const card = document.createElement("div");
      card.className = "card result-item";

      const link = document.createElement("a");
      link.className = "card-link";
      link.href = linkUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = image;
      img.alt = title;

      const h4 = document.createElement("h4");
      h4.textContent = title;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = subtitle;

      link.appendChild(img);
      link.appendChild(h4);
      link.appendChild(meta);
      card.appendChild(link);
      container.appendChild(card);
    });

    console.log("✅ Rendering complete.");
  }
})();
