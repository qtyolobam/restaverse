import z from "zod";
export declare const scrapeSchema: z.ZodObject<{
    userId: z.ZodString;
    pincode: z.ZodString;
    limit: z.ZodNumber;
    cuisines: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    userId: string;
    pincode: string;
    limit: number;
    cuisines: string[];
}, {
    userId: string;
    pincode: string;
    limit: number;
    cuisines: string[];
}>;
