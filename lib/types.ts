export type FileType = 'image' | 'video' | 'pdf';

export type VaultFile = {
  id: string;
  ownerId: string;
  fileUrl: string;
  fileName: string;
  fileType: FileType;
  createdAt: Date;
  expiresAt: Date;
  allowedEmails: string[];
  selfDestructAfterView: boolean;
  selfDestructAfter10Sec: boolean;
  views: number;
};

export type CreateFilePayload = {
  fileUrl: string;
  fileName: string;
  fileType: FileType;
  expiresAt: Date;
  allowedEmails: string[];
  selfDestructAfterView: boolean;
  selfDestructAfter10Sec: boolean;
};
