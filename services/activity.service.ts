import { activityRepository } from '@/repositories/activity.repository';
import { MAX_ACTIVITIES } from '@/constants/limits';
import { ActivityForm } from '@/types/form.types';

export const activityService = {
  async getAll() {
    return activityRepository.findAll();
  },

  async getById(id: number) {
    const item = await activityRepository.findById(id);
    if (!item) throw new Error('Activity not found');
    return item;
  },

  async create(data: ActivityForm) {
    const count = await activityRepository.count();
    if (count >= MAX_ACTIVITIES) {
      throw new Error(`Maximum of ${MAX_ACTIVITIES} activities allowed`);
    }
    return activityRepository.create({ ...data, displayOrder: count + 1 });
  },

  async update(id: number, data: Partial<ActivityForm>) {
    return activityRepository.update(id, data);
  },

  async delete(id: number) {
    return activityRepository.delete(id);
  },

  async getCount() {
    return activityRepository.count();
  },
};
