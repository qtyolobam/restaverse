import z from "zod";
export declare const authGoogleSchema: z.ZodObject<{
    credential: z.ZodString;
}, "strip", z.ZodTypeAny, {
    credential: string;
}, {
    credential: string;
}>;
