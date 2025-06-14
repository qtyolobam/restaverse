import z from "zod";
export declare const jobSchema: z.ZodObject<{
    command: z.ZodEnum<["start", "stop", "destroy"]>;
}, "strip", z.ZodTypeAny, {
    command: "start" | "stop" | "destroy";
}, {
    command: "start" | "stop" | "destroy";
}>;
