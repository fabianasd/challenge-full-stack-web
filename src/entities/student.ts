
export type StudenEntityParams = {
    name: string,
    email: string,
    document: string,
    ra: string
};

export class StudenEntity {
    private _name: string;
    private _email: string;
    private _document: string;
    private _ra: string;

    constructor(params: StudenEntityParams) {
        this._name = params.name;
        this._email = params.email;
        this._document = params.document;
        this._ra = params.ra;
    }

    get name(): string {
        return this._name;
    }
    get email(): string {
        return this._email;
    }
    get document(): string {
        return this._document;
    }
    get ra(): string {
        return this._ra;
    }


}