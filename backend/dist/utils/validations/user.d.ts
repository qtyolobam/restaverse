import z from "zod";
export declare const userScrapeSchema: z.ZodObject<{
    pincode: z.ZodString;
    limit: z.ZodNumber;
    cuisines: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    pincode: string;
    cuisines: string[];
    limit: number;
}, {
    pincode: string;
    cuisines: string[];
    limit: number;
}>;
