import { PermissionEntity, PermissionProps } from './permission';
import { RoleEntity, RoleProps } from './role';

export type AuthUserProps = {
  id: number | bigint;
  personId: number | bigint;
  email: string;
  passwordHash: string;
  isActive: boolean;
  permissions?: PermissionProps[];
  roles?: RoleProps[];
};

export class AuthUserEntity {
  constructor(
    public readonly id: number,
    public readonly personId: number,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly isActive: boolean,
    public readonly permissions: PermissionEntity[] = [],
    public readonly roles: RoleEntity[] = [],
  ) {}

  static toEntity(data: AuthUserProps) {
    const id = typeof data.id === 'bigint' ? Number(data.id) : data.id;
    const personId =
      typeof data.personId === 'bigint'
        ? Number(data.personId)
        : data.personId;

    const permissions =
      data.permissions?.map((permission) =>
        PermissionEntity.toEntity(permission),
      ) ?? [];

    const roles =
      data.roles?.map((role) => RoleEntity.toEntity(role)) ?? [];

    return new AuthUserEntity(
      id,
      personId,
      data.email,
      data.passwordHash,
      data.isActive,
      permissions,
      roles,
    );
  }

  public toSafeDTO() {
    return {
      id: this.id,
      email: this.email,
      roles: this.roles.map((role) => role.name),
      permissions: this.permissions.map((permission) => permission.name),
    };
  }
}
