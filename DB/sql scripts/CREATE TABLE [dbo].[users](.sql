-- CREATE TABLE [dbo].[users](
-- 	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
-- 	[username] [varchar](30) NOT NULL UNIQUE,
-- 	[password] [varchar](300) NOT NULL
-- )

CREATE TABLE [dbo].[users]
(
	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[firstName] [varchar](30) NOT NULL ,
	[lastName] [varchar](30) NOT NULL ,
	[country] [varchar](30) NOT NULL ,
	[password] [varchar](300) NOT NULL,
	[email] [varchar](30) NOT NULL UNIQUE,
	[profileImage] [varchar](300)
)

