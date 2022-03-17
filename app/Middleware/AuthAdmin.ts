import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthAdmin {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const admin = await User.query()
        .select()
        .where("email", request.id.id)
        .where("isAdmin", true);

      if (admin.length === 0) {
        return response
          .status(400)
          .json({ msg: "Admin Recources Access Denied" });
      }
      await next();
    } catch (error) {
      return response.status(500).json({ msg: error.message });
    }
  }
}
