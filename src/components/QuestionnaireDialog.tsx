import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitQuestionnaireMutation } from "@/store/questionnaire/api";
import { toast } from "sonner";
import type { IQuestionnaireSubmitRequest } from "@/store/questionnaire/types";

interface QuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: () => void;
}

export const QuestionnaireDialog: React.FC<QuestionnaireDialogProps> = ({
  open,
  onOpenChange,
  onSubmitSuccess,
}) => {
  const [submitQuestionnaire, { isLoading }] = useSubmitQuestionnaireMutation();

  const [formData, setFormData] = useState<IQuestionnaireSubmitRequest>({
    age: "",
    gender: "",
    medical_history: "",
    medications: "",
    allergies: "",
    height: "",
    weight: "",
  });

  const handleInputChange = (
    field: keyof IQuestionnaireSubmitRequest,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyFields = Object.entries(formData).filter(
      ([_, value]) => !value.trim(),
    );

    if (emptyFields.length > 0) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await submitQuestionnaire(formData).unwrap();

      if (result.success) {
        toast.success(result.message || "Questionnaire submitted successfully");
        // Reset form
        setFormData({
          age: "",
          gender: "",
          medical_history: "",
          medications: "",
          allergies: "",
          height: "",
          weight: "",
        });
        // Call success callback to close dialog
        onSubmitSuccess?.();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit questionnaire");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          return;
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Health Questionnaire</DialogTitle>
          <DialogDescription>
            Please provide your health information to help us assist you better.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              min="1"
              max="150"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                required
              >
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="cm"
                required
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="kg"
                required
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical History *</Label>
            <Textarea
              id="medical_history"
              placeholder="Please describe any past or current medical conditions"
              value={formData.medical_history}
              onChange={(e) =>
                handleInputChange("medical_history", e.target.value)
              }
              rows={3}
              required
            />
          </div>

          {/* Medications */}
          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications *</Label>
            <Textarea
              id="medications"
              placeholder="List any medications you are currently taking (or 'None')"
              value={formData.medications}
              onChange={(e) => handleInputChange("medications", e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies *</Label>
            <Textarea
              id="allergies"
              placeholder="List any allergies (or 'None')"
              value={formData.allergies}
              onChange={(e) => handleInputChange("allergies", e.target.value)}
              rows={2}
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
