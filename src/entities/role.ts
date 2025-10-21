import { PermissionEntity, PermissionProps } from './permission';

export type RoleProps = {
  id?: number;
  name: string;
  description?: string | null;
  permissions?: PermissionProps[];
};

export class RoleEntity {
  constructor(
    public readonly name: string,
    public readonly description: string | null = null,
    public readonly permissions: PermissionEntity[] = [],
    public readonly id?: number,
  ) {}

  static toEntity(data: RoleProps) {
    const id =
      typeof data.id === 'bigint'
        ? Number(data.id)
        : data.id !== undefined
          ? data.id
          : undefined;

    const permissions =
      data.permissions?.map((permission) =>
        PermissionEntity.toEntity(permission),
      ) ?? [];

    return new RoleEntity(data.name, data.description ?? null, permissions, id);
  }
}
