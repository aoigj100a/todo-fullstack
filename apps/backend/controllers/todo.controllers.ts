import { Request, Response } from "express";

export const getTodos = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Get Todos" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    res.json({ message: "Create Todo" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
