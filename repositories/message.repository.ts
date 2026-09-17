import { prisma } from '@/lib/prisma';
import { ContactForm } from '@/types/form.types';

export const messageRepository = {
  create(data: ContactForm) {
    return prisma.contactMessage.create({
      data: {
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        message: data.message,
      },
    });
  },

  findAll() {
    return prisma.contactMessage.findMany({ orderBy: { sentAt: 'desc' } });
  },

  delete(id: number) {
    return prisma.contactMessage.delete({ where: { id } });
  },
};
