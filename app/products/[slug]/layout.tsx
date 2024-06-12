import { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="  ">
      <div className=" mx-auto flex  flex-1 flex-col px-4  py-12 relative">
        {children}
      </div>
    </div>
  )
}
