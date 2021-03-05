const {Router} = require('express');
const todoController = require('../controller/todocontroller');
const router = Router();

router.get('/create-todo', todoController.createTodo_get);
router.post('/create-todo', todoController.createTodo_post);
router.get('/todos', todoController.todos_get)
router.get('/todo:id', todoController.todo_get)
router.delete('/todo:id', todoController.todo_delete);
router.get('/update:id', todoController.update_todo_get);
router.put('/update:id', todoController.update_todo_put);
module.exports = router;