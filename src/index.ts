import express, { Request, Response }  from 'express';
import cors from 'cors'
import { TCreateUserRequest, TLoginRequest } from './business/models/login-models';
import { LoginService } from './business/Services/login-service';
import { Db } from './database/db';
import { TAddPostModel, TPostDelete, TPostLike } from './business/models/post-models';
import { PostsService } from './business/Services/post-service';
import { PostCommentService } from './business/Services/post-comment-service';
import { IsEmpty } from './core/helpers/string-helpers';
import { TAddPostComment, TCommentLike, TDeleteCommand } from './business/models/post-comments-models';


export const app = express();

app.use(express.json());
app.use(cors());

console.log("migrate...");
 Db.migrate.latest();

 app.listen(3000, function(){
    console.log('Servidor iniciado na porta 3000.');
});

//#region Login

app.post("/login",async (req:Request,res:Response)=>{
    const body=req.body as TLoginRequest;
    const _loginService=new LoginService();

    const resultLogin=await _loginService.login(body.email,body.password);
    if(resultLogin.success)
        res.status(200).send(resultLogin);
    else
        res.status(400).send(resultLogin);
});

app.post("/create-user", async (req:Request,res:Response)=>{
    try {
        
        const body=req.body as TCreateUserRequest;
        const _loginService=new LoginService();

        await _loginService.createNewUser(body.name,body.email,body.password);
        res.status(200).send({message: "Usuario criado."});

    } catch (error:any) {        
        res.status(400).send({message: error.message});
    }
});

//#endregion

app.get("/posts",async (req:Request,res:Response) => {
  try{
    const postService=new PostsService();
    const loginService=new LoginService();

    const userToken=req.header("token");
    if(!userToken?.length){
        res.status(401).send({message: "Não autorizado."});
        return;
    }
    const userId=loginService.getUserIdFromToken(userToken);
    if(!userId)
        throw new Error("Usuário não encontrado.");

    res.status(200).send(await postService.list(userId));
  } catch(error:any) {
    res.status(400).send({message: error.message});
  }
});

app.post("/posts",async (req:Request,res:Response)=>{
    const postService=new PostsService();
    const loginService=new LoginService();

    try{
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }
        const userId=loginService.getUserIdFromToken(userToken);
        if(!userId)
            throw new Error("Usuário não encontrado.");

        const body=req.body as TAddPostModel;
        await postService.add(body.post,userId);

        res.status(200).send({message: "Post incluído."});
    }catch(error:any){
        res.status(400).send({message:error.message});
    }
});

app.delete("/posts",async(req:Request,res:Response)=>{
    const postService=new PostsService();
    const loginService=new LoginService();

    try{
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }
        const userId=loginService.getUserIdFromToken(userToken);
        if(!userId)
            throw new Error("Usuário não encontrado.");

        const body=req.body as TPostDelete;
        await postService.delete(body.postID,userId);

        res.status(200).send({message: "Post apagado."});
    }catch(error:any){
        res.status(400).send({message:error.message});
    }
});

app.put("/posts/like",async(req:Request,res:Response)=>{
    const postService=new PostsService();
    const loginService=new LoginService();

    try{
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }
        const userId=loginService.getUserIdFromToken(userToken);
        if(!userId)
            throw new Error("Usuário não encontrado.");

        const body=req.body as TPostLike;
        await postService.likeOrUnlike(body,userId);

        res.status(200).send({message: "Like/unlike processado."});
    }catch(error:any){
        res.status(400).send({message:error.message});
    }
});

app.get("/post/comments",async(req:Request,res:Response)=>{
    try{
        const postCommentService=new PostCommentService();
    
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }

        const postID=req.query["post_id"]?.toString();
        if(IsEmpty(postID))
            throw new Error("Não foi informado o post.");
    
            res.status(200).send(await postCommentService.list(parseInt( postID!)));
      } catch(error:any) {
        res.status(400).send({message: error.message});
      }
});

app.post("/post/comments",async(req:Request,res:Response)=>{
    try{
        const postCommentService=new PostCommentService();
        const loginService=new LoginService();
    
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }
        const userId=loginService.getUserIdFromToken(userToken);
        if(!userId)
            throw new Error("Usuário não encontrado.");

        const body=req.body as TAddPostComment;
        
        await postCommentService.add(body,userId);
        res.status(200).send({message:"Comment incluído."});
      } catch(error:any) {
        res.status(400).send({message: error.message});
      }    
});

app.delete("/post/comments",async(req:Request,res:Response)=>{
    try{
        const postCommentService=new PostCommentService();
        const loginService=new LoginService();
    
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }
        const userId=loginService.getUserIdFromToken(userToken);
        if(!userId)
            throw new Error("Usuário não encontrado.");

        const body=req.body as TDeleteCommand;
        
        await postCommentService.delete(body.commentID,userId);
        res.status(200).send({message:"Comentário apagado."});
      } catch(error:any) {
        res.status(400).send({message: error.message});
      }

});

app.put("/post/comments/like",async (req:Request,res:Response)=>{
    try{
        const postCommentService=new PostCommentService();
        const loginService=new LoginService();
    
        const userToken=req.header("token");
        if(!userToken?.length){
            res.status(401).send({message: "Não autorizado."});
            return;
        }
        const userId=loginService.getUserIdFromToken(userToken);
        if(!userId)
            throw new Error("Usuário não encontrado.");

        const body=req.body as TCommentLike;
        
        await postCommentService.likeOrUnlike(body,userId);
        res.status(200).send({message:"Like/unlike processado."});
      } catch(error:any) {
        res.status(400).send({message: error.message});
      }
});

app.get("/test", (req:Request,res:Response)=>{
    res.status(200).send({message:"No ar tchê!!!"});
});