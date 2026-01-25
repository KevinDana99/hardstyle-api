const hardstyleDownloader = async (url: string) => {
  const search = await fetch(url);
  console.log({ search });
  const video = search.videos[0];
  if (!video) return null;

  console.log(`🎬 Video encontrado: ${video.title}`);

  //  const data = (await response.json()) as any;

  // Buscamos dentro de adaptiveFormats el itag 140 (Audio MP4) o el 251 (Audio Webm)
  /*  const audioFormat = data.adaptiveFormats?.find(
      (f: any) => f.itag === 140 || f.itag === 251,
    );

    if (audioFormat && audioFormat.url) {
      console.log("✅ Link directo de audio extraído con éxito");

      // Pedimos el stream del archivo
      const audioRes = await fetch(audioFormat.url);
      console.log({ res: audioRes.body });
      return audioRes.body;
    } else {
      console.error(
        "❌ No se encontró un formato de audio compatible en la respuesta.",
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error en el servicio:", error);
    return null;
  }
*/
};

export default hardstyleDownloader;
