export type ResultType = {
  id: string | null;
  title: string | null;
  artist: string | null;
  label: string | null;
  image: string | null;
  description: string | null;
  trackUrl: string | null;
};
export type ResultsListType = ResultType[];

export type DownloadRequestParamsType = Pick<ResultType, "title" | "artist">;
