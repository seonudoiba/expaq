export interface Role {
  id: string;
  name: "HOST" | "GUEST" | "ADMIN";
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  userName: string;
  lastName: string;
  roles: Role[];
  verified: boolean;
  active: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date string
}

export interface SortInfo {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedUsersResponse {
  content: UserProfile[];
  pageable: PageableInfo;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number; // current page number
  sort: SortInfo;
  empty: boolean;
}
