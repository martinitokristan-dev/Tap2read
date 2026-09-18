"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Palette, AlertCircle, Loader2, ExternalLink } from "lucide-react";
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

interface ActivityItem {
  id: string | number;
  title: string;
  description?: string | null;
  canvaLink?: string;
  canvaUrl?: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  createdAt: string;
}

export default function AdminActivitiesPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [canvaUrl, setCanvaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailPublicId, setThumbnailPublicId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/activities", { cache: "no-store" });
      const data = await res.json();
      if (data?.data) setItems(data.data);
    } catch (err) {
      toast.error("Failed to load activities.");
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
    setCanvaUrl("");
    setThumbnailUrl("");
    setThumbnailPublicId("");
    setModalOpen(true);
  };

  const openEdit = (item: ActivityItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setCanvaUrl(item.canvaLink || item.canvaUrl || "");
    setThumbnailUrl(item.imageUrl || item.thumbnailUrl || "");
    setThumbnailPublicId(item.thumbnailPublicId || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an activity title.");
      return;
    }
    if (!canvaUrl.trim()) {
      toast.error("Please provide the Canva activity link.");
      return;
    }

    setSubmitting(true);

    try {
      const isEdit = !!editingItem;
      const url = isEdit ? `/api/activities/${editingItem.id}` : "/api/activities";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          canvaLink: canvaUrl.trim(),
          canvaUrl: canvaUrl.trim(),
          imageUrl: thumbnailUrl,
          thumbnailUrl,
          thumbnailPublicId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save activity.");
      }

      toast.success(isEdit ? "Activity updated!" : "Activity added!");
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
      const res = await fetch(`/api/activities/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete activity.");
      }

      toast.success("Activity removed.");
      setDeletingId(null);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "Could not delete activity.");
    }
  };

  const isMaxReached = items.length >= 5;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Canva Activities
            </h1>
            <Badge variant={isMaxReached ? "destructive" : "success"}>
              {items.length} / 5 Max
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Add interactive reading activities and worksheets created on Canva (Up to 5 activities).
          </p>
        </div>

        {items.length > 0 && (
          <Button
            onClick={openAdd}
            disabled={isMaxReached}
            className="font-bold rounded-xl gap-2 shadow-md"
          >
            <Plus className="h-4 w-4" />
            {isMaxReached ? "Limit Reached (5/5)" : "Add Canva Activity"}
          </Button>
        )}
      </div>

      {isMaxReached && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Maximum limit of 5 Canva activities reached.</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading activities...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <Palette className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-bold">No Canva activities yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Add up to 5 interactive Canva reading exercises for students.
          </p>
          <Button onClick={openAdd} size="sm" className="font-bold rounded-xl">
            Add First Activity
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Canva Link</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.imageUrl || item.thumbnailUrl ? (
                    <img
                      src={(item.imageUrl || item.thumbnailUrl)!}
                      alt={item.title}
                      className="h-12 w-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-12 w-16 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      Canva
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-bold text-slate-900">{item.title}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-blue-600 max-w-xs truncate">
                  <a
                    href={item.canvaLink || item.canvaUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    Open Canva <ExternalLink className="h-3 w-3" />
                  </a>
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
              {editingItem ? "Edit Canva Activity" : "Add Canva Activity (Max 5)"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="act-title">Activity Title</Label>
              <Input
                id="act-title"
                placeholder="e.g. Rhyming Words Matching Game"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="act-url">Canva Link / URL</Label>
              <Input
                id="act-url"
                type="url"
                placeholder="https://www.canva.com/design/..."
                value={canvaUrl}
                onChange={(e) => setCanvaUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="act-desc">Description (Optional)</Label>
              <Textarea
                id="act-desc"
                rows={3}
                placeholder="Instructions or learning outcome..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <FileUpload
              label="Thumbnail Image (Optional)"
              resourceType="image"
              folder="tap2read/activities"
              initialUrl={thumbnailUrl}
              onSuccess={(url, publicId) => {
                setThumbnailUrl(url);
                setThumbnailPublicId(publicId);
              }}
            />

            <Button
              type="submit"
              className="w-full font-bold h-11"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Activity"
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
            <AlertDialogTitle>Delete Canva Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this Canva activity? This will free up a slot (up to 5 max).
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
