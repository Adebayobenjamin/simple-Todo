const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    task: {
        type: String,
        required: [true, 'please enter a task']
    },
    details:{
        type: String,
        required: [true, 'please enter your details']
    },
    userId:{
        type: String,
        required: [true, "A serious error has occured please try to login again"]
    }
}, {timestamps: true});

const Todo = mongoose.model('todolist', TodoSchema);
module.exports = Todo;