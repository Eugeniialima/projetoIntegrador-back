import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users",(table)=>{
        table.increments("id");
        table.string("name");
        table.string("email");
        table.string("password");
        table.dateTime("created");
        table.dateTime("updated");

        table.primary(["id"]);
        table.unique(["email"]);
    })
    .createTable("posts",(table)=>{
        table.increments("id");
        table.integer("user_id").notNullable();
        table.text("post").notNullable();
        table.datetime("created");
        table.datetime("updated");

        table.primary(["id"]);
        table.foreign("user_id").references("id").inTable("users");
        table.index("user_id");
    })
    .createTable("post_likes",(table)=>{
        table.integer("post_id").primary().notNullable();
        table.integer("user_id").primary().notNullable();
        table.datetime("created");
        table.datetime("updated");

        table.foreign("post_id").references("id").inTable("posts");
        table.foreign("user_id").references("id").inTable("users");
    })
    .createTable("post_comments",(table)=>{
        table.increments("id");
        table.integer("post_id").notNullable();
        table.integer("user_id").notNullable();
        table.text("comment").notNullable();
        table.datetime("created");
        table.datetime("updated");

        table.primary(["id"]);
        table.foreign("post_id").references("id").inTable("posts");
        table.foreign("user_id").references("id").inTable("users");
    })
    .createTable("post_comment_likes",(table)=>{
        table.integer("comment_id").notNullable();
        table.integer("user_id").notNullable();
        table.datetime("created");
        table.datetime("updated");

        table.primary(["comment_id","user_id"]);
        table.foreign("comment_id").references("id").inTable("post_comments");
        table.foreign("user_id").references("id").inTable("users");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists("users")
        .dropTableIfExists("posts")
        .dropTableIfExists("post_likes")
        .dropTableIfExists("post_comments")
        .dropTableIfExists("post_comment_likes")
        ;
}

