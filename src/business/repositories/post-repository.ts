import { Db } from "../../database/db";
import { TPostLikeDataModel } from "../data-models/post-like-model";
import { TPostDataModel } from "../data-models/post-model";
import { PostCommentRepository } from "./post-comment-repository";

export class PostRepository{
    readonly _postTableName="posts";
    readonly _likeTableName="post_likes";
    readonly _postCommentsRepository=new PostCommentRepository();

    async list(userId:number):Promise<Array<TPostDataModel>>{
        return await Db<TPostDataModel>(this._postTableName)
            .where("user_id","=",userId)
            .select(["id","user_id as userID","post","created","updated"]);
    }

    async get(postID:number):Promise<TPostDataModel>{
        return await Db<TPostDataModel>(this._postTableName)
            .where("id","=",postID)
            .select(["id","user_id as userID","post","created","updated"])
            .first<TPostDataModel>();
    }

    async add(post:TPostDataModel):Promise<void>{
        await Db(this._postTableName)
            .insert({
                user_id:post.userID,
                post:post.post,
                created:post.created
            });
    }

    async delete(postID:number):Promise<void>{
        await Db(this._likeTableName)
            .where("post_id","=",postID)
            .del();

        await Db(this._postTableName)
            .where("id","=",postID)
            .del();
    }

    async like(data:TPostLikeDataModel):Promise<void>{
        await Db(this._likeTableName).insert({
            post_id:data.postID,
            user_id:data.userID,
            created:data.created,
            updated:data.updated
        });
    };

    async unlike(data:TPostLikeDataModel):Promise<void>{
        await Db(this._likeTableName)
            .where("post_id","=",data.postID)
            .where("user_id","=",data.userID)
            .del();
    }

    async liked(data:TPostLikeDataModel):Promise<boolean>{
        const like=await Db(this._likeTableName)
            .where("post_id","=",data.postID)
            .where("user_id","=",data.userID)
            .first();

            return like;
    }

    async likes(postID:number):Promise<number>{
        const count= await Db(this._likeTableName)
            .where("post_id","=",postID)
            .count("* as q");

        return parseInt(count[0]["q"].toString());
    }

    async userLiked(postID:number,userID:number):Promise<boolean>{
        const achou= await Db<number>(this._likeTableName)
            .where("post_id","=",postID)
            .where("user_id","=",userID)
            .select(["user_id"]);
        return achou.length>0;
    }
}