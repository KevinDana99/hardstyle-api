import yts from "yt-search";

export const downloadService = async (artist: string, title: string) => {
  try {
    const search = await yts(`${artist} ${title} Hardstyle`);
    const video = search.videos[0];
    if (!video) return null;

    console.log(`🎬 Video encontrado: ${video.title}`);

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "55d9220dcemsh5e5b0ce8922d1c7p1f0571jsne13ac3ab4b0c",
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    };

    const response = await fetch(
      `https://yt-api.p.rapidapi.com/dl?id=${video.videoId}`,
      options
    );

    const data = (await response.json()) as any;

    // Buscamos dentro de adaptiveFormats el itag 140 (Audio MP4) o el 251 (Audio Webm)
    const audioFormat = data.adaptiveFormats?.find(
      (f: any) => f.itag === 140 || f.itag === 251
    );

    if (audioFormat && audioFormat.url) {
      console.log("✅ Link directo de audio extraído con éxito");

      // Pedimos el stream del archivo
      const audioRes = await fetch(audioFormat.url);
      console.log({ res: audioRes.body });
      return audioRes.body;
    } else {
      console.error(
        "❌ No se encontró un formato de audio compatible en la respuesta."
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error en el servicio:", error);
    return null;
  }
};
export default downloadService;
