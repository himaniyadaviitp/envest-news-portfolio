import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=stock market india&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.status(200).json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
