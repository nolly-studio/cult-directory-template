import React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "./ui/button"

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center md:items-start md:px-2 justify-center gap-2 md:ml-12">
      <div className="flex items-center space-x-2">
        <h1 className="text-5xl font-black text-left">Directorio Kupuri™</h1>
        <Badge
          variant="outline"
          className="border border-primary/10 hidden md:block"
        >
          <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-1"></span>
          LATAM
        </Badge>
      </div>
      <div className="flex flex-col items-center md:items-start md:mt-4">
        <Badge className="hidden md:block" variant="default">
          Kupuri Media™
        </Badge>
        <div className="flex w-full items-center mt-2 justify-center md:justify-start">
          <span className="mx-0 text-xl font-bold text-left">
            Directorio de Negocios Latinoamericanos
          </span>
        </div>
        <p className="mt-2 text-center md:text-left text-muted-foreground text-sm md:text-base px-2">
          Publica tu negocio gratis. Restaurantes, servicios digitales, bienes raíces, tecnología y más.
        </p>
      </div>
      <div className="flex mt-4 mb-4 space-x-4">
        <Button variant="secondary" asChild>
          <Link href="/submit" className="flex items-center text-black">
            <PlusIcon className="size-4 mr-1" /> Publicar Negocio
          </Link>
        </Button>
        <a
          href="https://kupurimedia.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          kupurimedia.com
        </a>
      </div>
      {children}
    </div>
  )
}
