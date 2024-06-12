const getAIEnrichmentPrompt = (name: string, cat: string, desc: string) => `
Extract relevant tags and labels for the following product descriptions. Ensure all tags and labels are lowercase:

Tags: Specific keywords that highlight the main technologies, topics, and features of the product.
Labels: Broader categories or classifications indicating the type, target audience, or use case of the product.

Example 1:
Description: "A comprehensive guide to modern JavaScript development, covering ES6, asynchronous programming, and more."
Codename: "JavaScript Guide"
Category: "Books"
Tags: ["javascript", "es6", "async", "web development"]
Labels: ["guide", "programming", "advanced"]

Example 2:
Description: "An intuitive app for tracking personal finances, managing budgets, and planning expenses."
Codename: "Finance Tracker"
Category: "Mobile Apps"
Tags: ["personal finance", "budgeting", "expense tracking"]
Labels: ["app", "finance", "productivity"]

Example 3:
Description: "An open-source library for building real-time, collaborative applications with ease."
Codename: "CollaborateJS"
Category: "Libraries"
Tags: ["real-time", "collaborative applications", "open-source"]
Labels: ["library", "development", "collaboration"]

Your task:

Description: "${desc}"
Codename: "${name}"
Category: "${cat}"
Tags:
Labels:
`
