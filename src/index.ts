import express, { type Request, type Response } from "express";
import { config } from "dotenv";
import MusicService from "./services/MusicService";
config();

const server = express();
const PORT = process.env.PORT || 3001;
server.set("json spaces", 2);

server.get("/api/music/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const musicService = new MusicService();
  const searchResults = await musicService.search(query);
  console.log({ searchResults });
  res.json(searchResults);
});
server.get("/api/music/download", async (req: Request, res: Response) => {
  const url = req.query.url as string;
  const musicService = new MusicService();
  const preview = await musicService.download(url);
  res.json({ preview_url: preview });
});

server.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
