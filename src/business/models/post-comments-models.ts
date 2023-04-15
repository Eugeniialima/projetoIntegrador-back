export type TPostComment={
    id:number,
    comment:string,
    postID:number,
    userID:number,
    totalLikes:number,
    userLiked:boolean,
    published:Date
}

export type TAddPostComment={
    comment:string,
    postID:number
}

export type TCommentLike={
    commentID:number
}

export type TDeleteCommand={
    commentID:number
}