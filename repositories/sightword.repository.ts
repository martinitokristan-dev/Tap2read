import { prisma } from '@/lib/prisma';
import { SightWordForm } from '@/types/form.types';

export const sightWordRepository = {
  findAll() {
    return prisma.sightWord.findMany({ orderBy: { displayOrder: 'asc' } });
  },

  findById(id: number) {
    return prisma.sightWord.findUnique({ where: { id } });
  },

  count() {
    return prisma.sightWord.count();
  },

  create(data: SightWordForm & { displayOrder: number }) {
    return prisma.sightWord.create({ data });
  },

  update(id: number, data: Partial<SightWordForm>) {
    return prisma.sightWord.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.sightWord.delete({ where: { id } });
  },
};
