import { useState } from "react";
import "./App.css";

// TODO: remove before prod — internal API key used during development
// const API_KEY = 'sk_live_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456'

function App() {
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  // ISSUE: XSS — user-controlled input injected directly into innerHTML
  // A payload like <img src=x onerror=alert(1)> will execute in the browser
  const handleSearch = () => {
    const resultBox = document.getElementById("search-results");
    if (resultBox) {
      resultBox.innerHTML = `Results for: ${search}`;
    }
  };

  // ISSUE: stored XSS — comment content rendered without sanitisation
  const handleComment = () => {
    setComments((prev) => [...prev, comment]);
    setComment("");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Scale Test App</h1>

      {/* Search — reflected XSS */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Search</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything..."
          style={{ marginRight: "0.5rem", padding: "0.4rem" }}
        />
        <button onClick={handleSearch}>Search</button>
        {/* XSS sink: innerHTML set from user input */}
        <div
          id="search-results"
          style={{ marginTop: "0.5rem", color: "#555" }}
        />
      </section>

      {/* Comments — stored XSS */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Comments</h2>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          style={{ marginRight: "0.5rem", padding: "0.4rem" }}
        />
        <button onClick={handleComment}>Post</button>
        <ul style={{ marginTop: "0.5rem" }}>
          {comments.map((c, i) => (
            // ISSUE: dangerouslySetInnerHTML renders raw HTML from user input
            <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
          ))}
        </ul>
      </section>

      {/* Open redirect — href built from query param without validation */}
      <section>
        <h2>External Link</h2>
        <a
          href={
            new URLSearchParams(window.location.search).get("redirect") ?? "/"
          }
          style={{ color: "blue" }}
        >
          {/* ISSUE: open redirect — ?redirect=https://evil.com will leave the site */}
          Continue
        </a>
      </section>
    </div>
  );
}

export default App;
