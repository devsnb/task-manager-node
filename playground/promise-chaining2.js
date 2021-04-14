require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findOneAndDelete({_id: '5ff499efc76e6509f8e733d1'}).then((task) => {
//   console.log(task)
//   return Task.countDocuments({ completed: false })
// }).then(tasks => {
//   console.log(tasks)
// }).catch(err => {
//   console.log(err)
// })

const deleteTaskAndCount = async (id,) => {
  const tasks = await Task.findOneAndDelete({ _id: id })
  const taskCount = await Task.countDocuments({ completed: false })
  return taskCount
}

deleteTaskAndCount('5ff49a14c76e6509f8e733d3')
  .then(count => console.log(count))
  .catch(e => console.log(e))