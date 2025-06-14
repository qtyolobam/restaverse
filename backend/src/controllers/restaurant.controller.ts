import { Request, Response } from "express";

import prisma from "../clients/database";
import { restaurantCreateSchema } from "../utils/validations/restaurant";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    // Input validation
    const { success, data } = restaurantCreateSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }

    // Creating the restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        ...data,
        userId: req.user!.id,
        menuItems: {
          create: data.menuItems,
        },
      },
    });

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        onboarded: true,
      },
    });

    // Returning the restaurant
    res.status(201).json({ message: "Restaurant created", restaurant });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating restaurant" });
    return;
  }
};
