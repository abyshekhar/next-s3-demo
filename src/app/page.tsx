"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!selectedFile) return;
    try {
      setUploading(true);
      const name = selectedFile?.name;
      const response = await fetch(`/api/upload?file=${name}`);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();

      const fileUpload = await fetch(data.uploadUrl, {
        method: "PUT",
        body: selectedFile,
      });
      setFileUrl(data.downloadUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };
  return (
    <main className="flex">
      <div className="w-1/2">
        <form
          onSubmit={handleUpload}
          className="h-[600px] border-solid border-2 rounded m-4 p-4 flex flex-col"
        >
          <h2 className="text-xl font-semibold mb-6">Nextjs S3 Demo</h2>
          <input type="file" id="file" onChange={handleFileChange} />
          <button
            type="submit"
            className="bg-slate-900 text-white rounded w-[100px] p-2 mt-4"
          >
            Upload
          </button>
        </form>
      </div>
      <div className="border-solid border-2 rounded w-1/2 m-4 p-4">
        {fileUrl.length ? (
          <>
            <h2 className="text-xl font-semibold mb-6">Uploaded Image</h2>

            <Image
              src={fileUrl}
              width={350}
              height={350}
              objectFit="cover"
              alt="Uploaded image"
            />
          </>
        ) : (
          <h2 className="text-xl font-semibold mb-6">No images uploaded</h2>
        )}
      </div>
    </main>
  );
}
