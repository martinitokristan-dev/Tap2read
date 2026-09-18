"use client";

import React, { useState, useEffect } from "react";
import { Users, Edit, Loader2 } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/shared/FileUpload";
import { toast } from "sonner";

interface Researcher {
  id: string | number;
  fullName?: string;
  name?: string;
  role?: string | null;
  description?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
}

export default function AdminResearchersPage() {
  const [items, setItems] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Researcher | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/researchers", { cache: "no-store" });
      const data = await res.json();
      if (data?.data) setItems(data.data);
    } catch (err) {
      toast.error("Failed to load researchers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openEdit = (item: Researcher) => {
    setEditingItem(item);
    setName(item.fullName || item.name || "");
    setRole(item.role || "");
    setBio(item.description || item.bio || "");
    setImageUrl(item.photoUrl || item.imageUrl || "");
    setImagePublicId(item.imagePublicId || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!name.trim()) {
      toast.error("Please enter researcher name.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/researchers/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name.trim(),
          name: name.trim(),
          role: role.trim(),
          description: bio.trim(),
          bio: bio.trim(),
          photoUrl: imageUrl,
          imageUrl,
          imagePublicId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update researcher.");
      }

      toast.success("Researcher profile updated!");
      setModalOpen(false);
      loadItems();
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(/[\s,]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Researchers (6 Members)
            </h1>
            <Badge variant="info">Fixed Team of 6</Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Update photos, roles, and bios for the 6 research proponents.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading researcher profiles...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Photo</TableHead>
              <TableHead>Researcher Name</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const displayName = item.fullName || item.name || "Researcher";
              const displayPhoto = item.photoUrl || item.imageUrl;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar className="h-12 w-12 rounded-xl ring-1 ring-slate-200">
                      {displayPhoto && (
                        <AvatarImage src={displayPhoto} alt={displayName} />
                      )}
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{displayName}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs font-semibold text-slate-600">
                    {item.role || "Researcher"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(item)}
                      className="font-bold rounded-xl gap-1 text-xs"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Edit Researcher Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="res-name">Full Name</Label>
              <Input
                id="res-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="res-role">Role / Specialization</Label>
              <Input
                id="res-role"
                placeholder="e.g. Lead Researcher, Curriculum Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="res-bio">Short Bio (Optional)</Label>
              <Textarea
                id="res-bio"
                rows={3}
                placeholder="Short bio or description..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <FileUpload
              label="Profile Photo"
              resourceType="image"
              folder="tap2read/researchers"
              initialUrl={imageUrl}
              onSuccess={(url, publicId) => {
                setImageUrl(url);
                setImagePublicId(publicId);
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
                "Update Profile"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
