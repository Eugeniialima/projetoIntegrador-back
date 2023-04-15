import { IsEmpty } from "../../core/helpers/string-helpers";
import { TPostLikeDataModel } from "../data-models/post-like-model";
import { TPostDataModel } from "../data-models/post-model";
import { TPost, TPostLike } from "../models/post-models";
import { PostCommentRepository } from "../repositories/post-comment-repository";
import { PostRepository } from "../repositories/post-repository";
import { UserRepository } from "../repositories/user-repository";

export class PostsService{
    readonly _postRepository=new PostRepository();
    readonly _userRepository=new UserRepository();
    readonly _postCommentsRepository=new PostCommentRepository();

    async list(userID:number):Promise<Array<TPost>>{
        const posts=await this._postRepository.list(userID);
        const result=new Array<TPost>();
        
        for (const key in posts) {
            const element=posts[key];
            const totalLikes=await this._postRepository.likes(element.id!);
            const userLiked=await this._postRepository.userLiked(element.id!, userID);
            
            result.push({
                id:element.id,
                userID:element.userID,
                text:element.post,
                published:new Date(element.created),
                totalComments:0,
                totalLikes:totalLikes,
                userLiked:userLiked
                } as TPost);
        }

        return result;
    }

    async add(post:string, userID:number):Promise<void>{
        if(IsEmpty(post) )
            throw new Error("O texto do post deve ser informado.");

        const user=await this._userRepository.get(userID);
        if(!user)
            throw new Error("Usuário não localizado.");

        const dataModel={
            post:post,
            userID:userID,
            created:Date.now()
        } as TPostDataModel;
        await this._postRepository.add(dataModel);
    }

    async delete(postID:number,userID:number):Promise<void>{
        const post=await this._postRepository.get(postID);
        if(!post)
            throw new Error("O post não foi localizado.");

        if(post.userID!=userID)
            throw new Error("Este post não pertence a você.");

        await this._postCommentsRepository.deleteByPost(postID);
        await this._postRepository.delete(postID);
    };

    async likeOrUnlike(post:TPostLike,userID:number):Promise<void>{
        const user=await this._userRepository.get(userID);
        if(!user)
            throw new Error("Usuário não localizado.");

        const data={
            postID:post.postID,
            userID:userID,
            created:Date.now()
        } as TPostLikeDataModel;

        const liked=await this._postRepository.liked(data);
        if(liked){
            await this._postRepository.unlike(data);
            return;
        }

        await this._postRepository.like(data);
    }
}