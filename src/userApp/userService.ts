import { IError, IOkWithData } from "../types/types";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/token";
import userRepository from "./userRepository";
import { CreateUser, User } from "./types";

async function getUserById(id: number): Promise<IOkWithData<User> | IError> {
  try {
    const user = await userRepository.getUserById(id);

    if (!user) {
      return { status: "error", message: "User not found" };
    }

    return { status: "success", data: user };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "Internal server error" };
  }
}

async function login(email: string, password: string): Promise<IOkWithData<string> | IError> {
    try {
      const user = await userRepository.findUserByEmail(email);
  
      if (!user) {
        return { status: "error", message: "User not found" };
      }
      if (typeof user === "string") {
        return { status: "error", message: user };
      }
  
      const isMatch = await compare(password, user.password);
  
      if (!isMatch) {
        return { status: "error", message: "Passwords didn`t match" };
      }
  
      const token = sign({id: user.id}, SECRET_KEY, { expiresIn: "7d" });
  
      return { status: "success", data: token };
    } catch (err) {
      if (err instanceof Error) {
        return { status: "error", message: err.message};
      }
      return { status: "error", message: "Internal server error" };
    }
  }
  
  async function registration(userData: CreateUser): Promise<IOkWithData<string> | IError> {
    try {
  
      const user = await userRepository.findUserByEmail(userData.email);
  
      if (user) {
        return { status: "error", message: "User already exists" };
      }
  
      const hashedPassword = await hash(userData.password, 10);
  
      const hashedUserData = {
        ...userData,
        password: hashedPassword,
      };
  
      const newUser = await userRepository.createUser(hashedUserData);
  
      if (!newUser) {
        return { status: "error", message: "User is not created" };
      }
  
      const token = sign({id: newUser.id}, SECRET_KEY, { expiresIn: "1d" });
  
      return { status: "success", data: token };
    } catch (err) {
      if (err instanceof Error) {
        return { status: "error", message: err.message };
      }
      return { status: "error", message: "An unknown error occurred" };
    }
  }
  
  const userService = {
    login,
    registration,
    getUserById
  };
  
  export default userService;