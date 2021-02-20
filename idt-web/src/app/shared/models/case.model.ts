import { Company } from './company.model';
import { User } from './user.model';

export const CASE_TYPES: CaseType[] = [
  { id: '0', name: 'Product Launch' },
  { id: '1', name: 'Internal Initiative' },
  { id: '2', name: 'Founding/Carve Out' },
  { id: '3', name: 'Cooperation' },
  { id: '4', name: 'Other' }
  ];

export interface CaseType {
  id: string;
  name: string;
}

export interface Technology {
  id: string;
  name: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  featured: boolean;
  technologies: Technology[];
  url: string;
  caseType: number;
  disabled: boolean;
  createdAt: string;
  createdBy: User;
  company: Company;
  modifiedAt: string;
  modifiedBy?: User;
}

export enum SourceType {
  File,
  Url
}

export interface Source {
  id: string;
  title: string;
  description: string;
  url: string;
  file: any;
}

export const SOURCE_ICONS = [
    // Media
    {contentType: 'image', icon: 'image'},
    {contentType: 'audio', icon: 'audio'},
    {contentType: 'video', icon: 'video'},
  // Documents
    {contentType: 'application/pdf', icon: 'pdf'},
    {contentType: 'application/msword', icon: 'docx'},
    {contentType: 'application/vnd.ms-word', icon: 'docx'},
    {contentType: 'application/vnd.oasis.opendocument.text', icon: 'docx'},
    {contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml', icon: 'docx'},
    {contentType: 'application/vnd.ms-excel', icon: 'xlsx'},
    {contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml', icon: 'xlsx'},
    {contentType: 'application/vnd.oasis.opendocument.spreadsheet', icon: 'xlsx'},
    {contentType: 'application/vnd.ms-powerpoint', icon: 'ppt'},
    {contentType: 'application/vnd.openxmlformats-officedocument.presentationml', icon: 'ppt'},
    {contentType: 'application/vnd.oasis.opendocument.presentation', icon: 'ppt'},
    {contentType: 'text/plain', icon: 'file'},
    {contentType: 'text/html', icon: 'html'},
    {contentType: 'application/json', icon: 'code'},
  // Archives
    {contentType: 'application/gzip', icon: 'zip'},
    {contentType: 'application/zip', icon: 'zip'}
  ];

export interface Comment {
  id: number;
  createdBy: User;
  comment: string;
  createdAt: string;
}
