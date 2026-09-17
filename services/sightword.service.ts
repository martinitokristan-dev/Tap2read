import { sightWordRepository } from '@/repositories/sightword.repository';
import { MAX_SIGHT_WORDS } from '@/constants/limits';
import { SightWordForm } from '@/types/form.types';

export const sightWordService = {
  async getAll() {
    return sightWordRepository.findAll();
  },

  async getById(id: number) {
    const item = await sightWordRepository.findById(id);
    if (!item) throw new Error('Sight word not found');
    return item;
  },

  async create(data: SightWordForm) {
    const count = await sightWordRepository.count();
    if (count >= MAX_SIGHT_WORDS) {
      throw new Error(`Maximum of ${MAX_SIGHT_WORDS} sight words allowed`);
    }
    return sightWordRepository.create({ ...data, displayOrder: count + 1 });
  },

  async update(id: number, data: Partial<SightWordForm>) {
    await sightWordRepository.findById(id); // throws if not found via service
    return sightWordRepository.update(id, data);
  },

  async delete(id: number) {
    return sightWordRepository.delete(id);
  },

  async getCount() {
    return sightWordRepository.count();
  },
};
