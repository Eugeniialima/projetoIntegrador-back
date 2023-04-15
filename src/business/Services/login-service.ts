import { decodeBase64, encodeBase64 } from "../../core/helpers/base64-helpers";
import { TLoginResponse } from "../models/login-models";
import { UserRepository } from "../repositories/user-repository";
import { IsEmpty } from "../../core/helpers/string-helpers";
import { TUserDataModel } from "../data-models/user-model";
import HashPassword from "../../core/cryptography/crypto";

export class LoginService{
    readonly _userRepository=new UserRepository();

    async login(email:string|undefined,password:string|undefined):Promise<TLoginResponse>{
        if(IsEmpty(email)||IsEmpty(password))
            return {
                success:false,
                message: "Usuário e senha devem ser informados."
            } as TLoginResponse;
    
        const user=await this._userRepository.getByEmail(email!);
       
        if(user==undefined||HashPassword(password!)!==user.password)
            return {
                name:undefined,
                success:false,
                token:undefined,
                message:"Usuário ou senha inválidos."
            };

        return {
            success:true, 
            name:user.name,
            token:this._makeToken(user),
             message:undefined};
        }

    async createNewUser(name:string|undefined,email:string|undefined,password:string|undefined):Promise<void>{
        const user= {
            name:name!,
            email:email!,
            password:HashPassword(password!),
            created:Date.now()
        } as TUserDataModel;

        await this._userRepository.add(user);
    }

    _makeToken(user:TUserDataModel):string{
        const dataToken=JSON.stringify({id:user.id,name:user.name,email:user.email});
        return encodeBase64(dataToken);
    }

    getUserIdFromToken(token:string):number|undefined{
        const json=JSON.parse(decodeBase64( token));
        return json.id;
    }
}