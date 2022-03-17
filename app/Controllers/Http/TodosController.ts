// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Todo from "App/Models/Todo";
import Database from "@ioc:Adonis/Lucid/Database";

export default class TodosController {
  // show list
  public async index({ response, request }) {
    const page = request.input("page", 1);
    const limit = request.input("limit", 10);
    const todos = await Database.from("todos").paginate(page, limit);

    todos.baseUrl("/todos");
    return response.ok(todos);
  }

  // create todo
  public async store({ request, response }) {
    const todoSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
    });

    const payload: any = await request.validate({ schema: todoSchema });
    const todo: Todo = await Todo.create(payload);

    return response.ok(todo);
  }

  // show by id
  public async show({ params, response }) {
    const { id }: { id: Number } = params;

    const todo: any = await Todo.find(id);
    if (!todo) {
      return response.notFound({ message: "Todo not found" });
    }

    return response.ok(todo);
  }

  // update by id
  public async update({ request, params, response }) {
    const todoSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
    });

    const payload: any = await request.validate({ schema: todoSchema });

    const { id }: { id: Number } = params;

    const todo: any = await Todo.find(id);
    if (!todo) {
      return response.notFound({ message: "Todo not found" });
    }

    todo.name = payload.name;

    await todo.save();

    return response.ok(todo);
  }

  // delete by id
  public async destroy({ params, response }) {
    const { id }: { id: Number } = params;

    const todo: any = await Todo.find(id);
    if (!todo) {
      return response.notFound({ message: "Todo not found" });
    }

    await todo.delete();

    return response.ok({ message: "Todo deleted successfully." });
  }
}
