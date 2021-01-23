-- CREATE TABLE [dbo].[recipes]
-- (
-- 	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
-- 	[author] [UNIQUEIDENTIFIER] NOT NULL,
-- 	[recipe_name] [varchar](300) NOT NULL,
-- 	PRIMARY KEY (author, recipe_name),
-- 	FOREIGN KEY (author) REFERENCES users(user_id)
-- )

-- CREATE TABLE [dbo].[familyRecipes]
-- (
-- 	[id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
-- 	[image] [varchar](50) NOT NULL ,
-- 	[title] [varchar](50) NOT NULL ,
-- 	[readyInMinutes][int] NOT NULL ,
-- 	[aggregateLikes][int] NOT NULL ,
-- 	[vegan] [Bit] NOT NULL ,
-- 	[vegetarian] [Bit] NOT NULL ,
-- 	[glutenFree] [Bit] NOT NULL,
-- 	[ingerdients] [varchar](300) NOT NULL,
-- 	[instructions] [varchar](1000) NOT NULL,
-- 	[servings] [int]
-- )

CREATE TABLE [dbo].[familyRecipes]
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