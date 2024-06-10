import React from 'react'
import { useTodos } from './useTodos'
import { Todo } from './types'
import axios from 'axios'
import { List, ListItem, Checkbox, ListItemText, Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const TodoList = () => {
    const { data, isLoading, error} = useTodos();
    const queryClient = useQueryClient();

    const deleteTodo = async (todoId: number) => {
        try{
            await axios.delete(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
            return todoId;
        } catch (error) {
            console.error('An error occurred while deleting the todo:', error);
            throw error;
        }
    }

    const updateTodo = async (todo: Todo) => {
        try {
          const updatedTodo = { ...todo, completed: !todo.completed };
          await axios.put(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, updatedTodo);
          return updatedTodo;
        } catch (error) {
          console.error('An error occurred while updating the todo:', error);
          throw error;
        }
    };
      
    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: (_, todoId) => {
            queryClient.setQueryData<Todo[]>(['todos'], (oldTodos) =>
              oldTodos ? oldTodos.filter((todo) => todo.id !== todoId) : []
            );
          },
        
    })

    const updateMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: (updatedTodo) => {
            queryClient.setQueryData<Todo[]>(['todos'], (oldTodos) =>
              oldTodos ? oldTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)) : []
            );
        },
    })

    const handleDelete = (id:number) => {
        deleteMutation.mutate(id);
    }

    const handleUpdate = (todo: Todo) => {
        updateMutation.mutate(todo);
    }

    if(isLoading) return <div>Loading...</div>

    if(error) return <div>Error in loading Todos</div>

  return (
    <List>
        {data?.map((todo: Todo)=>{
            return (
                <ListItem key={todo.id}>
                <Checkbox 
                    checked={todo.completed}
                    onClick={()=> handleUpdate(todo)}
                />
                <ListItemText primary={todo.title}/>
                <Button onClick={() => handleDelete(todo.id)}>Delete</Button>
                </ListItem>
            );
        })}
    </List>
  )
}

export default TodoList
