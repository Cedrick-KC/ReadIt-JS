"use client";

import * as React from "react";
import { useState } from "react";
import { BookOpen, FileText, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionFormProps {
  onClose: () => void;
  onSubmit: (formData: SubmissionFormData) => void;
}

interface SubmissionFormData {
  title: string;
  subtitle: string;
  description: string;
  contentType: "book" | "article" | "essay" | "other";
  genre: string;
  tags: string[];
  language: string;
  aiModel: string;
  aiModelVersion: string;
  aiInvolvement: "fullyAI" | "aiAssisted" | "humanWithAI" | "other";
  humanEdited: boolean;
  humanEditor: string;
  generationDate: string;
  disclosureNotes: string;
  contentWarnings: string[];
  rightsAffirmed: boolean;
  coverFile: File | null;
}

export const SubmissionForm = ({
  onClose,
  onSubmit,
}: SubmissionFormProps) => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<SubmissionFormData>({
    title: "",
    subtitle: "",
    description: "",
    contentType: "book",
    genre: "",
    tags: [],
    language: "en",
    aiModel: "",
    aiModelVersion: "",
    aiInvolvement: "aiAssisted",
    humanEdited: false,
    humanEditor: "",
    generationDate: new Date().toISOString().split("T")[0],
    disclosureNotes: "",
    contentWarnings: [],
    rightsAffirmed: false,
    coverFile: null,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (!(name in formData)) {
      return;
    }

    const fieldName = name as keyof SubmissionFormData;

    if (type === "checkbox") {
  const checkbox = e.target as HTMLInputElement;

  setFormData((current) => ({
    ...current,
    [fieldName]: checkbox.checked,
  }));

  return;
}

    setFormData((current) => ({
      ...current,
      [fieldName]: value,
    }));
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files[0]) {
      setFormData((current) => ({
        ...current,
        coverFile: files[0],
      }));
    }
  };

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return formData.contentType.length > 0 && formData.genre.length > 0;
      case 3:
        return formData.aiModel.length > 0;
      case 4:
        return formData.rightsAffirmed;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    onSubmit(formData);
    setShowConfirmation(true);
  };

  const steps = [
    {
      title: "Work Details",
      description: "Provide basic information about your work",
    },
    {
      title: "Content & Genre",
      description: "Select content type, genre, and tags",
    },
    {
      title: "AI Provenance",
      description: "Disclose AI involvement and model details",
    },
    {
      title: "Rights & Review",
      description: "Affirm rights and submit for review",
    },
    {
      title: "Confirmation",
      description: "Review and submit your work",
    },
  ];

  return (
    <section className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Stepper */}
        <div className="border-b border-border/50 mb-6">
          {steps.map((stepInfo, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 px-2",
                index < step - 1 && "text-primary",
                index === step - 1 && "text-muted-foreground"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs">{stepInfo.title}</span>

              {index < steps.length - 1 && (
                <span className="text-primary/50">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 hover:bg-secondary/20 transition-colors"
          aria-label="Close submission form"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {steps[step - 1].title}
        </h2>

        <p className="text-muted-foreground mb-8">
          {steps[step - 1].description}
        </p>

        {/* Step 1: Work Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., The Last Archive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Subtitle
              </label>

              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., A story of survival and hope"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us about your work..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Content & Genre */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Content Type
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.contentType === "book"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      contentType: "book",
                    }))
                  }
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Book
                </label>

                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.contentType === "article"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      contentType: "article",
                    }))
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Article
                </label>

                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.contentType === "essay"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      contentType: "essay",
                    }))
                  }
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Essay
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Genre
              </label>

              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a genre</option>
                <option value="fiction">Fiction</option>
                <option value="science">Science</option>
                <option value="technology">Technology</option>
                <option value="philosophy">Philosophy</option>
                <option value="history">History</option>
                <option value="business">Business</option>
                <option value="self-development">Self Development</option>
                <option value="poetry">Poetry</option>
                <option value="essays">Essays</option>
                <option value="research">Research</option>
                <option value="short-stories">Short Stories</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}

                <input
                  type="text"
                  name="tags"
                  placeholder="Add tags (comma separated)"
                  className="flex-1 rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus-ring-primary"
                  onChange={handleInputChange}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Separate tags with commas
              </p>
            </div>
          </div>
        )}

        {/* Step 3: AI Provenance */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              How was this work created? Be transparent about AI involvement.
            </p>

            <div>
              <label className="block text-sm font-medium mb-2">
                AI Involvement Level
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.aiInvolvement === "fullyAI"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      aiInvolvement: "fullyAI",
                    }))
                  }
                >
                  Fully AI-generated
                </label>

                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.aiInvolvement === "aiAssisted"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      aiInvolvement: "aiAssisted",
                    }))
                  }
                >
                  AI-assisted
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.aiInvolvement === "humanWithAI"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      aiInvolvement: "humanWithAI",
                    }))
                  }
                >
                  Human-written with AI editing
                </label>

                <label
                  className="rounded-md border border-input px-3 py-2 cursor-pointer select-none"
                  style={{
                    background:
                      formData.aiInvolvement === "other"
                        ? "var(--primary)"
                        : "transparent",
                  }}
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      aiInvolvement: "other",
                    }))
                  }
                >
                  Other
                </label>
              </div>
            </div>

            {formData.aiInvolvement !== "fullyAI" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Human Editor/Editor
                </label>

                <input
                  name="humanEditor"
                  value={formData.humanEditor}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Name of human editor (optional)"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                AI Model
              </label>

              <input
                name="aiModel"
                value={formData.aiModel}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Claude, GPT-4, Gemini"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Model Version
              </label>

              <input
                name="aiModelVersion"
                value={formData.aiModelVersion}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 3.5 Sonnet, 4.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Generation Date
              </label>

              <input
                type="date"
                name="generationDate"
                value={formData.generationDate}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Disclosure Notes
              </label>

              <textarea
                rows={3}
                name="disclosureNotes"
                value={formData.disclosureNotes}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Additional disclosure information (optional)"
              />
            </div>
          </div>
        )}

        {/* Step 4: Rights & Review */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              By submitting, you affirm that you have the necessary rights and
              permissions to submit this material and that the content complies
              with ReadIt Library&apos;s content guidelines.
            </p>

            <div className="rounded-md border border-input p-3 mb-4">
              <input
                type="checkbox"
                checked={formData.rightsAffirmed}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    rightsAffirmed: e.target.checked,
                  }))
                }
                className="rounded border"
              />

              <span className="text-sm text-primary hover:underline">
                I affirm I have the rights to submit this content
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Please note: Works that violate content guidelines or lack proper
              rights may be rejected or removed without notice.
            </p>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content Warnings
              </label>

              <div className="flex flex-wrap gap-2">
                {formData.contentWarnings.map((warning) => (
                  <span
                    key={warning}
                    className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {warning}
                  </span>
                ))}

                <input
                  type="text"
                  name="contentWarnings"
                  placeholder="Add content warnings (optional)"
                  className="flex-1 rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={handleInputChange}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Common warnings: Violence, Sexual Content, Drug Use, Self-Harm,
                etc.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="p-6 bg-secondary/50 rounded-lg mb-6">
            <h3 className="text-xl font-medium mb-4">
              Submission Summary
            </h3>

            <div className="space-y-3">
              <div>
                <span className="font-medium">Title:</span> {formData.title}
              </div>

              <div>
                <span className="font-medium">Type:</span>{" "}
                {formData.contentType}
              </div>

              <div>
                <span className="font-medium">Involvement:</span>{" "}
                {formData.aiInvolvement}
              </div>

              <div>
                <span className="font-medium">Model:</span>{" "}
                {formData.aiModel}
              </div>

              {formData.aiModelVersion && (
                <div>
                  <span className="font-medium">Version:</span>{" "}
                  {formData.aiModelVersion}
                </div>
              )}

              <div>
                <span className="font-medium">Language:</span>{" "}
                {formData.language}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-border/50">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10"
            >
              Previous
            </button>
          )}

          {step < 5 && (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          )}

          {step === 5 && (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Submit for Review
            </button>
          )}
        </div>

        {showConfirmation && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              Submission Received
            </h3>

            <p className="text-muted-foreground mb-4">
              Your work has been submitted for review. You will be notified
              once it has been reviewed by our moderation team. This typically
              takes 3-5 business days.
            </p>

            <button
              onClick={onClose}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </section>
  );
};