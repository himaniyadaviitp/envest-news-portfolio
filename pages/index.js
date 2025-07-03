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
    <div style={{ padding: "2rem" }}>
      <h1>📈 Smart News + Portfolio Insights</h1>

      <h2>General Stock Market News (India)</h2>
      <ul>
        {news.map((n, i) => (
          <li key={i}>{n.title}</li>
        ))}
      </ul>

      <h2>Enter Your Portfolio (e.g., TCS, INFY, RELIANCE)</h2>
      <input
        type="text"
        value={portfolio}
        onChange={(e) => setPortfolio(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button onClick={handleAnalyze}>Analyze</button>

      {filteredNews.length > 0 && (
        <>
          <h2>🧠 Filtered News Related to Your Portfolio</h2>
          <ul>
            {filteredNews.map((n, i) => (
              <li key={i}>{n.title}</li>
            ))}
          </ul>
        </>
      )}

      {analysis && (
        <>
          <h2>🤖 AI Analysis</h2>
          <pre>{analysis}</pre>
        </>
      )}
    </div>
  );
}
