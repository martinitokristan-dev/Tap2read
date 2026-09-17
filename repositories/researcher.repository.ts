import { prisma } from '@/lib/prisma';
import { ResearcherForm } from '@/types/form.types';

export const researcherRepository = {
  findAll() {
    return prisma.researcher.findMany({ orderBy: { displayOrder: 'asc' } });
  },

  findById(id: number) {
    return prisma.researcher.findUnique({ where: { id } });
  },

  update(id: number, data: Partial<ResearcherForm>) {
    return prisma.researcher.update({ where: { id }, data });
  },
};
