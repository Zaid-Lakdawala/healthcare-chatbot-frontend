import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  useAcceptConsultationMutation,
  useCloseConsultationMutation,
  useGetAssignedConsultationsQuery,
  useGetMessagesQuery,
  useGetPendingConsultationsQuery,
  useSendMessageMutation,
} from "@/store/consultation/api";
import { toast } from "sonner";

const severityBadgeClass: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const statusBadgeClass: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-sky-100 text-sky-800 border-sky-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
};

const DoctorPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const { data: pending = [] } = useGetPendingConsultationsQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: assigned = [] } = useGetAssignedConsultationsQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: messages = [] } = useGetMessagesQuery(selectedId || "", {
    skip: !selectedId,
    pollingInterval: 2500,
  });

  const [acceptConsultation, { isLoading: isAccepting }] =
    useAcceptConsultationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [closeConsultation, { isLoading: isClosing }] =
    useCloseConsultationMutation();

  const allDoctorConsultations = useMemo(() => {
    const merged = [...assigned];
    pending.forEach((item) => {
      if (!merged.find((a) => a.id === item.id)) {
        merged.push(item);
      }
    });
    return merged;
  }, [pending, assigned]);

  const selectedConsultation =
    allDoctorConsultations.find((c) => c.id === selectedId) || null;

  const canChat =
    selectedConsultation &&
    ["accepted", "active"].includes(selectedConsultation.status);

  useEffect(() => {
    if (!selectedId && allDoctorConsultations.length > 0) {
      setSelectedId(allDoctorConsultations[0].id);
    }
  }, [allDoctorConsultations, selectedId]);

  const handleAccept = async (id: string) => {
    try {
      await acceptConsultation(id).unwrap();
      toast.success("Consultation accepted");
      setSelectedId(id);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unable to accept consultation");
    }
  };

  const handleSend = async () => {
    if (!selectedId || !messageInput.trim()) {
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Stethoscope className="h-4 w-4" />
              Doctor Dashboard
            </div>
            <h1 className="text-3xl font-bold">Doctor Consultation Queue</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review pending requests and manage active doctor chats.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
          <div className="rounded-xl border bg-card p-4">
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-2">
                {pending.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        className={statusBadgeClass[consultation.status] || ""}
                      >
                        {consultation.status}
                      </Badge>
                      <Badge
                        className={
                          severityBadgeClass[consultation.severity] || ""
                        }
                      >
                        {consultation.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(consultation.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm line-clamp-4">
                      {consultation.summary}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(consultation.id)}
                        disabled={isAccepting}
                      >
                        Accept Case
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedId(consultation.id)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {pending.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No pending consultations.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="assigned" className="space-y-2">
                {assigned.map((consultation) => (
                  <button
                    key={consultation.id}
                    type="button"
                    onClick={() => setSelectedId(consultation.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selectedId === consultation.id
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
                      <Badge
                        className={
                          severityBadgeClass[consultation.severity] || ""
                        }
                      >
                        {consultation.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        consultation.updated_at || consultation.created_at,
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm line-clamp-4 mt-1">
                      {consultation.summary}
                    </p>
                  </button>
                ))}
                {assigned.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No assigned consultations.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="rounded-xl border bg-card p-4 flex flex-col min-h-[620px]">
            {!selectedConsultation ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a consultation from the queue.
              </div>
            ) : (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex gap-2">
                      <Badge
                        className={
                          statusBadgeClass[selectedConsultation.status] || ""
                        }
                      >
                        {selectedConsultation.status}
                      </Badge>
                      <Badge
                        className={
                          severityBadgeClass[selectedConsultation.severity] ||
                          ""
                        }
                      >
                        {selectedConsultation.severity}
                      </Badge>
                    </div>
                    {selectedConsultation.status !== "closed" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClose}
                        disabled={isClosing}
                      >
                        {isClosing ? "Closing..." : "Close"}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Anonymized user reference
                  </p>
                  <p className="text-sm font-medium">
                    {selectedConsultation.user_id || "Hidden"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Case summary
                  </p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {selectedConsultation.summary}
                  </p>
                </div>

                <ScrollArea className="flex-1 pr-2">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                            msg.sender === "doctor"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-[10px] opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No messages yet.
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
                        ? "Type your message to the patient..."
                        : "Accept this case to start doctor-patient chat"
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

export default DoctorPage;
