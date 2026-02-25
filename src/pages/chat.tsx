import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, X, Menu, Bot, User, Send, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionnaireDialog } from "@/components/QuestionnaireDialog";
import { useGetQuestionnaireStatusQuery } from "@/store/questionnaire/api";
import {
  useStartConversationMutation,
  useGetConversationsQuery,
  useGetConversationQuery,
  useCheckActiveConversationQuery,
  useEndConversationMutation,
  useSendMessageMutation,
} from "@/store/chat/api";

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [hasSubmittedQuestionnaire, setHasSubmittedQuestionnaire] =
    useState(false);
  const [isEndingConversation, setIsEndingConversation] = useState(false);
  const sidebarScrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  // API hooks
  const [startConversation, { data: newConversationData }] =
    useStartConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const [endConversation] = useEndConversationMutation();
  const { data: conversationsList } = useGetConversationsQuery();
  const { data: currentConversation } = useGetConversationQuery(
    conversationId!,
    {
      skip: !conversationId,
    },
  );
  const { data: activeConvData } = useCheckActiveConversationQuery();

  const { data: statusData, isLoading: statusLoading } =
    useGetQuestionnaireStatusQuery();

  useEffect(() => {
    if (!statusLoading && statusData) {
      if (statusData.hasSubmitted) {
        setHasSubmittedQuestionnaire(true);
        setDialogOpen(false);
      } else if (!hasSubmittedQuestionnaire) {
        setDialogOpen(true);
      }
    }
  }, [statusData, statusLoading, hasSubmittedQuestionnaire]);

  // Navigate to new conversation when created
  useEffect(() => {
    if (newConversationData?._id) {
      navigate(`/chat/${newConversationData._id}`);
    }
  }, [newConversationData, navigate]);

  // Load conversation messages from URL param
  useEffect(() => {
    if (currentConversation?.messages) {
      // Filter to show only assistant and user messages (skip system messages)
      const visibleMessages = currentConversation.messages.filter(
        (msg: any) => msg.role === "assistant" || msg.role === "user",
      );
      setMessages(visibleMessages);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  const handleNewConsultation = async () => {
    setIsStartingConversation(true);
    try {
      await startConversation();
    } finally {
      setIsStartingConversation(false);
    }
  };

  const handleEndConsultation = async () => {
    if (!conversationId) return;

    setIsEndingConversation(true);
    try {
      await endConversation(conversationId).unwrap();
      // Navigate to root chat page
      navigate(`/`);
    } catch (error) {
      console.error("Failed to end conversation:", error);
    } finally {
      setIsEndingConversation(false);
    }
  };

  const isCurrentConversationActive =
    currentConversation && !currentConversation.ended;

  const handleConversationClick = (convId: string) => {
    navigate(`/chat/${convId}`);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessageContent = inputMessage;
    setInputMessage("");
    setIsSendingMessage(true);

    try {
      setMessages([
        ...messages,
        {
          role: "user",
          content: userMessageContent,
          _id: Date.now(),
          created_at: new Date().toISOString(),
        },
      ]);

      // Send to backend
      const result = await sendMessage({
        conversationId,
        content: userMessageContent,
      }).unwrap();

      // Update messages with actual server response
      if (result && result.messages) {
        const visibleMessages = result.messages.filter(
          (msg: any) => msg.role === "assistant" || msg.role === "user",
        );
        setMessages(visibleMessages);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert optimistic update on error
      setMessages(
        messages.filter(
          (msg) => msg.content !== userMessageContent || msg.role !== "user",
        ),
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("token");
    // Navigate to login
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-background/80 backdrop-blur-sm relative overflow-hidden">
      <QuestionnaireDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (
            !open &&
            (statusData?.hasSubmitted || hasSubmittedQuestionnaire)
          ) {
            setDialogOpen(false);
          }
        }}
      />

      {/* Sidebar */}
      <div
        className={`h-full flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-80" : "w-16"
        }`}
      >
        {sidebarOpen ? (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="overflow-hidden">
                  <h1 className="font-semibold text-foreground truncate">
                    AI-Health Advanced Assistant
                  </h1>
                  <p className="text-xs text-muted-foreground truncate">
                    Here for your health needs
                  </p>
                </div>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="flex-shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-border/50 flex-shrink-0">
              <Button
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-500 group disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                onClick={handleNewConsultation}
                disabled={activeConvData?.has_active || isStartingConversation}
              >
                {isStartingConversation ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Starting...
                  </>
                ) : (
                  "New Consultation"
                )}
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border/50 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 bg-background/50 border-border/30 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full" ref={sidebarScrollAreaRef}>
                <div className="p-4 space-y-4">
                  {/* Active Chats Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Active Consultations
                    </h3>
                    <div className="space-y-1">
                      {conversationsList
                        ?.filter((conv) => !conv.ended)
                        .filter((conv) =>
                          conv.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .map((conv) => (
                          <button
                            key={conv._id}
                            onClick={() => handleConversationClick(conv._id)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              conversationId === conv._id
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted/50 border border-transparent"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Bot className="size-4 mt-0.5 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {conv.title}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      {(!conversationsList ||
                        conversationsList
                          .filter((conv) => !conv.ended)
                          .filter((conv) =>
                            conv.title
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          ).length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          {searchQuery
                            ? "No matching active chats"
                            : "No active chats"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* History Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      History
                    </h3>
                    <div className="space-y-1">
                      {conversationsList
                        ?.filter((conv) => conv.ended)
                        .filter((conv) =>
                          conv.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .map((conv) => (
                          <button
                            key={conv._id}
                            onClick={() => handleConversationClick(conv._id)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              conversationId === conv._id
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted/50 border border-transparent"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Bot className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate opacity-75">
                                  {conv.title}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      {(!conversationsList ||
                        conversationsList
                          .filter((conv) => conv.ended)
                          .filter((conv) =>
                            conv.title
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          ).length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          {searchQuery ? "No matching history" : "No history"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-border/50 flex-shrink-0">
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="lg"
                className="w-full gap-2 bg-black hover:bg-black/80 text-white"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </>
        ) : (
          // Collapsed sidebar with burger icon at top
          <div className="p-4 border-b border-border/50 flex items-center justify-center flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="size-10"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {dialogOpen && (
          <div className="absolute inset-0 backdrop-blur-sm z-10" />
        )}

        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm p-4 flex-shrink-0 relative z-0">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="size-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">AI Assistant</h1>
                <p className="text-xs text-muted-foreground">
                  Always here to help
                </p>
              </div>
            </div>

            {/* End Consultation Button */}
            {isCurrentConversationActive && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEndConsultation}
                disabled={isEndingConversation}
                className="transition-all duration-200 bg-black hover:bg-black/80 text-white border-black"
              >
                {isEndingConversation ? "Ending..." : "End Consultation"}
              </Button>
            )}
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 relative z-0">
          <ScrollArea
            className={`h-full ${dialogOpen ? "pointer-events-none" : ""}`}
            ref={chatScrollAreaRef}
          >
            <div className="p-4">
              <div className="max-w-4xl mx-auto space-y-4 w-full">
                {messages.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="size-20 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bot className="size-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
                        Welcome to Your Health Companion
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
                        Start a new consultation to discuss your health
                        concerns. Our AI medical assistant is available 24/7 to
                        provide personalized guidance based on your medical
                        history and current symptoms.
                      </p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground/80">
                        Tip: Only one active consultation at a time. End your
                        current consultation to start a new one.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={`message-${message._id}-${index}`}
                        className={`flex gap-4 animate-in fade-in-0 duration-300 ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`size-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                              : "bg-gradient-to-br from-primary to-purple-600"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="size-4 text-white" />
                          ) : (
                            <Bot className="size-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-[80%] min-w-0 ${
                            message.role === "user" ? "text-right" : ""
                          }`}
                        >
                          <div
                            className={`inline-block p-4 rounded-2xl ${
                              message.role === "user"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-card border border-border/50 rounded-bl-none"
                            } shadow-sm max-w-full`}
                          >
                            <div className="whitespace-pre-wrap text-sm break-words">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isSendingMessage && (
                      <div className="flex gap-4 animate-in fade-in-0 duration-300">
                        <div className="size-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
                          <Bot className="size-4 text-white" />
                        </div>
                        <div className="flex-1 max-w-[80%] min-w-0">
                          <div className="inline-block p-4 rounded-2xl bg-card border border-border/50 rounded-bl-none shadow-sm">
                            <div className="flex gap-1">
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              />
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              />
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input Area - Only show for active conversations */}
        {isCurrentConversationActive && (
          <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm p-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto w-full">
              <div className="relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms..."
                  disabled={dialogOpen}
                  className="pr-12 bg-background/80 backdrop-blur-sm border-border/30 focus:border-primary/50 transition-all duration-300"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !inputMessage.trim() || dialogOpen || isSendingMessage
                  }
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 size-8 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-500"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Doctor AI Assistant gives general guidance only — always consult
                a real doctor for urgent concerns.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
