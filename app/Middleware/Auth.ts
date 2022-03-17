import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
const jwt = require("jsonwebtoken");

export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const token = request.header("Authorization");
      if (!token) {
        return response.status(400).json({ msg: "Invalid Athentication" });
      }
      jwt.verify(token, "123456789", async (err, user) => {
        if (err) {
          return response.status(400).json({ msg: "Invalid Athentication" });
        }
        request.id = user;
      });
    } catch (error) {
      return response.status(500).json({ msg: error.message });
    }
    await next();
  }
}
