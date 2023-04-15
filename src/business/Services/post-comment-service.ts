import { TCommentLikeDataModel } from "../data-models/comment-like-model";
import { TCommentDataModel } from "../data-models/comment-model";
import { TAddPostComment, TCommentLike, TPostComment } from "../models/post-comments-models";
import { PostCommentRepository } from "../repositories/post-comment-repository";
import { PostRepository } from "../repositories/post-repository";
import { UserRepository } from "../repositories/user-repository";

export class PostCommentService{
    readonly _postRepository=new PostRepository();
    readonly _userRepository=new UserRepository();
    readonly _postCommentRepository=new PostCommentRepository();

    async list(postID:number):Promise<Array<TPostComment>>{
        const comments=await this._postCommentRepository.list(postID);
        const result=new Array<TPostComment>();

        for (const key in comments) {
            const element = comments[key];
            const totalLikes=await this._postCommentRepository.likes(element.id!);
            const userLiked=await this._postCommentRepository.userLiked(element.id!, element.userID);

            result.push({id:element.id,
                comment:element.comment,
                postID:element.postID,
                userID:element.userID,
                totalLikes:totalLikes,
                userLiked:userLiked,
                published:new Date(element.created)} as TPostComment)
        }

        return result;
    }

    async add(data:TAddPostComment, userID:number):Promise<void>{
        const post=await this._postRepository.get(data.postID);
        if(!post)
            throw new Error("Post não localizado.");

        const user=await this._userRepository.get(userID);
        if (!user)
            throw new Error("Usuário não localizado.");

        const dataModel={
            comment:data.comment,
            userID:userID,
            postID:data.postID,
            created:Date.now()
        } as TCommentDataModel;

        await this._postCommentRepository.add(dataModel);
    }

    async likeOrUnlike(comment:TCommentLike, userID:number):Promise<void>{
        const postComment=await this._postCommentRepository.get(comment.commentID);
        if(!postComment)
            throw new Error("O comentário não foi localizado.");

        const user=await this._userRepository.get(userID);
        if(!user)
            throw new Error("O usuário não foi localizado.");
            
        const data={
            commentID:comment.commentID,
            userID:userID,
            created:Date.now()
        } as TCommentLikeDataModel;

        const liked=await this._postCommentRepository.liked(data);
        if(liked){
            await this._postCommentRepository.unlike(data);
            return;
        }

        await this._postCommentRepository.like(data);
    }

    async delete(commentID:number,userID:number):Promise<void>{
        const user=await this._userRepository.get(userID);
        if (!user)
            throw new Error("Usuário não localizado.");

        const comment=await this._postCommentRepository.get(commentID);
        if(!comment)
            throw new Error("Comentário não localizado.");

        if(comment.userID!=userID)
            throw new Error("Este comentário não é seu.");

        this._postCommentRepository.delete(commentID);
    }
}