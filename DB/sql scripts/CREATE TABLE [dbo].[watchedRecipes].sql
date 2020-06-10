CREATE TABLE [dbo].[watchRecipes]
(
    [user_id] [varchar](50) NOT NULL ,
    [recipe_id] [varchar](50) NOT NULL,
    PRIMARY KEY (recipe_id, user_id)
)