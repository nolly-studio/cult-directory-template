import { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen  ">
      <div className=" mx-auto flex  flex-1 flex-col md:px-4  pb-12 relative">
        {children}
      </div>
    </div>
  )
}
