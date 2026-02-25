import React, { useState, useCallback } from "react";
import { useUploadDocumentsMutation } from "@/store/document/api";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IUploadResponse } from "@/store/document/types";

// Helper function for file size formatting
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const DocumentUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<IUploadResponse | null>(
    null,
  );
  const [uploadDocuments, { isLoading, isError, error, reset }] =
    useUploadDocumentsMutation();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) => {
        const validTypes = [
          "application/pdf",
          "application/msword",
          "text/plain",
        ];
        return validTypes.includes(file.type);
      });

      setFiles((prev) => [...prev, ...validFiles]);
      setUploadResult(null);
      reset();
    },
    [reset],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      setUploadResult(null);
      reset();
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      const result = await uploadDocuments(files).unwrap();
      setUploadResult(result);

      // Clear files after successful upload
      setFiles([]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadResult(null);
    reset();
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDrop={onDrop}
        className="border-2 border-dashed border-gray-300 rounded p-6 text-center"
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="cursor-pointer block">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="font-medium mb-2">
            Drag & drop files here, or click to select
          </p>
          <p className="text-sm text-gray-600 mb-4">Supports PDF,DOCX, TXT</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Select Files
          </Button>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Selected Files ({files.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium truncate text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}

      {uploadResult && (
        <div className="p-4 bg-green-100 border border-green-400 rounded">
          <div className="font-medium text-green-800">Upload successful!</div>
          {uploadResult.documents && uploadResult.documents.length > 0 && (
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              {uploadResult.documents.map((doc) => (
                <li key={doc.document_id}>{doc.filename}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <div className="font-medium text-red-800">Upload failed</div>
          <p className="text-sm text-red-700 mt-1">
            {(error as any)?.data?.message || "Unknown error occurred"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
