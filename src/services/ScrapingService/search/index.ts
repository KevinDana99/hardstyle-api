import { chromium } from "playwright";
import type { ResultsListType } from "../../MusicService/types.js";
import type { QueryConfigType } from "./types.js";

const LIMIT_RESULTS = 5;
const searchService = async (query: string, config?: QueryConfigType) => {
  try {
    const results: ResultsListType = [];
    const limit = config?.limit ?? LIMIT_RESULTS;
    const browser = await chromium.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.route("**/*.{png,jpg,jpeg,gif,svg,css}", (route) =>
      route.abort(),
    );
    await page.goto(`https://hardstyle.com/en/search?search=${query}`);
    const tracks = await page.locator(".itemWrapper .track.listView").all();
    console.log({ tracks });
    for (const track of tracks) {
      const trackId = await track.getAttribute("data-track-id");
      const title = await track
        .locator("a.trackTitle .innerLink")
        .textContent();
      const artistName = await track.locator(".artists").innerText();
      const labelName = await track.locator(".label a.label").textContent();
      const imgRelativePath = await track
        .locator(".trackPoster img")
        .getAttribute("src");
      const imageUrl = imgRelativePath
        ? `https://hardstyle.com${imgRelativePath}`
        : null;
      const description = await track
        .locator(".trackContent .linkTitle")
        .nth(1)
        .textContent();
      const relativeTrackUrl = await track
        .locator("a.trackTitle")
        .getAttribute("href");

      const trackUrl = relativeTrackUrl
        ? `https://hardstyle.com${relativeTrackUrl}`
        : null;

      if (results.length < limit) {
        results.push({
          id: trackId ?? null,
          title: title?.trim() ?? null,
          artist: artistName?.replace(/\n/g, "").trim() ?? null,
          label: labelName?.trim() ?? null,
          image: imageUrl ?? null,
          description: description?.trim() ?? null,
          trackUrl: trackUrl?.trim() ?? null,
        });
      }
    }
    await browser.close();
    return results;
  } catch (err) {
    throw Error(err);
  }
};

export default searchService;
