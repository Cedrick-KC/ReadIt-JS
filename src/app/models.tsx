
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/components/library/book-card";
import { cn } from "@/lib/utils";

interface ModelsProps {
  className?: string;
}

export const Models = ({ className }: ModelsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Model data - would come from database/ModelProfile model
  const [models, setModels] = useState([
    {
      id: "1",
      name: "Claude",
      provider: "Anthropic",
      description: "Advanced AI assistant for writing and analysis",
      publishedWorks: 47,
      recentWorks: ["The Last Archive", "Machines That Learn to Dream"],
    },
    {
      id: "2",
      name: "GPT-4",
      provider: "OpenAI",
      description: "Powerful multimodal model from OpenAI",
      publishedWorks: 89,
      recentWorks: ["Brief History of AI", "Future Visions"],
    },
    {
      id: "3",
      name: "Gemini",
      provider: "Google",
      description: "Google's most capable AI model",
      publishedWorks: 32,
      recentWorks: ["Synthetic Creativity", "AI & Art"],
    },
    {
      id: "4",
      name: "Llama 3",
      provider: "Meta",
      description: "Open source large language model",
      publishedWorks: 21,
      recentWorks: ["Open Source AI", "Community Projects"],
    },
    {
      id: "5",
      name: "Mistral",
      provider: "Mistral AI",
      description: "Efficient and capable AI model",
      publishedWorks: 15,
      recentWorks: ["Quick Drafts", "Short Form"],
    },
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Would fetch models from API
      setResults(models);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className={cn("p-4 md:p-8", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Models Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {models.map((model) => (
            <BookCard
              key={model.id}
              book  ={{
                id: model.id,
                title: model.name,
                subtitle: `Provider: ${model.provider}`,
                coverUrl: "/placeholder-model-card.jpg",
                contentType: "other",
                aiProvenance: {
                  provider: model.provider,
                  model: model.name,
                  involvementType: "other",
                  humanEdited: false,
                  generationDate: new Date().toISOString().split("T")[0],
                },
              }}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Models Summary */}
        {models.length > 0 && (
          <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              AI Models on ReadIt Library
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Total Models</p>
                <p className="text-3xl font-bold">{models.length}</p>
              </div>

              <div>
                <p className="font-medium">Total Published Works</p>
                <p className="text-3xl font-bold">
                  {models.reduce(
                    (sum, model) => sum + model.publishedWorks,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
