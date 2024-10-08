import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { id_schema, new_task_schema, sort_by_schema, string_boolean_schema, task_schema } from './types/zod'
import { TasksTable } from './db/schema'
import { db } from './db/db'
import { fromZodError } from 'zod-validation-error'
import { asc, desc, eq } from 'drizzle-orm'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/tasks', async (req: Request, res: Response) => {
  const { completed: completedString, sort_by: sortByString } = req.query
  const stringBooleanObject = string_boolean_schema.safeParse(String(completedString).toLowerCase())
  const sortByObject = sort_by_schema.safeParse(sortByString)

  if (stringBooleanObject.success !== true) {
    res.status(400).send({ message: fromZodError(stringBooleanObject.error).message })
  } else if (sortByObject.success !== true) {
    res.status(400).send({ message: fromZodError(sortByObject.error).message })
  } else {
    const sortBy = sortByObject.data
    const completed = String(stringBooleanObject.data).toLowerCase() === 'true'
    if (sortBy) {
      if (sortBy === '+createdDate') {
        const tasks = await db
          .select()
          .from(TasksTable)
          .where(eq(TasksTable.completed, completed))
          .orderBy(asc(TasksTable.createdDate))
        res.status(200).send(tasks)
      } else if (sortBy === '-createdDate') {
        const tasks = await db
          .select()
          .from(TasksTable)
          .where(eq(TasksTable.completed, completed))
          .orderBy(desc(TasksTable.createdDate))
        res.status(200).send(tasks)
      } else if (sortBy === '+dueDate') {
        const tasks = await db
          .select()
          .from(TasksTable)
          .where(eq(TasksTable.completed, completed))
          .orderBy(asc(TasksTable.dueDate))
        res.status(200).send(tasks)
      } else if (sortBy === '-dueDate') {
        const tasks = await db
          .select()
          .from(TasksTable)
          .where(eq(TasksTable.completed, completed))
          .orderBy(desc(TasksTable.dueDate))
        res.status(200).send(tasks)
      }
    } else {
      const tasks = await db.select().from(TasksTable).where(eq(TasksTable.completed, completed))
      res.status(200).send(tasks)
    }
  }
})

app.get('/tasks/:id', async (req: Request, res: Response) => {
  const idObject = id_schema.safeParse(req.params.id)

  if (idObject.success) {
    const { data: id } = idObject
    const [task] = await db.select().from(TasksTable).where(eq(TasksTable.id, id))
    if (task) {
      res.status(200).send(task)
    } else {
      res.status(400).send({ message: 'Task Not Found' })
    }
  } else {
    res.status(400).send({ message: fromZodError(idObject.error).message })
  }
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
      res.status(200).send(createdTask)
    } else {
      res.status(400).send({ message: 'Task Not Found' })
    }
  }
})

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const idObject = id_schema.safeParse(req.params.id)

  if (idObject.success) {
    const { data: id } = idObject
    await db.delete(TasksTable).where(eq(TasksTable.id, id))
    res.status(200).send()
  } else {
    res.status(400).send({ message: fromZodError(idObject.error).message })
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
