export type PermissionProps = {
  id?: number;
  name: string;
  description?: string | null;
};

export class PermissionEntity {
  constructor(
    public readonly name: string,
    public readonly description: string | null = null,
    public readonly id?: number,
  ) {}

  static toEntity(data: PermissionProps) {
    const id =
      typeof data.id === 'bigint'
        ? Number(data.id)
        : data.id !== undefined
          ? data.id
          : undefined;

    return new PermissionEntity(data.name, data.description ?? null, id);
  }
}
