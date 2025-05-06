export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'HOST' | 'ADMIN';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  category: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  hostId: string;
  images: string[];
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  activityId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  location: string;
  price: number;
  category: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
}

export interface CreateReviewRequest {
  activityId: string;
  rating: number;
  comment: string;
} 