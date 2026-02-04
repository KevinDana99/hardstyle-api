export interface DonwloadYtRequest extends Omit<RequestInit, "headers"> {
  headers: {
    "x-rapidapi-key": string;
    "x-rapidapi-host": string;
  };
}
