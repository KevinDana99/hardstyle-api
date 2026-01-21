import express, { type Request, type Response } from "express";
import { config } from "dotenv";
import MusicService from "./services/MusicService";
import type { DownloadRequestParamsType } from "./services/MusicService/types";
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
  const { artist, title } = req.query as DownloadRequestParamsType;
  const musicService = new MusicService();
  try {
    if (artist && title) {
      const preview = await musicService.download(artist, title);
      res.json({ preview_url: preview });
    } else {
      throw Error("The artist or title is empty");
    }
  } catch (err) {
    console.log(err.message);
  }
});

server.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
