import { shortStoryRepository } from '@/repositories/shortstory.repository';
import { MAX_SHORT_STORIES } from '@/constants/limits';
import { ShortStoryForm } from '@/types/form.types';

export const shortStoryService = {
  async getAll() {
    return shortStoryRepository.findAll();
  },

  async getById(id: number) {
    const item = await shortStoryRepository.findById(id);
    if (!item) throw new Error('Short story not found');
    return item;
  },

  async create(data: ShortStoryForm) {
    const count = await shortStoryRepository.count();
    if (count >= MAX_SHORT_STORIES) {
      throw new Error(`Maximum of ${MAX_SHORT_STORIES} short stories allowed`);
    }
    return shortStoryRepository.create({ ...data, displayOrder: count + 1 });
  },

  async update(id: number, data: Partial<ShortStoryForm>) {
    return shortStoryRepository.update(id, data);
  },

  async delete(id: number) {
    return shortStoryRepository.delete(id);
  },

  async getCount() {
    return shortStoryRepository.count();
  },
};
