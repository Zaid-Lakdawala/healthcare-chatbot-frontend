export interface UploadedDocument {
  document_id: string;
  filename: string;
  file_size?: number;
  chunk_count: number;
}

export interface IUploadResponse {
  success: boolean;
  message: string;
  documents?: UploadedDocument[];
}

export interface IDocumentsResponse {
  success: boolean;
  documents: UploadedDocument[];
}

export interface IDeleteDocumentResponse {
  success: boolean;
  message: string;
}
