"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Note: highlight.js styles are imported via CDN or global CSS

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CodeProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = async (code: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
      }
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className={cn("prose prose-lg max-w-none dark:prose-invert", 
      // Enhanced Arabic typography
      "text-right leading-relaxed",
      "[&_*]:text-right",
      // Better Arabic line heights
      "[&_h1]:leading-tight [&_h2]:leading-tight [&_h3]:leading-tight",
      "[&_p]:leading-relaxed [&_p]:text-justify",
      // Enhanced Arabic spacing
      "[&_h1]:mb-6 [&_h2]:mb-5 [&_h3]:mb-4",
      "[&_p]:mb-4 [&_li]:mb-2",
      className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 mt-8 text-foreground scroll-mt-20" id={String(children).toLowerCase().replace(/\s+/g, '-')}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-3 mt-6 text-foreground scroll-mt-20" id={String(children).toLowerCase().replace(/\s+/g, '-')}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium mb-2 mt-4 text-foreground scroll-mt-20" id={String(children).toLowerCase().replace(/\s+/g, '-')}>
              {children}
            </h3>
          ),
          
          // Custom paragraph styles
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground/90">
              {children}
            </p>
          ),
          
          // Custom list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 mr-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90 leading-relaxed">
              {children}
            </li>
          ),
          
          // Custom link styles
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary hover:underline transition-colors duration-300"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          
          // Custom code block with copy button
          pre: ({ children }) => {
            const codeElement = children as React.ReactElement<CodeProps>
            const code = String(codeElement?.props?.children || '').trim()
            const isCopied = copiedCode === code

            return (
              <div className="relative group">
                <pre className="bg-muted/50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-border mb-4">
                  {children}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                  onClick={() => handleCopyCode(code)}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 ml-1" />
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 ml-1" />
                      نسخ
                    </>
                  )}
                </Button>
              </div>
            )
          },
          
          // Inline code styles
          code: ({ inline, className, children, ...props }: CodeProps) => {
            if (inline) {
              return (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          
          // Custom table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-right font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-right">
              {children}
            </td>
          ),
          
          // Custom blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-r-4 border-primary pr-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded">
              {children}
            </blockquote>
          ),
          
          // Custom strong/bold styles
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          
          // Custom emphasis/italic styles
          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),
          
          // Custom horizontal rule
          hr: () => (
            <hr className="my-8 border-border" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}