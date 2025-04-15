"use client";

import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import { UserFormValues, validationSchema } from "./Isetting";


const Page = () => {
  const [loading, setLoading] = useState(false); // For form submission
  const [fetching, setFetching] = useState(true); // For initial API loading
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [setting, setSetting] = useState<UserFormValues | null>(null);

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE";
 
      const response = await axios.get("https://flexemart.com/api/misc/settings", {
        headers: {
          Authorization:`${token}`,
          "Content-Type": "application/json",
        },
      });

      setSetting(response.data.data); // Assuming response.data.data contains the setting object
    } catch (error: any) {
      setErrorMessage("Failed to load settings. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  // Submit updated settings to the API
  const handleSubmit = async (values: UserFormValues) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE";
      await axios.put("https://flexemart.com/api/misc/update-settings", values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccessMessage("Settings updated successfully!");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while updating settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);



  // Render loading state
  if (fetching) {
    return <div>Loading settings...</div>;
  }

  // Render error if settings couldn't be fetched
  if (!setting) {
    return (
      <div className="text-red-600">
        {errorMessage || "Unable to load settings."}
      </div>
    );
  }

  return (
    <div className="w-2/5 m-auto">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <Formik
        initialValues={{
          afflictionMargin: setting.afflictionMargin,
          profitMargin: setting.profitMargin,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Profit Margin Field */}
            <div className="mb-4">
              <label htmlFor="profitMargin" className="block font-medium">
                Profit Margin*
              </label>
              <Field
                type="text"
                id="profitMargin"
                name="profitMargin"
                className="border rounded w-full p-2"
              />
              <ErrorMessage
                name="profitMargin"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Affliction Margin Field */}
            <div className="mb-4">
              <label htmlFor="afflictionMargin" className="block font-medium">
                Affliction Margin*
              </label>
              <Field
                type="text"
                id="afflictionMargin"
                name="afflictionMargin"
                className="border rounded w-full p-2"
              />
              <ErrorMessage
                name="afflictionMargin"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Updating..." : "Update Settings"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
