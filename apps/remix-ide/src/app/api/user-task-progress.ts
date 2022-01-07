import { POST } from './rest'

const updateUserTaskProgress = async (payload): Promise<any> =>
  await POST('userTasksProgress-updateUserTask', payload)

const updateUserTaskStructure = async (payload): Promise<any> =>
  await POST('userTasksProgress-updateUserTaskStructure', payload)

export const UserTasksProgressApi = {
  updateUserTaskProgress,
  updateUserTaskStructure
}
