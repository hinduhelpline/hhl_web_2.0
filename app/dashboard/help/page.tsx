"use client";

import { useEffect, useRef, useState } from "react";

export default function HelpPage() {
  const [helpList, setHelpList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHelpId, setSelectedHelpId] = useState<string | null>(null);
  const pageSize = 10;
  const [status, setStatus] = useState("asked");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStatus = localStorage.getItem("helpStatus");
      if (savedStatus) setStatus(savedStatus);
    }
  }, []);
  
  // "\"status\" must be one of [asked, reviewed, closed]"
  
  useEffect(() => {
    setHelpList([]);
    setPage(1);
    setHasMore(true);
  }, [status]);

  
  useEffect(() => {
    if (loading || !hasMore) return;
  
    const fetchHelp = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.hinduhelpline.in/api/v1/admin/help/list?page=${page}&pageSize=${pageSize}&status=${status}`,
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
  
        setHelpList((prev) => [...prev, ...data.data]);
        setHasMore(data.data.length === pageSize);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHelp();
  }, [page, status]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
  
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
  
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading]);
  
  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Help Listing</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {helpList.map((item: any) => (
          <div
            key={item._id}
            className="p-4 bg-white rounded-lg shadow border border-gray-200 space-y-1 text-sm"
          >
            <p>
              <span className="font-semibold">Full Name:</span>{" "}
              {item.fullName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Mobile:</span>{" "}
              {item.mobile || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {item.address || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Pin Code:</span>{" "}
              {item.pincode || "N/A"}
            </p>
            <p>
              <span className="font-semibold">State:</span>{" "}
              {item.state?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">District:</span>{" "}
              {item.district?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Block/Taluka:</span>{" "}
              {item.block?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Type of Help:</span>{" "}
              {item.helpCategory || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Help Detail:</span>{" "}
              {item.helpSubCategory || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Mode:</span>{" "}
              {item.helpMode || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {item.description || "N/A"}
            </p>

            <div className="pt-2 flex justify-end">
            <button
  className="px-4 py-1 bg-[#f68738] text-white rounded hover:bg-[#e47520] transition"
  onClick={() => {
    setSelectedHelpId(item._id);
    setShowModal(true);
  }}
>
  Help Review
</button>

            </div>
          </div>
        ))}
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Review Help Request</h2>
      <p>Are you sure you want to mark this help request as <strong>reviewed</strong>?</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`https://api.hinduhelpline.in/api/v1/admin/help/status/${selectedHelpId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: 
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NTg2Nzg0OTg5IiwiYWRtaW5JZCI6IjY3NzYxNjZjNTUxY2U4ODU1MWNlZDY0YyIsImlhdCI6MTc0MzgzMTAzMywiZXhwIjoxNzc1Mzg4NjMzfQ.8x2QWVIdrKJrYEw-zjmsDmT8DTQhYOa6LsjD4eCXwZE",
                },
                body: JSON.stringify({ status: "reviewed" }),
              });

              const result = await res.json();

              if (!res.ok) throw new Error(result.message || "Failed to update");

              alert("✅ Help marked as reviewed");
              setShowModal(false);
              setSelectedHelpId(null);
              // Optional: refresh help list
              window.location.reload(); // or trigger fetch
            } catch (err: any) {
              alert("❌ " + err.message);
            }
          }}
          className="px-4 py-2 bg-[#f68738] text-white rounded hover:bg-[#e47520] text-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

      {/* Scroll Trigger for Infinite Scroll */}
      <div
        ref={loaderRef}
        className="text-center text-sm py-4 text-gray-500"
      >
        {loading
          ? "Loading more help requests..."
          : hasMore
          ? "Scroll to load more"
          : "No more help entries"}
      </div>
    </main>
  );
}
