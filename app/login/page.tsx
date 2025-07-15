import { LogoAnimationLink } from "@/components/nav"

import { LoginForm } from "./form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; redirect?: string }
}) {
  return (
    <div>
      <div className="absolute top-2 left-2 ">
        <LogoAnimationLink />
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2  pt-24">
        <LoginForm redirectTo={searchParams.redirect} />

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </div>
    </div>
  )
}
