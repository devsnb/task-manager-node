require('../src/db/mongoose')
const User = require('../src/models/user')

// 5ff346273b414023b8138570

// User.findByIdAndUpdate('5ff34be4d448d440989672d1', {
//   age: 1
// }).then(user => {
//   console.log(user)
//   return User.countDocuments({ age: 1})
// }).then((result) => {
//   console.log(result)
// }).catch(e => {
//   console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
  const users = await User.findByIdAndUpdate(id, {age})
  const userCount = await User.countDocuments({age})
  return userCount
}

updateAgeAndCount('5ff34be4d448d440989672d1', 2)
  .then(count => console.log(count))
  .catch(error => console.log(error))