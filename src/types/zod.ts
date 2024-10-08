import z from 'zod'

export const new_task_schema = z.object({
  taskDescription: z.string(),
  dueDate: z.string().datetime(),
  completed: z.boolean(),
})
