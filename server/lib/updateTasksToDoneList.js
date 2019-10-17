// const Tasks = require('../models/tasks.model');

// const updateTasksToDoneList = () => {
//   const dateNow = new Date();

//   Tasks.updateMany(
//     {
//       isComplete: true,

//       inActive: true,
//       createdAt: {
//         $lt: new Date(new Date(dateNow).setUTCHours(23, 59, 59))
//       }
//     },
//     { $set: { isDone: true, inActive: false, isBlocked: true } },
//     { multi: true },
//     (err, result) => {
//       if (err) console.log(err);
//       console.log(result);
//     }
//   );
// };

// module.exports = updateTasksToDoneList;
