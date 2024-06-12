"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUploader } from "@/components/cult/file-drop"
import { GradientHeading } from "@/components/cult/gradient-heading"

import { StyledButton } from "../login/submit-button"
import { onSubmitToolAction } from "./action"
import { schema } from "./schema"

// To trigger async toast
const p = () => new Promise((resolve) => setTimeout(() => resolve(""), 900))

const categories = [
  { label: "Boilerplate", value: "boilerplate" },
  { label: "Analytics", value: "analytics" },
  { label: "Marketing Tools", value: "marketing-tools" },
  { label: "Developer Tools", value: "developer-tools" },
  { label: "E-commerce", value: "e-commerce" },
  { label: "Productivity", value: "productivity" },
  { label: "Design Tools", value: "design-tools" },
  { label: "Fintech", value: "fintech" },
  { label: "Education", value: "education" },
  { label: "SaaS", value: "saas" },
]

export const SubmitTool = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [state, formAction] = useFormState(onSubmitToolAction, {
    message: "",
    issues: [],
  })

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange", // Enable validation on change to get real-time validation state
    defaultValues: {
      fullName: "",
      email: "",
      twitterHandle: "",
      productWebsite: "",
      codename: "",
      punchline: "",
      description: "",
      images: [],
      logo_src: "",
      categories: "",
      ...(state?.fields ?? {}),
    },
  })

  const { isValid } = form.formState

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message && state.issues.length < 1) {
      toast.success(state.message)
    } else if (state.issues.length >= 1) {
      toast.error(state.issues.join(", "))
      setLoading(false)
    }
    setLoading(false)
  }, [state.message, state.issues])

  return (
    <Form {...form}>
      {state?.issues && (
        <div className="text-red-500">
          <ul>
            {state.issues.map((issue) => (
              <li key={issue} className="flex gap-1">
                <X fill="red" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form
        ref={formRef}
        className="space-y-8"
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault()
          setLoading(true)
          toast.promise(p, { loading: "Submitting..." })
          form.handleSubmit(async (data) => {
            let formData = new FormData(formRef.current!)
            const logoFile = form.getValues("images")
            if (logoFile.length > 0) {
              formData.set("images", logoFile[0])
            }
            setLoading(false)
            await formAction(formData)
            router.push("/")
          })(evt)
        }}
      >
        <GradientHeading size="xs">
          Let's start with your personal deets
        </GradientHeading>
        <div className="flex flex-wrap gap-1 md:gap-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitterHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Twitter handle</FormLabel>
                <FormControl>
                  <Input placeholder="Your Twitter handle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product website</FormLabel>
                <FormControl>
                  <Input placeholder="Your product url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <GradientHeading size="xs">
          Tell us more about your product
        </GradientHeading>
        <FormField
          control={form.control}
          name="codename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your product's name</FormLabel>
              <FormControl>
                <Input placeholder="Your product's codename" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="punchline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your product's punchline (&lt;10 words)</FormLabel>
              <FormControl>
                <Input placeholder="Your product's punchline" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>A short description here (~70 words)</FormLabel>
              <FormControl>
                <Input placeholder="A short description here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Logo file (.jpg or .png format, 128x128)</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                {...field}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.label}
                      value={(category.value ?? "").toLowerCase()}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                This is the categories that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isValid && (
          <StyledButton disabled={loading} type="submit">
            Submit
          </StyledButton>
        )}
      </form>
    </Form>
  )
}

export default SubmitTool
