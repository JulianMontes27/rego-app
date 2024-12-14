"use server";

import { headers } from "next/headers";

//server action to call from client component, on the server
export const fastApiTest = async (values: { file_url: string }) => {
  if (!values || !values.file_url) {
    throw new Error("No file_url.");
  }

  const fastApiTest = await fetch("http://localhost:8000/process-image", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: headers().get("cookie") || "",
    },
    body: JSON.stringify({ file_url: values.file_url }), //Since the file URL is being passed as a string (and not a File object), ensure the URL is properly included in the body of the request. You can achieve this by sending it as JSON.

    cache: "no-store",
  });

  if (!fastApiTest.ok) {
    throw new Error(`HTTP error! status: ${fastApiTest.status}`);
  }

  const data = await fastApiTest.json();

  return data;
};
