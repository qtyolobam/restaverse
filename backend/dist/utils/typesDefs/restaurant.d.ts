import z from "zod";
import { restaurantCreateSchema } from "../validations/restaurant";
export type RestaurantCreateBody = z.infer<typeof restaurantCreateSchema>;
