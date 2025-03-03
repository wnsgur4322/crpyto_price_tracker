import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_1h: number;
}

const fetchCryptoPrices = async (): Promise<Crypto[] | undefined> => {
  try {
    // API reference: https://docs.coingecko.com/reference/coins-markets
    const { data } = await axios.get<Crypto[]>(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
          sparkline: false,
          price_change_percentage: "1h",
        },
      }
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.request)
      // axios errors (e.g., API responded with 429)
      if (error.response) {
        const status = error.response.status;
        if (status === 429) {
          throw new Error("Rate limit exceeded. Try again later.");
        } else if (status >= 500) {
          throw new Error("CoinGecko API is down. Please try again later.");
        } else {
          throw new Error(`API error: ${error.response.statusText}`);
        }
      } else if (error.request) {
        // request was made, but no response received
        throw new Error("No response from CoinGecko. Please try again later.");
      }
    } else {
      // non-Axios errors (e.g., network issues, unknown errors)
      throw new Error("An unknown error occurred.");
    }
  }
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCryptoPrices,
    refetchInterval: 300000, // refresh every 300 seconds
    retry: (failureCount, error: any) => {
      if (error.message.includes("Rate limit exceeded")) {
        return false; // stop retrying on 429 errors
      }
      return failureCount < 3; // retry up to 3 times for other errors
    },
  });
};