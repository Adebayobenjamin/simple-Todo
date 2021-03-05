const Todo = require('../models/todo');
const jwt = require('jsonwebtoken')
module.exports.createTodo_get = (req, res)=>{
    res.render('create-todo');
}
// handle errors
const handleErrors = (err)=>{
    const errors = {task: '', details: ''};
    if(err.message.includes('todolist validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            return errors
        })
    }
    return errors
}
module.exports.createTodo_post=(req, res)=>{
    const token = req.cookies.todo;
    jwt.verify(token, 'drell secret', (err,decodedToken)=>{
        if(err){
            res.redirect('/login')
        }
        else{
            userId = decodedToken.id
            const {task, details}= req.body
            const todo = new Todo({task, details, userId});
            todo.save().then(result=>{
                res.status(201).json({redirect: '/todos'})
            }).catch(err=>{
                console.log(err.message);
                const errors = handleErrors(err);
                res.status(400).json({errors})
            })
        }
    })

}
module.exports.todos_get = (req, res)=>{
    const token = req.cookies.todo;
    jwt.verify(token, 'drell secret', (err, decodedToken)=>{
        if(err){
            console.log(err)
        }else{
            Todo.find({userId: decodedToken.id}).then(result=>{
                res.render('todos', { todos: result})
            }).
            catch(err=> console.log(err.message))
        }
    })
   
   
}
module.exports.todo_get = (req, res)=>{
    const id = req.params.id
    Todo.findById(id).then(result=>{
        res.status(200).render('todo', {todo: result})
    }).
    catch(err=>{console.log(err)})
}
module.exports.todo_delete = (req, res)=>{
    const id = req.params.id
    Todo.findByIdAndDelete(id).then(result=>{
        res.status(201).json({redirect: '/todos'})
        
    })
    .catch(err=>{
        res.status(400).json({redirect:'/todos', err})
       
    })
};
module.exports.update_todo_get = (req, res)=>{
   
   const id = req.params.id;
    Todo.findById(id).then(result=>{
        res.render('update',{todo: result});
    })
    .catch(err=> console.log(err.message))
}
module.exports.update_todo_put = (req, res) =>{
   const id = req.params.id;
   Todo.findByIdAndUpdate(id, req.body).then(result=>{
       res.status(201).json({redirect:`/todo${id}`})
   })
   .catch(err=>{
       res.status(400).json({redirect:`/todo${id}`})
       console.log(err.message)
   })
}