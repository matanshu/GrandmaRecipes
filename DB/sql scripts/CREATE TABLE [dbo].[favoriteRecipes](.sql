CREATE TABLE [dbo].[favoriteRecipes]
(
    [user_id] [varchar](50) NOT NULL ,
    [recipe_id] [varchar](50) NOT NULL,
    PRIMARY KEY (recipe_id, user_id)
    -- FOREIGN KEY (user_id) REFERENCES [dbo].[users](user_id)
    --user_id
)