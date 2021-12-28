import { POST } from './rest'

const updateUserTaskProgress = async (payload): Promise<any> =>
  await POST('userTasksProgress-updateUserTask', payload)

export const UserTasksProgressApi = {
  updateUserTaskProgress
}
