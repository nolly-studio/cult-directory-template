import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase/server"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ResetPassword } from "./reset-password"
import { SubmitButton } from "./submit-button"

export function LoginForm() {
  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return redirect("/login?message=Could not authenticate user")
    return redirect("/submit")
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })
    if (error) return redirect("/login?message=Error signing up")
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (err) return redirect("/login?message=Could not authenticate user")
    return redirect("/submit")
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"

    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`,
    })
    if (error) return redirect(`/login?message=${error.message}`)
    return redirect("/login?message=Check email to reset password")
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2  ">
      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="mx-auto w-[20rem] md:w-[24rem]">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your information below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    required
                    name="password"
                    placeholder="••••••••"
                  />
                </div>

                <SubmitButton
                  formAction={signIn}
                  className="button-secondary rounded-md px-4 py-2 text-foreground mb-2"
                  pendingText="Signing In..."
                >
                  Login
                </SubmitButton>
              </form>
            </CardContent>
            <CardFooter>
              <ResetPassword handleResetPassword={handleResetPassword} />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="mx-auto w-[20rem] md:w-[24rem]">
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information below to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"> */}
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    required
                    name="password"
                    placeholder="••••••••"
                  />
                </div>

                <SubmitButton
                  formAction={signUp}
                  className="button-secondary rounded-md px-4 py-2 text-foreground mb-2"
                  pendingText="Signing Up..."
                >
                  Sign Up
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
