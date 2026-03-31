// Role-based access control (RBAC)
import { requireAuth } from './02-session-validation';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum Permission {
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  READ_CONTENT = 'read:content',
  WRITE_CONTENT = 'write:content',
  DELETE_CONTENT = 'delete:content',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ_CONTENT],
  [Role.MODERATOR]: [
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.READ_USERS,
  ],
  [Role.ADMIN]: Object.values(Permission),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  const userRole = session.role as Role;
  
  if (!hasPermission(userRole, permission)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireAuth();
  
  if (session.role !== role) {
    throw new Error('Forbidden: Invalid role');
  }
  
  return session;
}
