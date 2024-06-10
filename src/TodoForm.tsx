import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import './TodoForm.css'
import axios from 'axios'
import { Todo } from './types'

interface TodoFormInput {
    title: string;
}

const TodoForm = () => {
    const { register, handleSubmit, formState, reset } = useForm<TodoFormInput>();
    const { errors } = formState;
    const queryClient = useQueryClient();

    const addTodo = async (newTodo: TodoFormInput) => {
        try{
            const {data} = await axios.post('https://jsonplaceholder.typicode.com/todos', {
                ...newTodo,
                userId: 1,
                completed: false,
            });
            return data;
        } catch (error) {
            console.error('An error occurred while adding a todo', error);
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: addTodo,
        onSuccess: (newTodo) => {
            queryClient.setQueryData<Todo[]>(['todos'], (oldTodos) => {
                return oldTodos ? [...oldTodos, newTodo] : [newTodo];
            });
            reset();
        },
    });
    
    const onSubmit: SubmitHandler<TodoFormInput> = (data) => {
        mutation.mutate({title: data.title});
    }
  return (
    <div className="todo-form">
        <form onSubmit={handleSubmit(onSubmit)} >
        <TextField
            id="outlined-basic"
            label={errors.title?.message || 'New Todo'}
            variant="outlined"
            {...register('title', { required: {
                value: true,
                message: "Please Enter a Todo"}})}
            error={!!errors.title}
        />
        <Button type="submit" variant="contained">Add Todo</Button>
    </form>
    </div>
  )
}

export default TodoForm
