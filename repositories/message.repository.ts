import { prisma } from '@/lib/prisma';
import { ContactForm } from '@/types/form.types';

// Recompiled repository with updated schema
export const messageRepository = {
  create(data: ContactForm) {
    return prisma.contactMessage.create({
      data: {
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        message: data.message,
        isRead: false,
      },
    });
  },

  findAll() {
    return prisma.contactMessage.findMany({
      orderBy: { sentAt: 'desc' },
      include: {
        replies: {
          orderBy: { sentAt: 'asc' },
        },
      },
    });
  },

  findById(id: number) {
    return prisma.contactMessage.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { sentAt: 'asc' },
        },
      },
    });
  },

  createReply(data: {
    messageId: number;
    senderType: string;
    senderName: string;
    senderEmail: string;
    content: string;
  }) {
    return prisma.contactReply.create({
      data: {
        messageId: data.messageId,
        senderType: data.senderType,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        content: data.content,
      },
    });
  },

  markAsRead(id: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  },

  markAsUnread(id: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: false },
    });
  },

  getUnreadCount() {
    return prisma.contactMessage.count({
      where: { isRead: false },
    });
  },

  delete(id: number) {
    return prisma.contactMessage.delete({ where: { id } });
  },
};

