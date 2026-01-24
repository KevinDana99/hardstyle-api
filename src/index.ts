import express, { type Request, type Response } from "express";
import { config } from "dotenv";
import MusicService from "./services/MusicService";
import type { DownloadRequestParamsType } from "./services/MusicService/types";
import downloadService from "./services/ScrapingService/download";
config();

const server = express();
const PORT = process.env.PORT || 3001;
server.set("json spaces", 2);

server.get("/api/music/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const musicService = new MusicService();
  const searchResults = await musicService.search(query);
  res.json(searchResults);
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

    // 2. Configuramos headers de streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    const reader = stream.getReader();

    // 3. Bucle de lectura con manejo de errores
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Verificamos que 'value' contenga datos antes de escribir
        if (value) {
          res.write(value);
        }
      }
    } catch (streamError) {
      console.error("❌ Error durante la lectura del stream:", streamError);
    } finally {
      res.end(); // Cerramos la conexión siempre
      reader.releaseLock(); // Liberamos el stream
    }
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
