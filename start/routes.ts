import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/register", "AuthController.signup");
  Route.post("/login", "AuthController.login");

  Route.group(() => {
    Route.post("/todos", "TodosController.index").middleware("auth");
    Route.put("/todo/:id", "TodosController.update")
      .middleware("auth")
      .middleware("authAdmin");
    Route.delete("/todo/:id", "TodosController.destroy")
      .middleware("auth")
      .middleware("authAdmin");
    Route.get("/todo/:id", "TodosController.show").middleware("auth");
    Route.post("/todo", "TodosController.store")
      .middleware("auth")
      .middleware("authAdmin");
  });
}).prefix("api");
