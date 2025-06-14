import z from "zod";

export const restaurantCreateSchema = z.object({
  name: z.string().min(1),
  pincode: z.string().min(1),
  menuItems: z.array(
    z.object({
      name: z.string().min(1),
      price: z.string().min(1),
    })
  ),
});
