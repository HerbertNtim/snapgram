import * as z from "zod"
 
export const signupValidation = z.object({
  name: z.string().min(3, { message: "Name must be at least two characters" }),
  username: z.string().min(3, { message: "Username must be at least three characters"}),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters"})
})

export const signinValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters"})
})

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 characters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});
