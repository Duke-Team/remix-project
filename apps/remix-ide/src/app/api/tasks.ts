import { POST } from './rest'

const getTask = async (taskId: string, userId?: string): Promise<any> =>
  await POST('tasks-getTask', { userId, taskId })

export const TasksApi = {
  getTask
}
