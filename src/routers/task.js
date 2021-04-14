const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { query } = require('express')
const router = new express.Router()

// Tasks creation endpoint
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Tasks reading endpoints
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  if(req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({_id, owner: req.user._id})

    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send()
  }
})

// Tasks updating endpoint
router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const body = req.body

  const updates = Object.keys(body)
  const allowedUpdates = ["description", "completed"]

  const isValidOperation = updates.every((update) => {
     return allowedUpdates.includes(update)
  })

  const options = {
    new: true,
    runValidators: true
  }

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates'}) 
  }

  try {
    const task = await Task.findOne({_id, owner: req.user._id})

    if(!task) {
      res.status(404).send()
    }

    updates.forEach(update => task[update] = body[update])
    await task.save()

    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOneAndDelete({_id, owner: req.user._id})
    
    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router