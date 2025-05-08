const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskDistribution,
  getCompletionRate,
  getUpcomingDeadlines
} = require('../controllers/taskController');

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/analytics')
  .get(protect, getTaskDistribution);

router.route('/completionRate')
  .get(protect, getCompletionRate);

router.route('/upcomingDeadlines')
  .get(protect, getUpcomingDeadlines);

module.exports = router;
