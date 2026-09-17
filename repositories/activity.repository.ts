import { prisma } from '@/lib/prisma';
import { ActivityForm } from '@/types/form.types';

export const activityRepository = {
  findAll() {
    return prisma.activity.findMany({ orderBy: { displayOrder: 'asc' } });
  },

  findById(id: number) {
    return prisma.activity.findUnique({ where: { id } });
  },

  count() {
    return prisma.activity.count();
  },

  create(data: ActivityForm & { displayOrder: number }) {
    return prisma.activity.create({ data });
  },

  update(id: number, data: Partial<ActivityForm>) {
    return prisma.activity.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.activity.delete({ where: { id } });
  },
};
