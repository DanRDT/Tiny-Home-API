import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { id_schema, new_task_schema, task_schema } from './types/zod'
import { TasksTable } from './db/schema'
import { db } from './db/db'
import { fromZodError } from 'zod-validation-error'
import { eq } from 'drizzle-orm'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).send({})
})

app.get('/tasks/:id', (req: Request, res: Response) => {
  res.status(200).send('')
})

app.post('/tasks', async (req: Request, res: Response) => {
  const newTaskObject = new_task_schema.safeParse(req.body)
  if (newTaskObject.success) {
    const { data: newTask } = newTaskObject
    const [createdTask] = await db.insert(TasksTable).values(newTask).returning()
    res.status(201).send(createdTask)
  } else {
    res.status(400).send({ message: fromZodError(newTaskObject.error).message })
  }
})

app.put('/tasks/:id', async (req: Request, res: Response) => {
  const idObject = id_schema.safeParse(req.params.id)
  const updatedTaskObject = task_schema.safeParse(req.body)

  if (idObject.success !== true) {
    res.status(400).send({ message: fromZodError(idObject.error).message })
  } else if (updatedTaskObject.success !== true) {
    res.status(400).send({ message: fromZodError(updatedTaskObject.error).message })
  } else if (idObject.data !== updatedTaskObject.data.id) {
    res.status(400).send({ message: "Id's don't match." })
  } else {
    const { data: updatedTask } = updatedTaskObject
    const [createdTask] = await db
      .update(TasksTable)
      .set({ taskDescription: updatedTask.taskDescription, dueDate: updatedTask.dueDate, completed: updatedTask.completed })
      .where(eq(TasksTable.id, updatedTask.id))
      .returning()
    if (createdTask) {
      res.status(201).send(createdTask)
    } else {
      res.status(400).send({ message: 'Task Not Found' })
    }
  }
})

app.delete('/tasks/:id', (req: Request, res: Response) => {
  res.status(200).send('')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
