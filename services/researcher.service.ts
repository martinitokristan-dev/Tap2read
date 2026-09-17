import { researcherRepository } from '@/repositories/researcher.repository';
import { ResearcherForm } from '@/types/form.types';

export const researcherService = {
  async getAll() {
    return researcherRepository.findAll();
  },

  async getById(id: number) {
    const item = await researcherRepository.findById(id);
    if (!item) throw new Error('Researcher not found');
    return item;
  },

  // Researchers are pre-seeded — admin can only edit, not add or delete
  async update(id: number, data: Partial<ResearcherForm>) {
    return researcherRepository.update(id, data);
  },
};
