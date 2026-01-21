import yts from "yt-search";
import ytdl from "ytdl-core-muxer";

export const downloadService = async (
  artist: string,
  title: string,
): Promise<Buffer | null> => {
  try {
    const searchQuery = `${artist} - ${title} Hardstyle Official`;
    console.log(`🔍 Buscando en YT: ${searchQuery}`);

    const r = await yts(searchQuery);
    const video = r.videos[0];

    if (!video) {
      console.error("❌ Video no encontrado");
      return null;
    }

    console.log(`🎬 Procesando stream de: ${video.url}`);

    // ytdl-core-muxer nos devuelve un objeto con el stream de audio
    const { stream } = await ytdl(video.url, {
      filter: "audioonly",
      highWaterMark: 1 << 25, // Buffer de 32MB para evitar cortes
    });

    const chunks: Uint8Array[] = [];

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        const audioBuffer = Buffer.concat(chunks);
        console.log(
          `✅ Audio listo: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`,
        );
        resolve(audioBuffer);
      });

      stream.on("error", (err) => {
        console.error("❌ Error en el stream:", err.message);
        reject(null);
      });
    });
  } catch (error) {
    console.error("❌ Error en downloadService:", error.message);
    return null;
  }
};

export default downloadService;
