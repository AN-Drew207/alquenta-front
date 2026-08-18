export interface AdminSummary {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  planId: string | null;
  createdAt: string;
  deactivatedAt: string | null;
  isVerified: boolean;
}

export interface InviteAdminInput {
  email: string;
  planId: string;
}

export interface AcceptAdminInvitationInput {
  token: string;
  name: string;
  password: string;
}
