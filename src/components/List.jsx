import React from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { AddNote } from "../components/AddTodo";
import { usePocket } from "../contexts/PocketContext";

export const List = () => {
  const { pb } = usePocket();

  const { data, isLoading, mutate } = useSWR(
    "/getTodos",
    async () => await pb.collection("todos").getFullList()
  );

  const { trigger } = useSWRMutation(
    "/deleteTodo",
    async (_, { arg }) => await pb.collection("todos").delete(arg),
    {
      onSuccess: async () => await mutate(),
    }
  );

  return (
    <section>
      <hr />
      <AddNote />
      <hr />

      <h2>List of Todos</h2>
      {isLoading && <p>Loading...</p>}

      <ul>
        {data?.map((todo) => (
          <li key={todo.id} onClick={() => trigger(todo.id)}>
            {todo.title}
          </li>
        ))}
      </ul>
    </section>
  );
};
