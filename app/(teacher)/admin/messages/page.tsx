"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Trash2,
  Eye,
  Mail,
  Loader2,
  Calendar,
  Send,
  CheckCheck,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ReplyItem {
  id: string;
  senderType: "TEACHER" | "VISITOR" | string;
  senderName: string;
  senderEmail: string;
  content: string;
  sentAt: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  sentAt?: string;
  replies?: ReplyItem[];
}

function parseMessageSubjectAndBody(item: MessageItem) {
  let subject = item.subject?.trim() || null;
  let message = item.message;

  const match = item.message.match(/^\[Subject:\s*([^\]]+)\]\s*\n*/i);
  if (match) {
    if (!subject) subject = match[1].trim();
    message = item.message.slice(match[0].length).trim();
  }

  return {
    subject: subject || "General Inquiry",
    message,
  };
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Conversation Dialog state
  const [viewingItem, setViewingItem] = useState<MessageItem | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data?.data) {
        setItems(data.data);
      }
    } catch (err) {
      toast.error("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Auto-scroll conversation to bottom when viewingItem or replies update
  useEffect(() => {
    if (viewingItem) {
      setTimeout(() => {
        threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewingItem?.replies?.length, viewingItem?.id]);

  const markMessageAsRead = async (id: string) => {
    try {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true }),
      });
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isRead: true } : it))
      );
      window.dispatchEvent(new Event("messages-updated"));
    } catch {
      // silent
    }
  };

  const toggleReadStatus = async (item: MessageItem) => {
    const nextRead = !item.isRead;
    try {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isRead: nextRead }),
      });
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isRead: nextRead } : it))
      );
      if (viewingItem && viewingItem.id === item.id) {
        setViewingItem({ ...viewingItem, isRead: nextRead });
      }
      window.dispatchEvent(new Event("messages-updated"));
      toast.success(nextRead ? "Conversation marked as read." : "Conversation marked as unread.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleOpenConversation = (item: MessageItem) => {
    setViewingItem(item);
    setReplyMessage("");
    if (!item.isRead) {
      markMessageAsRead(item.id);
    }
  };

  const handleSendReply = async () => {
    if (!viewingItem || !replyMessage.trim()) return;
    setSendingReply(true);

    const { subject: cleanSubject, message: cleanOriginal } = parseMessageSubjectAndBody(viewingItem);

    try {
      const res = await fetch("/api/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: viewingItem.id,
          to: viewingItem.email,
          toName: viewingItem.name,
          subject: cleanSubject || "Tap2Read Inquiry Response",
          replyMessage: replyMessage.trim(),
          originalMessage: cleanOriginal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reply");
      }

      toast.success(`Reply sent via email and added to conversation!`);

      const newReply: ReplyItem = {
        id: "reply-" + Date.now(),
        senderType: "TEACHER",
        senderName: "Tap2Read Team",
        senderEmail: "tap2read26@gmail.com",
        content: replyMessage.trim(),
        sentAt: new Date().toISOString(),
      };

      const updatedReplies = [...(viewingItem.replies || []), newReply];
      const updatedItem: MessageItem = {
        ...viewingItem,
        isRead: true,
        replies: updatedReplies,
      };

      setViewingItem(updatedItem);
      setItems((prev) =>
        prev.map((it) => (it.id === viewingItem.id ? updatedItem : it))
      );
      setReplyMessage("");
      window.dispatchEvent(new Event("messages-updated"));
    } catch (err: any) {
      toast.error(err.message || "Could not send reply.");
    } finally {
      setSendingReply(false);
    }
  };

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

      toast.success("Message thread deleted.");
      if (viewingItem && viewingItem.id === deletingId) {
        setViewingItem(null);
      }
      setDeletingId(null);
      loadItems();
      window.dispatchEvent(new Event("messages-updated"));
    } catch (err: any) {
      toast.error(err.message || "Could not delete message.");
    }
  };

  const unreadTotal = items.filter((it) => !it.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Contact Inquiries &amp; Conversations
            </h1>
            <Badge variant="secondary" className="font-semibold">
              {items.length} Total
            </Badge>
            {unreadTotal > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-xs">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                {unreadTotal} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Review inquiries, manage ongoing email conversations, and track student/parent responses.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
          Loading conversations...
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/75">
              <TableRow>
                <TableHead className="w-12 text-center">Status</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Subject &amp; Latest Note</TableHead>
                <TableHead className="hidden sm:table-cell text-center">History</TableHead>
                <TableHead className="hidden md:table-cell">Received</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const { subject, message } = parseMessageSubjectAndBody(item);
                const replyCount = item.replies?.length || 0;
                const isUnread = !item.isRead;

                return (
                  <TableRow
                    key={item.id}
                    className={`cursor-pointer transition-colors ${
                      isUnread
                        ? "bg-red-50/30 hover:bg-red-50/50 font-semibold"
                        : "hover:bg-slate-50/60"
                    }`}
                    onClick={() => handleOpenConversation(item)}
                  >
                    {/* Status Badge */}
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      {isUnread ? (
                        <span
                          title="New / Unread response"
                          className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-black text-white bg-red-500 rounded-full shadow-xs"
                        >
                          ●
                        </span>
                      ) : (
                        <span title="Read" className="inline-flex items-center justify-center">
                          <CheckCheck className="h-4 w-4 text-slate-400 mx-auto" />
                        </span>
                      )}
                    </TableCell>

                    {/* Sender */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isUnread ? "text-slate-900" : "text-slate-800"}`}>
                          {item.name}
                        </span>
                        {isUnread && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-700">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" /> {item.email}
                      </div>
                    </TableCell>

                    {/* Subject & Preview */}
                    <TableCell>
                      <div className="font-bold text-slate-900 text-sm">
                        {subject}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-sm mt-0.5">
                        {replyCount > 0
                          ? `Last reply: ${item.replies![replyCount - 1].content}`
                          : message}
                      </p>
                    </TableCell>

                    {/* Conversation Count */}
                    <TableCell className="hidden sm:table-cell text-center">
                      {replyCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <MessageSquare className="h-3 w-3" />
                          {replyCount} {replyCount === 1 ? "reply" : "replies"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          No replies
                        </span>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="hidden md:table-cell text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="text-right space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenConversation(item)}
                        title="Open Conversation Thread"
                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(item.id)}
                        title="Delete Thread"
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
        </div>
      )}

      {/* Conversation Thread & Reply Modal */}
      <Dialog
        open={!!viewingItem}
        onOpenChange={(open) => {
          if (!open) {
            setViewingItem(null);
            setReplyMessage("");
          }
        }}
      >
        <DialogContent className="w-[95vw] sm:max-w-4xl lg:max-w-5xl h-[88vh] max-h-[900px] flex flex-col p-0 gap-0 overflow-hidden rounded-3xl shadow-2xl border border-slate-200/90 bg-white">
          {viewingItem && (() => {
            const { subject: dialogSubject, message: dialogMessage } =
              parseMessageSubjectAndBody(viewingItem);
            const replies = viewingItem.replies || [];

            return (
              <div className="flex flex-col h-full min-h-0">
                {/* Header with safe right-padding so close 'X' button never overlaps */}
                <div className="px-6 sm:px-8 pt-5 pb-4 border-b border-slate-100 bg-white pr-16 sm:pr-20 shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <DialogTitle className="text-xl font-black text-slate-900">
                          {dialogSubject}
                        </DialogTitle>
                        {replies.length > 0 && (
                          <Badge variant="outline" className="text-xs text-indigo-700 bg-indigo-50 border-indigo-200">
                            {replies.length} {replies.length === 1 ? "response" : "responses"}
                          </Badge>
                        )}
                      </div>
                      <DialogDescription className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>From: <strong>{viewingItem.name}</strong> ({viewingItem.email})</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(viewingItem.createdAt).toLocaleString()}
                        </span>
                      </DialogDescription>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReadStatus(viewingItem)}
                      className="text-xs shrink-0 font-semibold"
                    >
                      {viewingItem.isRead ? "Mark as Unread" : "Mark as Read"}
                    </Button>
                  </div>
                </div>

                {/* Conversation Timeline */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 bg-slate-50/70 min-h-0">
                  {/* Visitor Initial Message Bubble */}
                  <div className="flex flex-col items-start gap-1 max-w-[85%] sm:max-w-[78%]">
                    <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold text-slate-600">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{viewingItem.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({new Date(viewingItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                      <span className="text-[9px] font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                        Inquiry
                      </span>
                    </div>
                    <div className="bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 text-sm font-medium shadow-2xs whitespace-pre-wrap leading-relaxed">
                      {dialogMessage}
                    </div>
                  </div>

                  {/* Replies History */}
                  {replies.map((reply, index) => {
                    const isTeacher = reply.senderType === "TEACHER";
                    return (
                      <div
                        key={reply.id || index}
                        className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[78%] ${
                          isTeacher ? "items-end ml-auto" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold">
                          {isTeacher ? (
                            <>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(reply.sentAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                              </span>
                              <span className="text-indigo-700">{reply.senderName || "Tap2Read Team"}</span>
                              <span className="text-[9px] font-semibold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <ShieldCheck className="h-2.5 w-2.5" /> Teacher
                              </span>
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 text-slate-400" />
                              <span className="text-slate-700">{reply.senderName || viewingItem.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(reply.sentAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                              </span>
                              <span className="text-[9px] font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                                Visitor
                              </span>
                            </>
                          )}
                        </div>

                        <div
                          className={`p-4 text-sm font-medium whitespace-pre-wrap leading-relaxed ${
                            isTeacher
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-xs shadow-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs shadow-2xs"
                          }`}
                        >
                          {reply.content}
                        </div>
                      </div>
                    );
                  })}

                  <div ref={threadEndRef} />
                </div>

                {/* Reply Composer */}
                <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Send className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Reply to {viewingItem.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Sending via official email (<span className="text-indigo-600 font-semibold">tap2read26@gmail.com</span>)
                    </span>
                  </div>

                  <Textarea
                    rows={3}
                    placeholder={`Type your reply to ${viewingItem.name}... It will be emailed and added to this thread.`}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="text-xs sm:text-sm font-medium rounded-xl border-slate-200 focus:border-indigo-500 resize-none min-h-[90px]"
                    disabled={sendingReply}
                  />

                  <div className="flex items-center justify-end pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="font-bold rounded-xl gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                      {sendingReply ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Sending Email &amp; Saving...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation Thread?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message and all its conversation history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
