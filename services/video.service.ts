import { videoRepository } from '@/repositories/video.repository';
import { MAX_VIDEOS } from '@/constants/limits';
import { VideoForm } from '@/types/form.types';

export const videoService = {
  async getAll() {
    return videoRepository.findAll();
  },

  async getById(id: number) {
    const item = await videoRepository.findById(id);
    if (!item) throw new Error('Video not found');
    return item;
  },

  async create(data: VideoForm) {
    const count = await videoRepository.count();
    if (count >= MAX_VIDEOS) {
      throw new Error(`Maximum of ${MAX_VIDEOS} videos allowed`);
    }
    return videoRepository.create({ ...data, displayOrder: count + 1 });
  },

  async update(id: number, data: Partial<VideoForm>) {
    return videoRepository.update(id, data);
  },

  async delete(id: number) {
    return videoRepository.delete(id);
  },

  async getCount() {
    return videoRepository.count();
  },
};
