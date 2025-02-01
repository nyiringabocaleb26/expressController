import {
  Get,
  JsonController,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "routing-controllers";
import mongoose, { Schema, model, Document } from "mongoose";

// MongoDB Connection
const uri = "mongodb://localhost:27017/mydb"; 
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// User Schema
interface UserInterface extends Document {
  name: string;
  age: number;
}

const userSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const User = model<UserInterface>("data1", userSchema);

@JsonController("/users")
export class UserController {
  // GET /users
  @Get("/")
   async getAll() {
    try {
      const users = await User.find();
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
  async getOne(@Param("id") id: string) {
    try {
      const user = await User.findById(id);
      console.log("Fetched user by ID:", id, user);
      if (user) {
        return { message: "User fetched successfully", user };
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
  async insert(@Body() body: UserInterface) {
    const { name, age } = body;
    try {
      const user = new User({ name, age });
      const savedUser = await user.save();
      console.log("Inserted user:", savedUser);
      return { message: "User added successfully", userId: savedUser._id };
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
  async modify(
    @Param("id") id: string,
    @Body() body: { name: string; age: number }
  ) 
  {
    const { name, age } = body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, age },
        { new: true, runValidators: true }
      );
      console.log("Modified user:", updatedUser);
      if (!updatedUser) {
        return { message: "User not found" };
      }
      return { message: "User modified successfully", user: updatedUser };
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
  async delete(@Param("id") id: string) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      console.log("Deleted user by ID:", id, deletedUser);
      if (!deletedUser) {
        return { message: "User not found" };
      }
      return { message: "User deleted successfully",deletedUser: deletedUser };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        message: "Error deleting user",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
