"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  onSuccess: (url: string, publicId: string) => void;
  folder?: string;
  resourceType?: "image" | "video";
  initialUrl?: string;
  label?: string;
  accept?: string;
}

export function FileUpload({
  onSuccess,
  folder = "tap2read/materials",
  resourceType = "image",
  initialUrl = "",
  label = "Upload File",
  accept = resourceType === "video" ? "video/*" : "image/*",
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialUrl);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(10);

    try {
      // Step 1: Request signature from our backend
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, resourceType }),
      });

      if (!signRes.ok) {
        throw new Error("Failed to authenticate upload request.");
      }

      const { data: signData } = await signRes.json();
      setProgress(30);

      // Step 2: Upload directly from the browser to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const xhr = new XMLHttpRequest();
      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round(30 + (event.loaded / event.total) * 65);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setProgress(100);
          setPreviewUrl(response.secure_url);
          setUploading(false);
          onSuccess(response.secure_url, response.public_id);
        } else {
          setError("Upload to Cloudinary failed. Check file size and format.");
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred during direct upload.");
        setUploading(false);
      };

      xhr.open("POST", uploadUrl);
      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || "An unexpected upload error occurred.");
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onSuccess("", "");
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        {previewUrl && (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Ready
          </Badge>
        )}
      </div>

      {previewUrl ? (
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2 overflow-hidden group">
          {resourceType === "video" ? (
            <video
              src={previewUrl}
              controls
              className="w-full h-48 rounded-xl object-cover bg-black"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 rounded-xl object-cover"
            />
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute top-4 right-4 h-8 w-8 rounded-full shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 cursor-pointer transition-all duration-200 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-700 mb-1">
            Click to upload {resourceType}
          </p>
          <p className="text-xs text-slate-500">
            Direct Cloudinary upload (bypasses server file limits)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-blue-600">
              <Loader2 className="h-3 w-3 animate-spin" /> Uploading to cloud...
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
