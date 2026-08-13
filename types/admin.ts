export interface AdminSummary {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
  deactivatedAt: string | null;
}

export interface InviteAdminInput {
  email: string;
}

export interface AcceptAdminInvitationInput {
  token: string;
  name: string;
  password: string;
}
