// === AI Entertainment Recommender Unified Script ===
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

  // --- Handle MOVIES page ---
  const movieGo = document.getElementById("movieGo");
  if (movieGo) {
    movieGo.addEventListener("click", async () => {
      const q = document.getElementById("movieInput").value.trim();
      const resDiv = document.getElementById("movieResults");

      resDiv.innerHTML = '<p style="color:var(--muted)">🎬 Searching movies...</p>';
      if (!q) {
        resDiv.innerHTML = '<p style="color:var(--muted)">Please enter a query.</p>';
        return;
      }

      console.log("🎥 Movie query:", q);
      const resp = await safeFetch("https://entertainment-ai-api.vercel.app/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: q }),
      });

      if (!resp) {
        resDiv.innerHTML = '<p style="color:var(--muted)">⚠️ Backend not available.</p>';
        return;
      }

      const data = await resp.json();
      console.log("✅ Movie data received:", data);
      renderResults(data.recommendations || [], resDiv, "movie");
    });
  }

  // --- Handle TV SHOWS page ---
  const tvGo = document.getElementById("tvGo");
  if (tvGo) {
    tvGo.addEventListener("click", async () => {
      const q = document.getElementById("tvInput").value.trim();
      const resDiv = document.getElementById("tvResults");

      resDiv.innerHTML = '<p style="color:var(--muted)">📺 Searching TV shows...</p>';
      if (!q) {
        resDiv.innerHTML = '<p style="color:var(--muted)">Please enter a query.</p>';
        return;
      }

      console.log("📺 TV query:", q);
      const resp = await safeFetch("https://entertainment-ai-api.vercel.app/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: q }),
      });

      if (!resp) {
        resDiv.innerHTML = '<p style="color:var(--muted)">⚠️ Backend not available.</p>';
        return;
      }

      const data = await resp.json();
      console.log("✅ TV data received:", data);
      renderResults(data.recommendations || [], resDiv, "tv show");
    });
  }

  // --- Handle SONGS page ---
  const songGo = document.getElementById("songGo");
  if (songGo) {
    songGo.addEventListener("click", async () => {
      const q = document.getElementById("songInput").value.trim();
      const resDiv = document.getElementById("songResults");

      resDiv.innerHTML = '<p style="color:var(--muted)">🎵 Searching songs...</p>';
      if (!q) {
        resDiv.innerHTML = '<p style="color:var(--muted)">Please enter a query.</p>';
        return;
      }

      console.log("🎵 Song query:", q);
      const resp = await safeFetch("https://entertainment-ai-api.vercel.app/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: q }),
      });

      if (!resp) {
        resDiv.innerHTML = '<p style="color:var(--muted)">⚠️ Backend not available.</p>';
        return;
      }

      const data = await resp.json();
      console.log("✅ Song data received:", data);
      renderResults(data.recommendations || [], resDiv, "song");
    });
  }

  // --- Shared renderer for all types ---
  function renderResults(items, container, type) {
    console.log(`🎬 Rendering ${items?.length || 0} ${type} results...`);
    container.innerHTML = "";

    if (!items || items.length === 0) {
      container.innerHTML = '<p style="color:var(--muted)">No results found.</p>';
      return;
    }

    items.forEach((it) => {
      const title = it.title || it.name || "Unknown";
      const poster = it.poster_path
        ? `https://image.tmdb.org/t/p/w300${it.poster_path}`
        : it.album_image || "https://via.placeholder.com/300x450?text=No+Image";
      const date = it.release_date || it.first_air_date || "";
      const artist = it.artists ? ` · ${it.artists}` : "";

      // Build card
      const card = document.createElement("div");
      card.className = "card result-item";

      const link = document.createElement("a");
      link.className = "card-link";
      link.href = `https://www.google.com/search?q=${encodeURIComponent(
        title + " " + type
      )}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = poster;
      img.alt = title;

      const h4 = document.createElement("h4");
      h4.textContent = title;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `${date}${artist}`;

      link.appendChild(img);
      link.appendChild(h4);
      link.appendChild(meta);
      card.appendChild(link);
      container.appendChild(card);
    });

    console.log("✅ Rendering complete.");
  }
})();
