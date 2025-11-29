export enum UserRole {
  AUTHOR = 'AUTHOR',
  REVIEWER = 'REVIEWER',
  CHAIR = 'CHAIR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export enum PaperStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  track: string;
  status: PaperStatus;
  submittedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  reviewerId: string;
  paperId: string;
  score: number;
  comments: string;
  pros: string[];
  cons: string[];
}

export interface ConferenceSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: string;
  paperIds: string[];
  day: string;
}

export interface StatData {
  name: string;
  value: number;
}