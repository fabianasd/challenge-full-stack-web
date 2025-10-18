export type StudentEntityParams = {
  name: string;
  email: string;
  document: string;
  ra: string;
};

export class StudentEntity {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly document: string,
    public readonly ra: string,
  ) {}
}
