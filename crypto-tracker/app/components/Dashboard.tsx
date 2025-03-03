"use client";

import { useCryptoPrices } from "@/api/useCrpytoPrices";
import { useState } from "react";

import "./Dashboard.css"
import { FiRefreshCw } from "react-icons/fi"; // import refresh icon

const CryptoDashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useCryptoPrices();
  const [search, setSearch] = useState("");

  // search filter functionality
  const filteredData = data
    ? data.filter((crypto) =>
        crypto.name.toLowerCase().includes(search.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-md mx-auto p-6 bg-card shadow-xl rounded-xl mt-10">
      <h1 className="text-2xl font-bold text-center text-foreground mb-4">Crypto Price Tracker</h1>

      <input
        type="text"
        placeholder="Search ..."
        className="w-full p-3 rounded-md border border-gray-700 bg-background text-foreground placeholder-gray-400 focus:ring focus:ring-accent mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className={`w-full refresh-btn bg-accent p-3 rounded-md transition ${
            isFetching ? "opacity-60 cursor-not-allowed" : ""
          }`}
        onClick={() => refetch()}
        disabled={isFetching}
      >
       <FiRefreshCw className="w-5 h-5" /> Refresh
      </button>

      {/* error message display */}
      {isError && error ? (
        <p className="mt-4 text-center text-red-400">{error.message}</p>
      ) : null}

      {/* show spinner instead of the list when loading or fetching */}
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ul className="mt-4">
          {filteredData.length > 0 ? (
            filteredData.map((crypto) => {
              const priceColor = crypto.price_change_percentage_1h >= 0 ? "text-green-400" : "text-red-400";
              return (
                <li
                  key={crypto.id}
                  className="flex justify-between p-3 border-b border-gray-700 text-white items-center"
                >
                  <div className="flex items-center gap-3">
                    <img src={crypto.image} alt={crypto.name} className="h-6 w-6 rounded-full" />
                    <span className="capitalize font-semibold">
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </span>
                  </div>
                  <span className={`${priceColor}`}>${crypto.current_price.toFixed(2)}</span>
                </li>
              );
            })
          ) : (
            <p className="text-center text-gray-400 mt-4">No results found.</p>
          )}
      </ul>
      )}
    </div>
  );
};

export default CryptoDashboard;