"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/error-handler";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schemas/auth";
import { toast } from "sonner";
import { registerAsync } from "@/action/auth";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      await registerAsync({
        email: data.email,
        password: data.password,
        names: `${data.firstName} ${data.lastName}`,
      });
      toast.success("Registration successful");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Sign Up</CardTitle>
        <CardDescription>Enter your details below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='firstName'>First Name</FormLabel>
                    <FormControl>
                      <Input id='firstName' {...field} />
                    </FormControl>
                    {errors.firstName && <FormMessage>{errors.firstName.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                    <FormControl>
                      <Input id='lastName' {...field} />
                    </FormControl>
                    {errors.lastName && <FormMessage>{errors.lastName.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input id='email' type='email' placeholder='m@example.com' {...field} />
                    </FormControl>
                    {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormControl>
                      <Input id='password' type='password' {...field} />
                    </FormControl>
                    {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          Already have an account?{" "}
          <Link href='login' className='underline'>
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
