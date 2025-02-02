import {z} from "zod";

export const SendMessageValidator = z.object({
    fileId : z.string(),
    message: z.string().min(1, "Message is required"),
})