import {
  Get,
  JsonController,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "routing-controllers";
import { pool } from "../models/db"; // Import MySQL pool connection


@JsonController("/users")
export class UserController {
  // GET /users
  @Get("/")
  async getAll() {
    try {
      const [users]: any = await pool.query("SELECT * FROM users");
      console.log("Fetched users:", users);
      return { message: "Users fetched successfully", users };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        message: "Error fetching users",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // GET /users/:id
  @Get("/:id")
  async getOne(@Param("id") id: number) {
    try {
      const [users]: any = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      console.log("Fetched user by ID:", id, users);
      if (Array.isArray(users) && users.length > 0) {
        return { message: "User fetched successfully", user: users[0] };
      } else {
        return { message: "User not found" };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        message: "Error fetching user",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // POST /users
  @Post("/insert")
  async insert(@Body() body: { name: string; age: number }) {
    const { name, age } = body;

    // Validate 'name' field
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return { message: "Invalid or missing 'name' field" };
    }

    // Validate 'age' field
    if (typeof age !== "number" || age <= 0) {
      return { message: "Invalid or missing 'age' field" };
    }

    try {
      const [result]: any = await pool.query(
        "INSERT INTO users (name, age) VALUES (?, ?)",
        [name, age]
      );
      console.log("Inserted user:", { name, age, insertId: result.insertId });
      return {
        message: "User added successfully",
        userId: result.insertId,
      };
    } catch (error) {
      console.error("Error adding user:", error);
      return {
        message: "Error adding user",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // PUT /users/:id
  @Put("/modify/:id")
  async modify(@Param("id") id: number, @Body() body: { name: string; age: number }) {
    const { name, age } = body;

    // Validate 'name' and 'age' fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return { message: "Invalid or missing 'name' field" };
    }

    if (typeof age !== "number" || age <= 0) {
      return { message: "Invalid or missing 'age' field" };
    }

    try {
      const [result]: any = await pool.query(
        "UPDATE users SET name = ?, age = ? WHERE id = ?",
        [name, age, id]
      );
      console.log("Modified user:", { id, name, age, affectedRows: result.affectedRows });
      if (result.affectedRows === 0) {
        return { message: "User not found" };
      }
      return { message: "User modified successfully" };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        message: "Error updating user",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // DELETE /users/:id
  @Delete("/delete/:id")
  async delete(@Param("id") id: number) {
    try {
      const [result]: any = await pool.query("DELETE FROM users WHERE id = ?", [id]);
      console.log("Deleted user by ID:", { id, affectedRows: result.affectedRows });
      if (result.affectedRows === 0) {
        return { message: "User not found" };
      }
      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        message: "Error deleting user",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
