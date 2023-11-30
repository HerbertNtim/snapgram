import { signupValidation } from "@/lib/validations"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import { createUserAccount } from "@/lib/appwrite/api"

const SignupForm = () => {
  const { toast } = useToast()
  const isLoading = false

  // 1. Define your form.
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    const newUser = await createUserAccount(values) 
    if(!newUser) {
      toast({
        title: 'Sign Up failed. Kindly try again'
      })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col ">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>

        <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram, please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="shad-input" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="shad-button_primary mt-4 w-full">
            { isLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Sign Up"
              )
            }
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm