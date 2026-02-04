import "dotenv/config";
import express, { type Request, type Response } from "express";
import { config as dotEnvConfig } from "dotenv";
import MusicService from "./services/MusicService/index.js";
import downloadService from "./services/ScrapingService/download/index.js";
import { Readable } from "stream";
import setHeaders from "./utils/index.js";
dotEnvConfig();
const server = express();
const PORT = process.env.PORT || 3001;
server.set("json spaces", 2);

server.get("/", async (req: Request, res: Response) => {
  return res.json({ status: 200, message: "API WORKING" });
});
server.get("/api/music/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const searchResults = await MusicService.search(query);
    return res.json(searchResults);
  } catch (err) {
    return res.json({ err });
  }
});
server.get("/api/music/download", async (req: Request, res: Response) => {
  try {
    const { artist, title } = req.query;
    if (!artist || !title) {
      return res.status(400).send("Faltan parámetros artist o title");
    }

    const stream = await downloadService(artist as string, title as string);

    if (!stream) {
      console.error("❌ No se pudo obtener el stream de downloadService");
      return res.status(404).send("No se pudo obtener el audio");
    }

    setHeaders(res, stream);
    const nodeStream = Readable.fromWeb(stream.audio_track as any);

    nodeStream.on("data", (chunk) => {
      console.log(`✅ Recibiendo datos: ${chunk.length} bytes`);
    });

    nodeStream.on("end", () => {
      console.log("🏁 El stream de origen terminó");
    });
    nodeStream.pipe(res);
  } catch (globalError) {
    console.error("❌ Error crítico en el endpoint:", globalError);
    if (!res.headersSent) {
      res.status(500).send("Error interno del servidor");
    }
  }
});

server.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
