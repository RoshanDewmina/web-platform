"use client";

import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  File,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
} from "lucide-react";
import { documentProcessor, ProcessingResult } from "@/lib/document-processor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
  onProcessingComplete?: (result: ProcessingResult) => void;
  onFileSelect?: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  result?: ProcessingResult;
  error?: string;
}

export function FileUpload({
  onProcessingComplete,
  onFileSelect,
  maxFiles = 5,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [maxFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      handleFiles(selectedFiles);
    },
    [maxFiles]
  );

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      // Validate file count
      if (files.length + newFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate and add files
      const validFiles: UploadedFile[] = [];
      const errors: string[] = [];

      for (const file of newFiles) {
        const validation = documentProcessor.validateFile(file);

        if (validation.isValid) {
          validFiles.push({
            file,
            id: `${Date.now()}-${Math.random()}`,
            status: "pending",
            progress: 0,
          });
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (errors.length > 0) {
        toast.error(`Some files were rejected:\n${errors.join("\n")}`);
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
        onFileSelect?.(validFiles.map((f) => f.file));
        toast.success(`${validFiles.length} file(s) added for processing`);
      }
    },
    [files.length, maxFiles, onFileSelect]
  );

  const processFile = useCallback(
    async (uploadedFile: UploadedFile) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "processing", progress: 0 }
            : f
        )
      );

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        // Process the document
        const result = await documentProcessor.processDocument(
          uploadedFile.file,
          {
            extractImages: true,
            generateSlides: true,
            preserveFormatting: true,
          }
        );

        clearInterval(progressInterval);

        // Update file status
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status:
                    result.errors && result.errors.length > 0
                      ? "error"
                      : "completed",
                  progress: 100,
                  result,
                  error: result.errors?.[0],
                }
              : f
          )
        );

        if (result.errors && result.errors.length > 0) {
          toast.error(`Processing failed: ${result.errors[0]}`);
        } else {
          toast.success(`Successfully processed ${uploadedFile.file.name}`);
          onProcessingComplete?.(result);
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status: "error",
                  progress: 100,
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                }
              : f
          )
        );
        toast.error(
          `Processing failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [onProcessingComplete]
  );

  const processAllFiles = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");

    if (pendingFiles.length === 0) {
      toast.info("No files to process");
      return;
    }

    setIsProcessing(true);

    try {
      // Process files sequentially to avoid overwhelming the system
      for (const file of pendingFiles) {
        await processFile(file);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [files, processFile]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.info("File removed");
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    toast.info("All files cleared");
  }, []);

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split(".").pop();
    switch (ext) {
      case "pdf":
        return <File className="h-5 w-5 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "md":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "txt":
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "pending":
        return <Upload className="h-4 w-4 text-muted-foreground" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const supportedFormats = documentProcessor.getSupportedFormats();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-muted-foreground mb-4">
              Supported formats: {supportedFormats.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Maximum {maxFiles} files, up to 50MB each
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={supportedFormats.join(",")}
              onChange={handleFileInput}
              className="hidden"
              aria-label="File upload input"
              title="Select files to upload"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || files.length >= maxFiles}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">
                  Files ({files.length}/{maxFiles})
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={processAllFiles}
                    disabled={
                      isProcessing || files.every((f) => f.status !== "pending")
                    }
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Process All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearAllFiles}
                    disabled={isProcessing}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {files.map((uploadedFile) => (
                  <div
                    key={uploadedFile.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    {getFileIcon(uploadedFile.file.name)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {uploadedFile.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(uploadedFile.status)}
                          <Badge
                            variant={
                              uploadedFile.status === "completed"
                                ? "default"
                                : uploadedFile.status === "error"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {uploadedFile.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>

                      {uploadedFile.status === "processing" && (
                        <Progress
                          value={uploadedFile.progress}
                          className="mt-2"
                        />
                      )}

                      {uploadedFile.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {uploadedFile.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {uploadedFile.result && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>
                              {uploadedFile.result.document.sections.length}{" "}
                              sections
                            </span>
                            <span>
                              {uploadedFile.result.document.metadata.wordCount}{" "}
                              words
                            </span>
                            {uploadedFile.result.slides && (
                              <span>
                                {uploadedFile.result.slides.length} slides
                                generated
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => processFile(uploadedFile)}
                          disabled={isProcessing}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}

                      {uploadedFile.status === "completed" &&
                        uploadedFile.result && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onProcessingComplete?.(uploadedFile.result!)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(uploadedFile.id)}
                        disabled={
                          isProcessing && uploadedFile.status === "processing"
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Summary */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {files.filter((f) => f.status === "pending").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {files.filter((f) => f.status === "processing").length}
                </div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {files.filter((f) => f.status === "completed").length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {files.filter((f) => f.status === "error").length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
