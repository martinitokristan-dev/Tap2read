"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);

    try {
      // 1. Direct browser submission to FormSubmit (100% reliable from user's real browser IP)
      const formSubmitPromise = fetch("https://formsubmit.co/ajax/5e291b5d57d61cc10d531e140118a814", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject?.trim() || "General Inquiry",
          message: formData.message.trim(),
          _subject: `New Tap2Read Message from ${formData.name.trim()}`,
          _replyto: formData.email.trim(),
          _captcha: "false",
        }),
      }).catch((err) => {
        console.warn("[Tap2Read] Direct FormSubmit error:", err);
        return null;
      });

      // 2. Concurrently save to local database for the Teacher Portal (/admin/messages)
      const dbPromise = fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          senderName: formData.name.trim(),
          senderEmail: formData.email.trim(),
        }),
      }).catch((err) => {
        console.warn("[Tap2Read] Database save error:", err);
        return null;
      });

      const [fsRes, dbRes] = await Promise.all([formSubmitPromise, dbPromise]);

      const fsOk = fsRes && fsRes.ok;
      const dbOk = dbRes && dbRes.ok;

      if (fsOk || dbOk) {
        setSubmitted(true);
        toast.success("Thank you. Your message has been sent to our team.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Could not send message. Please check your internet connection and try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-16 sm:scroll-mt-20 py-16 md:py-24 bg-transparent border-t border-amber-200/40">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        <div className="max-w-xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3">
            Inquiries
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Send a Message
          </h2>
          <p className="text-sm text-slate-800 font-medium">
            Have questions or feedback regarding the platform? Contact our research team below.
          </p>
        </div>

        <Card className="border-border rounded-lg shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="h-10 w-10 rounded-full bg-muted text-foreground flex items-center justify-center mx-auto border border-border">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Message Delivered</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto font-medium">
                  Your message has been received. Our team will review and follow up if needed.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs">Your Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="e.g. Maria Santos"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-xs">Your Email Address *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="e.g. maria@school.edu"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject" className="text-xs">Subject</Label>
                  <Input
                    id="contact-subject"
                    placeholder="e.g. Reading material inquiry"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="text-xs">Message *</Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="text-xs leading-relaxed"
                  />
                </div>

                <Button
                  type="submit"
                  size="default"
                  className="w-full gap-2 text-xs font-bold font-jolly rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
