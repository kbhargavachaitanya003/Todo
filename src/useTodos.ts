import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Todo } from "./types";

const fetchTodos = async (): Promise<Todo[]> => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
    return data;
};

export const useTodos = () => {
    return useQuery({
        queryKey: ['todos'], 
        queryFn: fetchTodos,
    });
};
