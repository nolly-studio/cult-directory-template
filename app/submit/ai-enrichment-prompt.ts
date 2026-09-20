export function getAIEnrichmentPrompt(codename: string, categories: string, description: string) {
  return `
    Codename: ${codename}
    Categories: ${categories}
    Description: ${description}
    
    Generate tags and labels for the above product.
  `;
}
