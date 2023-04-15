import { Db } from "../../database/db";
import { TCommentLikeDataModel } from "../data-models/comment-like-model";
import { TCommentDataModel } from "../data-models/comment-model";

export class PostCommentRepository{
    readonly _commentTableName="post_comments";
    readonly _likeCommentTableName="post_comment_likes";

    async list(postID:number):Promise<Array<TCommentDataModel>>{
        return await Db<TCommentDataModel>(this._commentTableName)
            .where("post_id","=",postID)
            .select(["id","post_id as postID","user_id as userID","comment","created","updated"]);
    }

    async get(commentID:number):Promise<TCommentDataModel>{
        return await Db(this._commentTableName)
            .where("id","=",commentID)
            .select(["id","post_id as postID","user_id as userID","comment","created","updated"])
            .first<TCommentDataModel>();
    }

    async add(data:TCommentDataModel):Promise<void>{
        await Db(this._commentTableName)
            .insert({
                id:data.id,
                post_id:data.postID,
                user_id:data.userID,
                comment:data.comment,
                created:data.created,
                updated:data.updated
            });
    }

    async like(data:TCommentLikeDataModel):Promise<void>{
        await Db(this._likeCommentTableName).insert({
            comment_id:data.commentID,
            user_id:data.userID,
            created:data.created,
            updated:data.updated
        });
    };

    async unlike(data:TCommentLikeDataModel):Promise<void>{
        await Db(this._likeCommentTableName)
            .where("comment_id","=",data.commentID)
            .where("user_id","=",data.userID)
            .del();
    }

    async liked(data:TCommentLikeDataModel):Promise<boolean>{
        const like=await Db(this._likeCommentTableName)
            .where("comment_id","=",data.commentID)
            .where("user_id","=",data.userID)
            .first();

            return like;
    }    

    async delete(commentID:number):Promise<void>{
        await Db(this._likeCommentTableName)
            .where("comment_id","=",commentID)
            .del();

        await Db(this._commentTableName)
            .where("id","=",commentID)
            .del();
    }

    async deleteByPost(postID:number):Promise<void>{
        const comments=await this.list(postID);
        for (const key in comments) {
            const element = comments[key];

            this.delete(element.id!);
        }
    }

    async likes(commentID:number):Promise<number>{
        const count= await Db(this._likeCommentTableName)
            .where("comment_id","=",commentID)
            .count("* as q");

        return parseInt(count[0]["q"].toString());
    }

    async userLiked(commentID:number,userID:number):Promise<boolean>{
        const achou= await Db<number>(this._likeCommentTableName)
        .where("comment_id","=",commentID)
        .where("user_id","=",userID)
        .select(["user_id"]);
    return achou.length>0;
    }
}