"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, BookMarked, AlertCircle, Loader2 } from "lucide-react";
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

interface ShortStory {
  id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  coverPublicId?: string | null;
  createdAt: string;
}

export default function AdminShortStoriesPage() {
  const [items, setItems] = useState<ShortStory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShortStory | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/shortstories");
      const data = await res.json();
      if (data?.data) setItems(data.data);
    } catch (err) {
      toast.error("Failed to load short stories.");
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
    setContent("");
    setCoverImage("");
    setCoverPublicId("");
    setModalOpen(true);
  };

  const openEdit = (item: ShortStory) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setCoverImage(item.coverImage || "");
    setCoverPublicId(item.coverPublicId || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a story title.");
      return;
    }
    if (!coverImage) {
      toast.error("Please upload the story image / illustration.");
      return;
    }

    setSubmitting(true);

    try {
      const isEdit = !!editingItem;
      const url = isEdit ? `/api/shortstories/${editingItem.id}` : "/api/shortstories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content ? content.trim() : "",
          coverImage,
          coverPublicId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save short story.");
      }

      toast.success(isEdit ? "Story updated!" : "Story created!");
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
      const res = await fetch(`/api/shortstories/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete story.");
      }

      toast.success("Short story removed.");
      setDeletingId(null);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "Could not delete story.");
    }
  };

  const isMaxReached = items.length >= 5;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Short Stories
            </h1>
            <Badge variant={isMaxReached ? "destructive" : "success"}>
              {items.length} / 5 Max
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Publish interactive short stories with an optional cover illustration.
          </p>
        </div>

        <Button
          onClick={openAdd}
          disabled={isMaxReached}
          className="font-bold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          {isMaxReached ? "Limit Reached (5/5)" : "Add Short Story"}
        </Button>
      </div>

      {isMaxReached && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Maximum limit of 5 short stories reached.</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading stories...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <BookMarked className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-bold">No short stories yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Create up to 5 short stories for students to read.
          </p>
          <Button onClick={openAdd} size="sm" className="font-bold rounded-xl">
            Add Your First Story
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Excerpt</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="h-12 w-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-12 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                      No Img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-bold text-slate-900">{item.title}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-slate-500 line-clamp-1 max-w-xs">
                  {item.content || <span className="italic text-slate-400 font-normal">(Story in illustration)</span>}
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

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingItem ? "Edit Story" : "Create New Short Story"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="story-title">Story Title</Label>
              <Input
                id="story-title"
                placeholder="e.g. The Brave Little Star"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <FileUpload
              label="Story Image / Illustrated Page"
              resourceType="image"
              folder="tap2read/stories"
              initialUrl={coverImage}
              onSuccess={(url, publicId) => {
                setCoverImage(url);
                setCoverPublicId(publicId);
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="story-content">
                Story Text <span className="text-xs font-normal text-slate-500">(Optional — leave blank if story is already written in the image)</span>
              </Label>
              <Textarea
                id="story-content"
                rows={5}
                placeholder="Optional text transcription or story text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

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
                "Save Short Story"
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
            <AlertDialogTitle>Delete Short Story?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this story? This will permanently delete it and free up a story slot.
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
