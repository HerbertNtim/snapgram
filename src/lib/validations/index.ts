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