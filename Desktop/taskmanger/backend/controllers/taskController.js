const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    user: req.user.id
  });

  res.status(201).json(task);
});


const getTasks = asyncHandler(async (req, res) => {
  const { sort } = req.query;
  let sortOption = { dueDate: 1 }; 
  if (sort === 'priority') {
    sortOption = { priority: 1 };
  }

  const tasks = await Task.find({ user: req.user.id }).sort(sortOption);
  res.json(tasks);
});


const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});


const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { title, description, dueDate, priority, status } = req.body;

  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.priority = priority || task.priority;
  task.status = status || task.status;

  const updatedTask = await task.save();
  res.json(updatedTask);
});


const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();  

  res.json({ message: 'Task removed' });
});


const getTaskDistribution = asyncHandler(async (req, res) => {
  try {
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const taskDistribution = await Task.aggregate([
      {
        $match: { 
          user: mongoose.Types.ObjectId(req.user.id),
          priority: { $exists: true, $ne: null } 
        }
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          priority: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    const priorities = ["High", "Medium", "Low"];
    const result = priorities.map(p => {
      const found = taskDistribution.find(item => item.priority === p);
      return found || { priority: p, count: 0 };
    });

    console.log("Final Distribution:", result);
    res.json(result);

  } catch (error) {
    console.error("Error in aggregation:", error);
    res.status(500).json({ message: "Server error" });
  }
});


const getCompletionRate = asyncHandler(async (req, res) => {
  const completionRate = await Task.aggregate([
    {
      $match: { user: req.user.id }
    },
    {
      $group: {
        _id: {
          month: { $month: "$dueDate" },  
          year: { $year: "$dueDate" }
        },
        completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
        total: { $sum: 1 }
      }
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        completionRate: { $divide: ["$completed", "$total"] },
        _id: 0
      }
    },
    {
      $sort: { year: 1, month: 1 }
    }
  ]);
  res.json(completionRate);
});


const getUpcomingDeadlines = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5; 
  
  const upcomingTasks = await Task.find({
    user: req.user.id,
    dueDate: { $gte: new Date() },
    status: { $ne: 'Completed' } 
  })
  .sort({ dueDate: 1 })
  .limit(limit);

  res.json(upcomingTasks);
});


module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskDistribution,
  getCompletionRate,
  getUpcomingDeadlines
};
