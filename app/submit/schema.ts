import { z } from "zod";

export const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  twitterHandle: z.string().optional(),
  productWebsite: z.string().url("Invalid URL"),
  codename: z.string().min(1, "Codename is required"),
  punchline: z.string().min(1, "Punchline is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.string().min(1, "Category is required"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: z.array(z.any()).optional().default([]),
  logo_src: z.string().optional().default(""),
});

export const enrichmentSchema = z.object({
  tags: z.array(z.string()),
  labels: z.array(z.string()).optional(),
});
