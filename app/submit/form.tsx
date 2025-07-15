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
  { label: "أدوات الكتابة", value: "أدوات الكتابة" },
  { label: "إنشاء الصور", value: "إنشاء الصور" },
  { label: "إنشاء الفيديو", value: "إنشاء الفيديو" },
  { label: "أدوات البرمجة", value: "أدوات البرمجة" },
  { label: "أدوات الصوت", value: "أدوات الصوت" },
  { label: "أدوات الإنتاجية", value: "أدوات الإنتاجية" },
  { label: "أدوات التصميم", value: "أدوات التصميم" },
  { label: "أدوات البحث", value: "أدوات البحث" },
  { label: "أدوات التعليم", value: "أدوات التعليم" },
  { label: "أدوات الأعمال", value: "أدوات الأعمال" },
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
          toast.promise(p, { loading: "جاري الإرسال..." })
          form.handleSubmit(async (data) => {
            let formData = new FormData(formRef.current!)
            const logoFile = form.getValues("images")
            if (logoFile.length > 0) {
              formData.set("images", logoFile[0])
            }
            setLoading(false)
            await formAction(formData)
            router.push("/submit/success")
          })(evt)
        }}
      >
        <GradientHeading size="xs">
          معلوماتك الشخصية
        </GradientHeading>
        <p className="text-sm text-muted-foreground text-right">
          هذه المعلومات ستساعدنا في التواصل معك بخصوص الأداة المقترحة
        </p>
        <div className="flex flex-wrap gap-1 md:gap-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم الكامل" {...field} />
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
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="البريد الإلكتروني" {...field} />
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
                <FormLabel>حساب تويتر/X</FormLabel>
                <FormControl>
                  <Input placeholder="@username" {...field} />
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
                <FormLabel>موقع الأداة</FormLabel>
                <FormControl>
                  <Input placeholder="رابط الأداة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <GradientHeading size="xs">
          معلومات الأداة
        </GradientHeading>
        <p className="text-sm text-muted-foreground text-right">
          كلما كانت المعلومات أكثر تفصيلاً، كان من الأسهل على المستخدمين اكتشاف الأداة والاستفادة منها
        </p>
        <FormField
          control={form.control}
          name="codename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الأداة</FormLabel>
              <FormControl>
                <Input placeholder="اسم الأداة" {...field} />
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
              <FormLabel>وصف مختصر للأداة (أقل من 10 كلمات)</FormLabel>
              <FormControl>
                <Input placeholder="وصف مختصر للأداة" {...field} />
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
              <FormLabel>وصف تفصيلي (حوالي 70 كلمة)</FormLabel>
              <FormControl>
                <Input placeholder="وصف تفصيلي للأداة" {...field} />
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
                <FormLabel>شعار الأداة (.jpg أو .png، 128x128)</FormLabel>
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
              <FormLabel>فئة الأداة</FormLabel>
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
                اختر الفئة المناسبة للأداة
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isValid && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-300 text-right">
                ✅ بإرسال هذا النموذج، ستحصل على رابط مجاني لموقعك وعرض أداتك لأكثر من 10,000 مستخدم عربي
              </p>
            </div>
            <StyledButton disabled={loading} type="submit" className="w-full">
              {loading ? "جاري الإرسال..." : "اقترح الأداة"}
            </StyledButton>
          </div>
        )}
      </form>
    </Form>
  )
}

export default SubmitTool
