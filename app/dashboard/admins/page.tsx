// ✅ File: app/dashboard/admins/page.tsx

"use client";

import { useEffect, useState } from "react";

type Admin = {
  id: number;
  name: string;
  role: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [states, setStates] = useState<any[]>([]); // top of component
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedResponsibility, setSelectedResponsibility] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admins
        const adminRes = await fetch("https://api.hinduhelpline.in/api/v1/admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NTg2Nzg0OTg5IiwiYWRtaW5JZCI6IjY3NzYxNjZjNTUxY2U4ODU1MWNlZDY0YyIsImlhdCI6MTc0MzgzMTAzMywiZXhwIjoxNzc1Mzg4NjMzfQ.8x2QWVIdrKJrYEw-zjmsDmT8DTQhYOa6LsjD4eCXwZE",
          },
        });

        const adminData = await adminRes.json();
        setAdmins(adminData.data);

        // Fetch states
        const stateRes = await fetch("https://api.hinduhelpline.in/api/v1/general/state/list");
        const stateData = await stateRes.json();
        setStates(stateData.data); // assuming response = { data: [...] }

      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchAdmins = async () => {
  //     try {
  //       const res = await fetch("https://api.hinduhelpline.in/api/v1/admin", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization:
  //             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NTg2Nzg0OTg5IiwiYWRtaW5JZCI6IjY3NzYxNjZjNTUxY2U4ODU1MWNlZDY0YyIsImlhdCI6MTc0MzgzMTAzMywiZXhwIjoxNzc1Mzg4NjMzfQ.8x2QWVIdrKJrYEw-zjmsDmT8DTQhYOa6LsjD4eCXwZE",
  //         },
  //       });

  //       if (!res.ok) throw new Error("Failed to fetch admins");

  //       const json = await res.json();
  //       console.log("API Response:", json); // optional debug

  //       setAdmins(json.data); // assuming data is inside "data" key
  //     } catch (err: any) {
  //       console.log("Fetch Error:", err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAdmins();
  // }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!email) newErrors.email = "Email is required.";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    if (!mobile) newErrors.mobile = "Mobile is required.";
    else if (mobile.length < 10 || !/^\d+$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be at least 10 digits.";
    }

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!selectedState) newErrors.state = "State is required.";
    if (!selectedDistrict) newErrors.district = "District is required.";
    if (!selectedBlock) newErrors.block = "Block is required.";
    if (!selectedResponsibility) newErrors.responsibility = "Responsibility is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      firstName,
      lastName,
      email,
      mobile,
      password,
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock,
      responsibility: selectedResponsibility,
    };

    try {
      const res = await fetch("https://api.hinduhelpline.in/api/v1/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NTg2Nzg0OTg5IiwiYWRtaW5JZCI6IjY3NzYxNjZjNTUxY2U4ODU1MWNlZDY0YyIsImlhdCI6MTc0MzgzMTAzMywiZXhwIjoxNzc1Mzg4NjMzfQ.8x2QWVIdrKJrYEw-zjmsDmT8DTQhYOa6LsjD4eCXwZE",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("✅ Admin created successfully!");
      setShowDialog(false); // Close modal
      // Optionally: refresh admins list here
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    }
  };


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin List</h1>
      <button
        onClick={() => setShowDialog(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add New Admin
      </button>

      {/* Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto p-6">

            <h2 className="text-lg font-bold mb-4">Add New Admin</h2>

            {/* Content will go here */}
            <form className="space-y-4">
              {/* First & Last Name */}
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-3 py-2 border rounded"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }
                  }}  
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-3 py-2 border rounded"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }
                  }}  
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}

              <input
                type="tel"
                placeholder="Mobile"
                className="w-full px-3 py-2 border rounded"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, mobile: "" }));
                  }
                }}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}

              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}

              {/* Select: State */}
              <select
                className="w-full px-3 py-2 border rounded"
                value={selectedState}
                onChange={async (e) => {
                  const stateId = e.target.value;
                  setSelectedState(stateId);
                  if (errors.state) {
                    setErrors((prev) => ({ ...prev, state: "" }));
                  }
                  if (stateId) {
                    const res = await fetch(
                      `https://api.hinduhelpline.in/api/v1/general/district/list?state=${stateId}`,
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
                    setDistricts(data.data); // assuming response = { data: [...] }
                  } else {
                    setDistricts([]);
                  }
                }}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}


              {/* Select: District */}
              <select
                className="w-full px-3 py-2 border rounded"
                value={selectedDistrict}
                onChange={async (e) => {
                  const districtId = e.target.value;
                  setSelectedDistrict(districtId);
                  if (errors.district) {
                    setErrors((prev) => ({ ...prev, district: "" }));
                  }
                  if (districtId) {
                    const res = await fetch(
                      `https://api.hinduhelpline.in/api/v1/general/block/list?district=${districtId}`,
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
                    setBlocks(data.data); // Assuming { data: [...] }
                  } else {
                    setBlocks([]);
                  }
                }}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}

              <select
                className="w-full px-3 py-2 border rounded"
                value={selectedBlock}
                onChange={(e) => {
                  setSelectedBlock(e.target.value)
                  if (errors.block) {
                    setErrors((prev) => ({ ...prev, block: "" }));
                  }
                }}
              >
                <option value="">Select Block</option>
                {blocks.map((block) => (
                  <option key={block._id} value={block._id}>
                    {block.name}
                  </option>
                ))}
              </select>
              {errors.block && <p className="text-red-500 text-sm mt-1">{errors.block}</p>}


              <select
                className="w-full px-3 py-2 border rounded"
                value={selectedResponsibility}
                onChange={(e) => {
                  if (errors.responsibility) {
                    setErrors((prev) => ({ ...prev, responsibility: "" }));
                  }
                  setSelectedResponsibility(e.target.value)
                }}
              >
                <option value="">Select Responsibility</option>
                <option value="national">National</option>
                <option value="state">State</option>
                <option value="district">District</option>
                <option value="block">Block</option>
              </select>
              {errors.responsibility && <p className="text-red-500 text-sm mt-1">{errors.responsibility}</p>}

            </form>


            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && <p>Loading admins...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {admins.map((admin: any) => (
          <div
            key={admin._id}
            className="p-4 bg-white rounded-lg shadow border border-gray-200 space-y-2"
          >
            <h2 className="text-xl font-bold">
              {admin.firstName} {admin.lastName}
            </h2>
            <p className="text-sm text-gray-700">📞 {admin.mobile}</p>
            <p className="text-sm text-gray-700">✉️ {admin.email}</p>
            <p className="text-sm text-gray-700">
              🌐 {admin.state?.name}, {admin.district?.name}
            </p>
            <p className="text-sm">
              🧾 Responsibility:{" "}
              <span className="font-medium">{admin.responsibility}</span>
            </p>
            <p className={`text-sm font-semibold ${admin.isActive ? "text-green-600" : "text-red-600"}`}>
              {admin.isActive ? "Active ✅" : "Inactive ❌"}
            </p>
          </div>
        ))}
      </div>

    </main>
  );
}
