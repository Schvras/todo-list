const express = require('express');

const router = express.Router();

const tasksController = require('./controllers/tasksController');
const tasksMiddleware = require('./middlewares/tasksMiddleware');

router.get("/tasks",tasksController.getAll);

router.post("/tasks", 
    tasksMiddleware.validateFieldTitle,
    tasksMiddleware.validateFieldDescription,
    tasksController.createTask);

router.put("/tasks/:id", 
    tasksMiddleware.validateFieldTitle,
    tasksMiddleware.validateFieldDescription,
    tasksMiddleware.validateFieldStatus,
    tasksController.updateTask);
    
router.delete("/tasks/:id",tasksController.deleteTask);

module.exports = router;