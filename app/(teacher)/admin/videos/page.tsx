"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Video, AlertCircle, Loader2, Play, Link as LinkIcon, Upload, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileUpload } from "@/components/shared/FileUpload";
import { isYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnail, resolveVideoThumbnail } from "@/lib/video";
import { toast } from "sonner";

interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  videoPublicId?: string | null;
  thumbnailUrl?: string | null;
  createdAt: string;
}

export default function AdminVideosPage() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VideoItem | null>(null);
  const [sourceMode, setSourceMode] = useState<"link" | "upload">("link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoPublicId, setVideoPublicId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const data = await res.json();
      if (data?.data) setItems(data.data);
    } catch (err) {
      toast.error("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
    setVideoPublicId("");
    setSourceMode("link");
    setModalOpen(true);
  };

  const openEdit = (item: VideoItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setVideoUrl(item.videoUrl);
    const cleanThumb = item.thumbnailUrl?.includes("unsplash.com") ? "" : item.thumbnailUrl;
    setThumbnailUrl(cleanThumb || "");
    setVideoPublicId(item.videoPublicId || "");
    setSourceMode(isYouTubeUrl(item.videoUrl) ? "link" : "upload");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a video title.");
      return;
    }
    if (!videoUrl.trim()) {
      toast.error("Please provide a video URL or upload a file.");
      return;
    }

    setSubmitting(true);

    try {
      const isEdit = !!editingItem;
      const url = isEdit ? `/api/videos/${editingItem.id}` : "/api/videos";
      const method = isEdit ? "PUT" : "POST";

      let finalThumbnail = thumbnailUrl;
      if (finalThumbnail?.includes("unsplash.com")) {
        finalThumbnail = "";
      }

      if (isYouTubeUrl(videoUrl)) {
        finalThumbnail = getYouTubeThumbnail(videoUrl) || "";
      } else if (videoUrl.includes("cloudinary.com")) {
        finalThumbnail = videoUrl.replace(/\.[^/.]+$/, ".jpg");
      } else {
        // Direct web video or MP4: clear so native video frame #t=0.5 is rendered
        finalThumbnail = "";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl: videoUrl.trim(),
          thumbnailUrl: finalThumbnail,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save video.");
      }

      toast.success(isEdit ? "Video updated!" : "Video created!");
      setModalOpen(false);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/videos/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete video.");
      }

      toast.success("Video deleted.");
      setDeletingId(null);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "Could not delete video.");
    }
  };

  const isMaxReached = items.length >= 5;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Educational Videos
            </h1>
            <Badge variant={isMaxReached ? "destructive" : "success"}>
              {items.length} / 5 Max
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Upload videos directly to Cloudinary (bypasses Vercel request limits). Up to 5 videos.
          </p>
        </div>

        {items.length > 0 && (
          <Button
            onClick={openAdd}
            disabled={isMaxReached}
            className="font-bold rounded-xl gap-2 shadow-md"
          >
            <Plus className="h-4 w-4" />
            {isMaxReached ? "Limit Reached (5/5)" : "Upload Video"}
          </Button>
        )}
      </div>

      {isMaxReached && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Maximum limit of 5 videos reached. Remove a video to upload a new one.</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading videos...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <Video className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-bold">No videos uploaded yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Upload up to 5 video reading lessons for your students.
          </p>
          <Button onClick={openAdd} size="sm" className="font-bold rounded-xl">
            Upload First Video
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const previewThumb = resolveVideoThumbnail(item.videoUrl, item.thumbnailUrl);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-12 w-20 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-inner border border-slate-200">
                      {previewThumb ? (
                        <img
                          src={previewThumb}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <video
                          src={`${item.videoUrl}#t=0.5`}
                          preload="metadata"
                          muted
                          playsInline
                          className="h-full w-full object-cover pointer-events-none"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                        <Play className="h-3.5 w-3.5 text-white/90 fill-white/80 drop-shadow" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{item.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-slate-500 line-clamp-1 max-w-xs">
                    {item.description || "No description"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(item)}
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingId(item.id)}
                      className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-slate-100 shrink-0 pr-14">
            <DialogTitle className="text-xl font-black">
              {editingItem ? "Edit Video" : "Add Educational Video (Max 5)"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vid-title">Video Title</Label>
                <Input
                  id="vid-title"
                  placeholder="e.g. Learning Letter Sounds: A to Z"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vid-desc">Description (Optional)</Label>
                <Textarea
                  id="vid-desc"
                  rows={3}
                  placeholder="Short description of the reading lesson..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Video Source Selector */}
              <div className="space-y-2">
                <Label>Video Source</Label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSourceMode("link")}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      sourceMode === "link"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    YouTube / Video Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode("upload")}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      sourceMode === "upload"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload MP4 File
                  </button>
                </div>

                {sourceMode === "link" ? (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <Input
                        placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 URL"
                        value={videoUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVideoUrl(val);
                          if (isYouTubeUrl(val)) {
                            const thumb = getYouTubeThumbnail(val);
                            if (thumb) setThumbnailUrl(thumb);
                          } else if (val.includes("cloudinary.com")) {
                            setThumbnailUrl(val.replace(/\.[^/.]+$/, ".jpg"));
                          } else {
                            setThumbnailUrl("");
                          }
                        }}
                        className="h-10 text-xs"
                      />
                      <p className="text-[11px] text-slate-500">
                        Supports public &amp; unlisted YouTube videos, Vimeo, or direct MP4 URLs. Plays directly inside Tap2Read without leaving the website!
                      </p>
                    </div>

                    {isYouTubeUrl(videoUrl) ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Valid YouTube Link Detected (Ready to play inside Tap2Read)</span>
                        </div>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-sm">
                          <iframe
                            src={getYouTubeEmbedUrl(videoUrl)}
                            title="Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      </div>
                    ) : videoUrl.trim() ? (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-800">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            Video Visual Frame Preview
                          </span>
                          <span className="text-[11px] text-blue-600 font-medium">Visual frame of uploaded video</span>
                        </div>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-sm flex items-center justify-center">
                          <video
                            src={`${videoUrl.trim()}#t=0.5`}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <FileUpload
                      label="Video File (Cloudinary)"
                      resourceType="video"
                      folder="tap2read/videos"
                      initialUrl={videoUrl}
                      onSuccess={(url, publicId) => {
                        setVideoUrl(url);
                        setVideoPublicId(publicId);
                        if (url.includes("cloudinary.com")) {
                          setThumbnailUrl(url.replace(/\.[^/.]+$/, ".jpg"));
                        }
                      }}
                    />
                    <p className="text-[11px] text-slate-500">
                      Direct Cloudinary upload (for files up to 100 MB). For larger videos, use the YouTube Link tab above.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl shrink-0">
              <Button
                type="submit"
                className="w-full font-bold h-11"
                disabled={submitting || !videoUrl.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Video"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this video? The video will also be removed from Cloudinary and free up a slot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
