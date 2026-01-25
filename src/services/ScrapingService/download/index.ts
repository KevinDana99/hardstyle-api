import hardstyleDownloader from "./methods/hardstyle";
import ytsDownloader from "./methods/yts";

const DOWNLOAD_METHODS = {
  yts: ytsDownloader,
  hstyle: hardstyleDownloader,
};

export const downloadService = async (
  artist: string,
  title: string,
  url: string,
) => {
  const { yts, hstyle } = DOWNLOAD_METHODS;
  //yts method
  /* const result = await yts(`${artist} ${title} Hardstyle`);
  return result;*/
  //hstyle method
  const result = await hstyle(url);
  return result;
};
export default downloadService;
