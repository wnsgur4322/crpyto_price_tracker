# Project Setup Guide

## 1️⃣ Install Dependencies
Make sure you have **Node.js** installed, then run:

```sh
npm install
```

## 2️⃣ Running the Web App
Start the Next.js development server:

```sh
npm run dev
```
The app will be available at:  
➡️ [http://localhost:3000](http://localhost:3000)

## 3️⃣ Running the Documentation
Start the Docusaurus documentation site:

```sh
cd docs
npm start
```
The docs will be available at:  
➡️ [http://localhost:3000](http://localhost:3000)


---

# API Integration

## 🌐 CoinGecko API
We fetch real-time cryptocurrency data using the **[CoinGecko API](https://docs.coingecko.com/reference/coins-markets)**.

### API Endpoint:
```
https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false
```

## 🛠 Fetching Data
The API call is made using **Axios** with error handling:

```tsx
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
```

## 🔄 Updating Prices
We use **React Query** to fetch and cache data efficiently:

```tsx
export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCryptoPrices,
    refetchInterval: 300000, // refresh every 300 seconds
    ...
};
```

---

# State Management

## 🎯 Why Use React Query?
We use **React Query** for:
- Efficient **data fetching, caching, and auto-updating**.
- **Optimized API calls** to prevent unnecessary requests.
- **Built-in error handling** and **automatic retries**.

## 🔄 How It Works
We use `useQuery` to manage API requests:

```tsx
export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCryptoPrices,
    refetchInterval: 300000, // refresh every 300 seconds
    ...
};
```

### 🔹 Benefits of React Query
✅ Handles **stale data** & **automatic re-fetching**  
✅ **Cache-first approach** reduces API calls  
✅ Improves **performance & UX**  


---

# Challenges & Solutions

## 🚧 Challenge: API Rate Limits (`429 Too Many Requests`)

### 🔹 Problem
The CoinGecko API has rate limits, which caused frequent **429 errors**.

### ✅ Solution
- Implemented **error handling** for `429` errors.
- Reduced API call frequency to **once every 300 seconds**.

```tsx
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
```