import React, { useCallback, useRef } from "react";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";

import { usePocket } from "../contexts/PocketContext";

export const AddNote = () => {
  const todoRef = useRef();
  const { pb, user } = usePocket();
  const { cache, mutate } = useSWRConfig();

  const { trigger } = useSWRMutation(
    "/addTodo",
    async (_, { arg }) => await pb.collection("todos").create(arg),
    {
      onSuccess: async (todo) => {
        const cachedTodos = cache.get("/getTodos")?.data ?? [];
        await mutate("/getTodos", [...cachedTodos, todo], {
          rollbackOnError: true,
          revalidate: false,
        });
      },
    }
  );

  const onSubmitHandler = useCallback(async (evt) => {
    evt?.preventDefault();
    await trigger({ title: todoRef.current.value, user: user.id });
    todoRef.current.value = "";
  }, []);

  return (
    <div>
      <h2>New Todo Form</h2>
      <form onSubmit={onSubmitHandler}>
        <input placeholder="Todo..." type="text" ref={todoRef} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};
