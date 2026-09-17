import { prisma } from '@/lib/prisma';
import { VideoForm } from '@/types/form.types';

export const videoRepository = {
  findAll() {
    return prisma.video.findMany({ orderBy: { displayOrder: 'asc' } });
  },

  findById(id: number) {
    return prisma.video.findUnique({ where: { id } });
  },

  count() {
    return prisma.video.count();
  },

  create(data: VideoForm & { displayOrder: number }) {
    return prisma.video.create({ data });
  },

  update(id: number, data: Partial<VideoForm>) {
    return prisma.video.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.video.delete({ where: { id } });
  },
};
