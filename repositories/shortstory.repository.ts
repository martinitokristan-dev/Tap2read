import { prisma } from '@/lib/prisma';
import { ShortStoryForm } from '@/types/form.types';

export const shortStoryRepository = {
  findAll() {
    return prisma.shortStory.findMany({ orderBy: { displayOrder: 'asc' } });
  },

  findById(id: number) {
    return prisma.shortStory.findUnique({ where: { id } });
  },

  count() {
    return prisma.shortStory.count();
  },

  create(data: ShortStoryForm & { displayOrder: number }) {
    return prisma.shortStory.create({ data });
  },

  update(id: number, data: Partial<ShortStoryForm>) {
    return prisma.shortStory.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.shortStory.delete({ where: { id } });
  },
};
