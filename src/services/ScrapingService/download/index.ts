import { chromium } from "playwright";
export type ResultsListType = {
  id: string | null;
  title: string | null;
  artist: string | null;
  label: string | null;
  image: string | null;
  description: string | null;
  trackUrl: string | null;
}[];

const downloadService = async (url: string) => {
  const browser = await chromium.launch({ headless: true });
  // Es vital usar un contexto con un User-Agent real
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle" });
    console.log("Paso 1: Página cargada y red inactiva");

    // 1. Preparamos una "trampa" para capturar la petición del audio
    // Escuchamos todas las peticiones que salgan de la página
    const audioPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/track_preview/") && response.status() === 200
    );

    // 2. Intentamos disparar el play de varias formas
    const playBtn = page.locator("span.playButton").first();

    // Aseguramos que el botón esté en pantalla antes de cliquear
    await playBtn.scrollIntoViewIfNeeded();
    await playBtn.click({ force: true });

    console.log("Click realizado, esperando respuesta de red...");

    // 3. Esperamos a que la "trampa" capture la URL
    const response = await audioPromise;
    const finalUrl = response.url();

    console.log("Paso 2: URL capturada de la red ->", finalUrl);
    return finalUrl;
  } catch (error) {
    await page.screenshot({ path: "debug-red.png" });
    console.error("Error en downloadService:", error.message);
    return null;
  } finally {
    await browser.close();
  }
};
export default downloadService;
