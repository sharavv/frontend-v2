// === AI Entertainment Recommender Frontend (FINAL) ===
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

    // Backend now receives type through header ONLY
    const resp = await safeFetch("https://entertainment-ai-api.vercel.app/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Type": type
      },
      body: JSON.stringify({ input: query })
    });

    if (!resp) {
      resDiv.innerHTML = `<p style="color:var(--muted)">⚠️ Backend not available.</p>`;
      return;
    }

    const data = await resp.json();
    console.log(`✅ Response received:`, data);

    renderResults(data.recommendations || [], resDiv, type);
  }

  // --- Button listeners ---
  document.getElementById("movieGo")?.addEventListener("click", async () => {
    await handleRecommendation(
      "movie",
      document.getElementById("movieInput").value.trim(),
      document.getElementById("movieResults")
    );
  });

  document.getElementById("tvGo")?.addEventListener("click", async () => {
    await handleRecommendation(
      "tv",
      document.getElementById("tvInput").value.trim(),
      document.getElementById("tvResults")
    );
  });

  document.getElementById("songGo")?.addEventListener("click", async () => {
    await handleRecommendation(
      "song",
      document.getElementById("songInput").value.trim(),
      document.getElementById("songResults")
    );
  });

  // --- Renderer ---
  function renderResults(items, container, type) {
    console.log(`🎬 Rendering ${items?.length || 0} ${type} results...`);
    container.innerHTML = "";

    if (!items || items.length === 0) {
      container.innerHTML = `<p style="color:var(--muted)">No ${type} results found.</p>`;
      return;
    }

    items.forEach((it) => {
      const title = it.title || it.name || "Untitled";

      const image =
        it.poster_path
          ? `https://image.tmdb.org/t/p/w500${it.poster_path}`
          : it.album_image ||
            it.image ||
            `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`;

      const subtitle =
        type === "song"
          ? `${it.artists || ""}`
          : it.release_date || it.first_air_date || "";

      const linkUrl =
        type === "song" && it.spotify_url
          ? it.spotify_url
          : `https://www.google.com/search?q=${encodeURIComponent(title + " " + type)}`;

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
