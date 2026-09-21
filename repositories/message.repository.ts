import { prisma } from '@/lib/prisma';
import { ContactForm } from '@/types/form.types';

// Recompiled repository with updated schema
export const messageRepository = {
  async create(data: ContactForm) {
    try {
      return await prisma.contactMessage.create({
        data: {
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          message: data.message,
          isRead: false,
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2022') {
        return await prisma.$executeRaw`INSERT INTO contact_messages (senderName, senderEmail, message, sentAt) VALUES (${data.senderName}, ${data.senderEmail}, ${data.message}, NOW())`;
      }
      throw err;
    }
  },

  async findAll() {
    try {
      return await prisma.contactMessage.findMany({
        orderBy: { sentAt: 'desc' },
        include: {
          replies: {
            orderBy: { sentAt: 'asc' },
          },
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2022') {
        const raw = await prisma.$queryRaw<any[]>`SELECT id, senderName, senderEmail, message, sentAt FROM contact_messages ORDER BY sentAt DESC`;
        return raw.map((m) => ({
          ...m,
          isRead: false,
          replies: [],
        }));
      }
      throw err;
    }
  },

  async findById(id: number) {
    try {
      return await prisma.contactMessage.findUnique({
        where: { id },
        include: {
          replies: {
            orderBy: { sentAt: 'asc' },
          },
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2022') {
        const raw = await prisma.$queryRaw<any[]>`SELECT id, senderName, senderEmail, message, sentAt FROM contact_messages WHERE id = ${id} LIMIT 1`;
        if (!raw || raw.length === 0) return null;
        return {
          ...raw[0],
          isRead: false,
          replies: [],
        };
      }
      throw err;
    }
  },

  async createReply(data: {
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

  async markAsRead(id: number) {
    try {
      return await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      });
    } catch (err: any) {
      if (err?.code === 'P2022') return null;
      throw err;
    }
  },

  async markAsUnread(id: number) {
    try {
      return await prisma.contactMessage.update({
        where: { id },
        data: { isRead: false },
      });
    } catch (err: any) {
      if (err?.code === 'P2022') return null;
      throw err;
    }
  },

  async getUnreadCount() {
    try {
      return await prisma.contactMessage.count({
        where: { isRead: false },
      });
    } catch (err: any) {
      if (err?.code === 'P2022') {
        // Return 0 gracefully if isRead column is not created in DB yet
        return 0;
      }
      throw err;
    }
  },

  delete(id: number) {
    return prisma.contactMessage.delete({ where: { id } });
  },
};

