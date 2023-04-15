import { IsEmpty } from "../../core/helpers/string-helpers";
import { Db } from "../../database/db";
import { TUserDataModel } from "../data-models/user-model";

export class UserRepository{
    readonly _tableName="users";

    async getByEmail(email:string):Promise<TUserDataModel|undefined> {
        return await Db(this._tableName)
            .where("email","=",email)
            .first<TUserDataModel>();
    }

    async get(id:number):Promise<TUserDataModel|undefined>{
        return await Db(this._tableName)
            .where("id","=",id)
            .first<TUserDataModel>();
    }

    async add(user:TUserDataModel):Promise<void>{
        this._canValid(user);
        user.email=user.email.toLowerCase();

        const _exists=await this.getByEmail(user.email);
        if(_exists!==undefined)
            throw Error(`O e-mail ${user.email} já está sendo utilizado por outro usuário` );
        
        await Db(this._tableName).insert(user);
    }

    async update(user:TUserDataModel):Promise<void>{
        this._canValid(user);

        const _exists=await Db(this._tableName)
            .where({email:user.email})
            .whereNot({id:user.id})
            .first<TUserDataModel>();
        if(_exists!==undefined)
            throw Error(`O e-mail ${user.email} já está sendo utilizado por outro usuário` );

            Db(this._tableName).update(user);
    }

    _canValid(user:TUserDataModel){
        if(IsEmpty(user.name))
            throw Error("O nome do usuário deve ser informado.");
        if(IsEmpty(user.email))
            throw Error("O e-mail do usuário deve ser informado.");
        if(IsEmpty(user.password))
            throw Error("A senha do usuário deve ser informada.");
    }
}