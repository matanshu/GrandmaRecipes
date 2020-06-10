CREATE TABLE [dbo].[myRecipes]
(
    [user_id] [varchar](50) NOT NULL,
    [recipe_id] [varchar](50) NOT NULL,
    [image] [varchar](100) NOT NULL ,
    [title] [varchar](100) NOT NULL ,
    [readyInMinutes][int] NOT NULL ,
    [aggregateLikes][int] NOT NULL ,
    [vegan] [Bit] NOT NULL ,
    [vegetarian] [Bit] NOT NULL ,
    [glutenFree] [Bit] NOT NULL,
    [ingerdients] [varchar](1500) NOT NULL,
    [instructions] [varchar](1500) NOT NULL,
    [servings] [int],
    PRIMARY KEY (user_id, recipe_id)
)
