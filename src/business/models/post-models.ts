export type TAddPostModel={
    post:string
}

export type TPost={
    id:number,
    text:string,
    userID:number,
    totalLikes:number,
    totalComments:number,
    userLiked:boolean,
    published:Date
}

export type TPostLike={
    postID:number;
}

export type TPostDelete={
    postID:number;
}