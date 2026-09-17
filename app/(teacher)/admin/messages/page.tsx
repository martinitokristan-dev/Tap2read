"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2, Eye, Mail, Loader2, Calendar } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { toast } from "sonner";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Viewing dialog
  const [viewingItem, setViewingItem] = useState<MessageItem | null>(null);

  // Delete dialog
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data?.data) setItems(data.data);
    } catch (err) {
      toast.error("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/messages?id=${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete message.");
      }

      toast.success("Message deleted.");
      setDeletingId(null);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "Could not delete message.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Contact Inquiries
            </h1>
            <Badge variant="secondary">
              {items.length} Messages
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Review inquiries and messages submitted via the &quot;Message Us&quot; form.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading inquiries...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 font-bold">No messages yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Inquiries submitted through the Contact Us form will appear here.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {item.email}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-slate-800">
                    {item.subject || "No Subject"}
                  </span>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                    {item.message}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingItem(item)}
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
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

      {/* View Message Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewingItem && (
            <div className="space-y-4 pt-2">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-slate-900">
                  {viewingItem.subject || "Inquiry Message"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  From {viewingItem.name} ({viewingItem.email})
                </DialogDescription>
              </DialogHeader>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                {viewingItem.message}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(viewingItem.createdAt).toLocaleString()}
                </span>
                <a
                  href={`mailto:${viewingItem.email}?subject=Re: ${encodeURIComponent(viewingItem.subject || "Tap2Read Inquiry")}`}
                >
                  <Button size="sm" className="font-bold rounded-xl gap-1">
                    <Mail className="h-3.5 w-3.5" /> Reply by Email
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inquiry record?
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
