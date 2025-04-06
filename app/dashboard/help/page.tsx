"use client";

import { useEffect, useState } from "react";

export default function HelpPage() {
  const [helpList, setHelpList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchHelp = async () => {
      try {
        const res = await fetch(`https://api.hinduhelpline.in/api/v1/admin/help/list?page=${page}&pageSize=${pageSize}&status=asked`,
          {
            method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NTg2Nzg0OTg5IiwiYWRtaW5JZCI6IjY3NzYxNjZjNTUxY2U4ODU1MWNlZDY0YyIsImlhdCI6MTc0MzgzMTAzMywiZXhwIjoxNzc1Mzg4NjMzfQ.8x2QWVIdrKJrYEw-zjmsDmT8DTQhYOa6LsjD4eCXwZE",
          },
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch help data");

        setHelpList(data.data); // Assuming API returns { data: [...] }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHelp();
  }, []);

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Help Listing</h1>

      {loading && <p>Loading help data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {helpList.map((item: any) => (
          <div
            key={item._id}
            className="p-4 bg-white rounded-lg shadow border border-gray-200"
          >
            <h2 className="text-lg font-semibold mb-1">{item.title || "No Title"}</h2>
            <p className="text-sm text-gray-700">{item.description || "No description"}</p>
            {/* Add more fields as per API response */}
          </div>
        ))}
      </div>
    </main>
  );
}
