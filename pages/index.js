import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [news, setNews] = useState([]);
  const [portfolio, setPortfolio] = useState("");
  const [filteredNews, setFilteredNews] = useState([]);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await axios.get("/api/getNews");
    setNews(res.data);
  };

 const handleAnalyze = async () => {
  const symbols = portfolio.toUpperCase().split(",").map((s) => s.trim());

  const filtered = news.filter((n) =>
    symbols.some((sym) => n.title.toUpperCase().includes(sym))
  );

  setFilteredNews(filtered);

  if (filtered.length === 0) {
    setAnalysis("No relevant news found for your portfolio.");
    return;
  }

  try {
    const headlines = filtered.map((n) => n.title);

    const res = await axios.post("/api/analyzeNews", { headlines });

    setAnalysis(res.data.result);
  } catch (err) {
    console.error("AI Error:", err.message);
    setAnalysis("AI analysis failed. Try again later.");
  }
};


  return (
  <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem", fontFamily: "Arial" }}>
    <h1 style={{ textAlign: "center", fontSize: "2rem" }}>📈 Smart News + Portfolio Insights</h1>

    <section style={{ marginTop: "2rem" }}>
      <h2>📰 General Stock Market News (India)</h2>
      <ul>
        {news.map((n, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>{n.title}</li>
        ))}
      </ul>
    </section>

    <section style={{ marginTop: "2rem" }}>
      <h2>📊 Enter Your Portfolio (e.g., HDB, RBL, INFY)</h2>
      <input
        type="text"
        value={portfolio}
        onChange={(e) => setPortfolio(e.target.value)}
        placeholder="e.g., HDB, RBL, INFY"
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "1rem"
        }}
      />
      <button
        onClick={handleAnalyze}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
      >
        Analyze
      </button>
    </section>

    {filteredNews.length > 0 && (
      <section style={{ marginTop: "2rem" }}>
        <h2>🧠 Filtered News Related to Your Portfolio</h2>
        <ul>
          {filteredNews.map((n, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>{n.title}</li>
          ))}
        </ul>
      </section>
    )}

    {analysis && (
      <section style={{ marginTop: "2rem" }}>
        <h2>🤖 AI Analysis</h2>
        <pre
          style={{
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            fontFamily: "inherit"
          }}
        >
          {analysis}
        </pre>
      </section>
    )}
  </div>
);

}
