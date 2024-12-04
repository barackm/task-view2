"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import useAuthMutations from "~/hooks/use-auth-mutations";
import { getErrorMessage } from "~/utils/error-handler";
import { useForm } from "react-hook-form";
import { loginSchema } from "~/schemas/auth";
import { updateAuthToken } from "~/utils/auth";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const { loginMutation } = useAuthMutations();
  const { mutateAsync: login, isPending } = loginMutation;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await login(data);
      updateAuthToken(res.access_token);
      reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log(errorMessage);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    {errors.email && (
                      <FormMessage>{errors.email.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    {errors.password && (
                      <FormMessage>{errors.password.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                loading={isPending}
                disabled={isPending}
              >
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
