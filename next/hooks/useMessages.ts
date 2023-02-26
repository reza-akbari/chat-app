import useSWR from "swr";
import { fetchApi } from "../utils/fetchApi";

export const useMessages = () =>
  useSWR("/messages", (route) => fetchApi(route, undefined, true));
