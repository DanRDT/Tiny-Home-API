import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { new_task_schema } from './types/zod'
import { TasksTable } from './db/schema'
import { db } from './db/db'
import { fromZodError } from 'zod-validation-error'

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

app.put('/tasks/:id', (req: Request, res: Response) => {
  res.status(200).send('')
})

app.delete('/tasks/:id', (req: Request, res: Response) => {
  res.status(200).send('')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
