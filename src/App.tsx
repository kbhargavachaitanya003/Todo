import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoForm from './Components/TodoForm';
import TodoList from './Components/TodoList';

function App() {
  return (
    <div className="App">
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
