import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, Send, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useCloseConsultationMutation,
  useGetConsultationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/store/consultation/api";
import { toast } from "sonner";

const statusBadgeClass: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-sky-100 text-sky-800 border-sky-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
};

const parseSummaryPreview = (summary: string) => {
  const normalized = (summary || "")
    .replace(
      /\s*(Possible Causes Discussed|Advice Given|Follow-up Suggestions|Notes)\s*:?\s*/gi,
      "\n$1: ",
    )
    .replace(/\s*Symptoms\s*:?\s*/i, "Symptoms: ")
    .replace(/\s+/g, " ")
    .trim();

  const pickSection = (label: string) => {
    const regex = new RegExp(
      `${label}:?\\s*([\\s\\S]*?)(?=(Symptoms|Possible Causes Discussed|Advice Given|Follow-up Suggestions|Notes):|$)`,
      "i",
    );
    const match = normalized.match(regex);
    const content = (match?.[1] || "")
      .replace(/^[-:\s]+/, "")
      .replace(/\s+/g, " ")
      .trim();
    return content || "Not mentioned";
  };

  return {
    symptoms: pickSection("Symptoms"),
    advice: pickSection("Advice Given"),
  };
};

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const previousStatusMap = useRef<Record<string, string>>({});

  const {
    data: consultations = [],
    isLoading,
    isError,
  } = useGetConsultationsQuery(undefined, { pollingInterval: 5000 });
  const { data: messages = [] } = useGetMessagesQuery(selectedId || "", {
    skip: !selectedId,
    pollingInterval: 3000,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [closeConsultation, { isLoading: isClosing }] =
    useCloseConsultationMutation();

  const selectedConsultation = useMemo(
    () => consultations.find((c) => c.id === selectedId) || null,
    [consultations, selectedId],
  );

  useEffect(() => {
    if (!selectedId && consultations.length > 0) {
      setSelectedId(consultations[0].id);
    }
  }, [consultations, selectedId]);

  useEffect(() => {
    consultations.forEach((consultation) => {
      const previousStatus = previousStatusMap.current[consultation.id];
      if (
        previousStatus === "pending" &&
        ["accepted", "active"].includes(consultation.status)
      ) {
        toast.success("A doctor has accepted your consultation request.");
      }
      previousStatusMap.current[consultation.id] = consultation.status;
    });
  }, [consultations]);

  const canChat =
    selectedConsultation &&
    ["accepted", "active"].includes(selectedConsultation.status);

  const handleSend = async () => {
    if (!selectedId || !messageInput.trim() || !canChat) {
      return;
    }

    try {
      await sendMessage({
        consultationId: selectedId,
        message: messageInput,
      }).unwrap();
      setMessageInput("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  const handleClose = async () => {
    if (!selectedId) {
      return;
    }

    try {
      await closeConsultation(selectedId).unwrap();
      toast.success("Consultation closed");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to close consultation");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Stethoscope className="h-3.5 w-3.5" />
                Doctor Support
              </div>
              <h1 className="text-3xl font-bold mt-3">Doctor Consultation</h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-2xl">
                Track escalation status, monitor doctor assignment, and chat
                with your assigned doctor in one place.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
              Consultations
            </h2>

            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading consultations...
              </p>
            )}
            {isError && (
              <p className="text-sm text-destructive">
                Failed to load consultations.
              </p>
            )}

            <div className="space-y-2">
              {consultations.map((consultation) => {
                const preview = parseSummaryPreview(consultation.summary || "");

                return (
                  <button
                    key={consultation.id}
                    type="button"
                    onClick={() => setSelectedId(consultation.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      consultation.id === selectedId
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={statusBadgeClass[consultation.status] || ""}
                      >
                        {consultation.status}
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1 text-sm">
                      <p className="line-clamp-2">
                        <span className="text-muted-foreground">
                          Symptoms:{" "}
                        </span>
                        {preview.symptoms}
                      </p>
                      <p className="line-clamp-2">
                        <span className="text-muted-foreground">Advice: </span>
                        {preview.advice}
                      </p>
                    </div>
                  </button>
                );
              })}

              {!isLoading && consultations.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No doctor consultations yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 flex flex-col min-h-[620px]">
            {!selectedConsultation ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a consultation to view details.
              </div>
            ) : (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          statusBadgeClass[selectedConsultation.status] || ""
                        }
                      >
                        {selectedConsultation.status}
                      </Badge>
                    </div>
                    {selectedConsultation.status !== "closed" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClose}
                        disabled={isClosing}
                      >
                        {isClosing ? "Closing..." : "Close Consultation"}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Summary for doctor
                  </p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {selectedConsultation.summary}
                  </p>
                </div>

                {selectedConsultation.status === "pending" && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm flex gap-2">
                    <CircleAlert className="h-4 w-4 mt-0.5" />
                    Waiting for doctor acceptance. Messaging will be available
                    once accepted.
                  </div>
                )}

                <ScrollArea className="flex-1 pr-2">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))}

                    {messages.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No doctor messages yet.
                      </p>
                    )}
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      canChat
                        ? "Type a message for your doctor..."
                        : "Chat becomes available once accepted"
                    }
                    disabled={
                      !canChat || selectedConsultation.status === "closed"
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={
                      !canChat ||
                      !messageInput.trim() ||
                      isSending ||
                      selectedConsultation.status === "closed"
                    }
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
