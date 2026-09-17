"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Video, AlertCircle, Loader2, Play } from "lucide-react";
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
import { toast } from "sonner";

interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  videoPublicId?: string | null;
  createdAt: string;
}

export default function AdminVideosPage() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VideoItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPublicId, setVideoPublicId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/videos");
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
    setVideoPublicId("");
    setModalOpen(true);
  };

  const openEdit = (item: VideoItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setVideoUrl(item.videoUrl);
    setVideoPublicId(item.videoPublicId || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a video title.");
      return;
    }
    if (!videoUrl) {
      toast.error("Please upload a video file.");
      return;
    }

    setSubmitting(true);

    try {
      const isEdit = !!editingItem;
      const url = isEdit ? `/api/videos/${editingItem.id}` : "/api/videos";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl,
          videoPublicId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save video.");
      }

      toast.success(isEdit ? "Video updated!" : "Video uploaded!");
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

        <Button
          onClick={openAdd}
          disabled={isMaxReached}
          className="font-bold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          {isMaxReached ? "Limit Reached (5/5)" : "Upload Video"}
        </Button>
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
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="h-12 w-20 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={item.videoUrl}
                      className="h-full w-full object-cover"
                    />
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
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingItem ? "Edit Video" : "Upload Video (Max 5)"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="vid-title">Video Title</Label>
              <Input
                id="vid-title"
                placeholder="e.g. Learning Letter Sounds"
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
                placeholder="Short description of the lesson..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <FileUpload
              label="Video File"
              resourceType="video"
              folder="tap2read/videos"
              initialUrl={videoUrl}
              onSuccess={(url, publicId) => {
                setVideoUrl(url);
                setVideoPublicId(publicId);
              }}
            />

            <Button
              type="submit"
              className="w-full font-bold h-11"
              disabled={submitting || !videoUrl}
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
