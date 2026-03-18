import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type SummarySection = {
  heading: string;
  items: string[];
};

interface ConversationSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatTitle?: string;
  summary?: string;
  summaryCreatedAt?: string | null;
  isLoading: boolean;
  error?: string | null;
}

const EXPECTED_HEADINGS = [
  "Symptoms",
  "Possible Causes Discussed",
  "Advice Given",
  "Follow-up Suggestions",
  "Notes",
];

function parseSummary(summary: string): SummarySection[] {
  const lines = summary
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: SummarySection[] = [];
  let current: SummarySection | null = null;

  for (const line of lines) {
    const normalizedHeading = line.replace(/:\s*$/, "");

    if (EXPECTED_HEADINGS.includes(normalizedHeading)) {
      current = { heading: normalizedHeading, items: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { heading: "Notes", items: [] };
      sections.push(current);
    }

    const cleanedItem = line.replace(/^[-*\u2022]\s*/, "");
    current.items.push(cleanedItem);
  }

  return sections;
}

export const ConversationSummaryDialog: React.FC<
  ConversationSummaryDialogProps
> = ({
  open,
  onOpenChange,
  chatTitle,
  summary,
  summaryCreatedAt,
  isLoading,
  error,
}) => {
  const parsedSections = summary ? parseSummary(summary) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Conversation Summary</DialogTitle>
          <DialogDescription>
            {chatTitle
              ? `Summary for ${chatTitle}`
              : "Structured overview of the completed consultation."}
          </DialogDescription>
          {summaryCreatedAt && (
            <p className="text-xs text-muted-foreground">
              Created: {new Date(summaryCreatedAt).toLocaleString()}
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">
          {isLoading && (
            <div className="py-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating summary...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {!isLoading && !error && summary && (
            <div className="space-y-4">
              {parsedSections.map((section) => (
                <section
                  key={section.heading}
                  className="rounded-lg border border-border/50 p-4"
                >
                  <h3 className="text-sm font-semibold mb-2">
                    {section.heading}
                  </h3>
                  {section.items.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
                      {section.items.map((item, index) => (
                        <li key={`${section.heading}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not mentioned
                    </p>
                  )}
                </section>
              ))}
            </div>
          )}

          {!isLoading && !error && !summary && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No summary available.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
