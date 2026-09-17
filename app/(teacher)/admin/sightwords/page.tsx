"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, BookOpen, AlertCircle, Loader2 } from "lucide-react";
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

interface SightWord {
  id: string;
  word: string;
  imageUrl: string;
  imagePublicId?: string | null;
  createdAt: string;
}

export default function AdminSightWordsPage() {
  const [items, setItems] = useState<SightWord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SightWord | null>(null);
  const [word, setWord] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/sightwords");
      const data = await res.json();
      if (data?.data) setItems(data.data);
    } catch (err) {
      toast.error("Failed to load sight words.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setWord("");
    setImageUrl("");
    setImagePublicId("");
    setModalOpen(true);
  };

  const openEdit = (item: SightWord) => {
    setEditingItem(item);
    setWord(item.word);
    setImageUrl(item.imageUrl);
    setImagePublicId(item.imagePublicId || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please upload an image for this sight word.");
      return;
    }

    setSubmitting(true);

    try {
      const isEdit = !!editingItem;
      const url = isEdit ? `/api/sightwords/${editingItem.id}` : "/api/sightwords";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: word ? word.trim().toLowerCase() : "",
          imageUrl,
          imagePublicId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save sight word.");
      }

      toast.success(isEdit ? "Sight word updated!" : "Sight word created!");
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
      const res = await fetch(`/api/sightwords/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete item.");
      }

      toast.success("Sight word removed.");
      setDeletingId(null);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "Could not delete sight word.");
    }
  };

  const isMaxReached = items.length >= 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Sight Words
            </h1>
            <Badge variant={isMaxReached ? "destructive" : "success"}>
              {items.length} / 5 Max
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Sight words feature an illustrated picture and vocabulary recognition.
          </p>
        </div>

        <Button
          onClick={openAdd}
          disabled={isMaxReached}
          className="font-bold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          {isMaxReached ? "Limit Reached (5/5)" : "Add Sight Word"}
        </Button>
      </div>

      {isMaxReached && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Maximum limit of 5 sight words reached. Delete or edit an existing word to make room.</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading sight words...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-bold">No sight words yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Upload up to 5 sight words with pictures for your students.
          </p>
          <Button onClick={openAdd} size="sm" className="font-bold rounded-xl">
            Add Your First Word
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Word</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.imageUrl}
                    alt={item.word}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                  />
                </TableCell>
                <TableCell>
                  <span className="text-base font-black text-slate-800 capitalize">
                    {item.word || (
                      <span className="text-xs font-semibold text-slate-400 italic">
                        (Visual card only)
                      </span>
                    )}
                  </span>
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
              {editingItem ? "Edit Sight Word" : "Add New Sight Word"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="word-input">
                Sight Word <span className="text-xs font-normal text-slate-500">(Optional)</span>
              </Label>
              <Input
                id="word-input"
                placeholder="e.g. apple, cat, or leave blank for visual-only"
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>

            <FileUpload
              label="Sight Word Picture"
              resourceType="image"
              folder="tap2read/sightwords"
              initialUrl={imageUrl}
              onSuccess={(url, publicId) => {
                setImageUrl(url);
                setImagePublicId(publicId);
              }}
            />

            <Button
              type="submit"
              className="w-full font-bold h-11"
              disabled={submitting || !imageUrl}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Sight Word"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sight Word?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this sight word? This will free up a slot (up to 5 max) and cannot be undone.
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
