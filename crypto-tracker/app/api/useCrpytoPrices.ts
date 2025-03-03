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

// custom error type for handling API errors
interface ApiError {
  message: string;
}

const fetchCryptoPrices = async (): Promise<Crypto[]> => {
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
    return data ?? [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // axios errors (e.g., API responded with 429)
        const status = error.response?.status;
        if (status === 429) {
          throw new Error("Rate limit exceeded. Try again later.");
        } else if (status && status >= 500) {
          throw new Error("CoinGecko API is down. Please try again later.");
        } else if (error.response?.statusText) {
          throw new Error(`API error: ${error.response.statusText}`);
        }

        if (error.request) {
          // request was made, but no response received
          throw new Error("No response from CoinGecko. Please try again later.");
        }
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("An unknown error occurred.");
  }

  
};

export const useCryptoPrices = () => {
  return useQuery<Crypto[], ApiError>({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCryptoPrices,
    refetchInterval: 300000, // Refresh every 300 seconds
    retry: (failureCount, error) => {
      if (error.message.includes("Rate limit exceeded")) {
        return false; // Stop retrying on 429 errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });
};