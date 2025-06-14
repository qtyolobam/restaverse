import z from "zod";
export declare const restaurantCreateSchema: z.ZodObject<{
    name: z.ZodString;
    pincode: z.ZodString;
    menuItems: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        price: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        price: string;
    }, {
        name: string;
        price: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    pincode: string;
    menuItems: {
        name: string;
        price: string;
    }[];
}, {
    name: string;
    pincode: string;
    menuItems: {
        name: string;
        price: string;
    }[];
}>;
