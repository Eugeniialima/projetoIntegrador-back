export type TLoginResponse={
    success:boolean;
    name:string|undefined;
    token:string|undefined;
    message:string|undefined;
}

export type TLoginRequest={
    email:string|undefined,
    password:string|undefined
}

export type TCreateUserRequest={
    name:string|undefined,
    email:string|undefined,
    password:string|undefined
}