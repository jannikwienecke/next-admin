
DROP TABLE "public"."ITaskTag";
DROP TABLE "public"."ITask";
DROP TABLE "public"."IProject";
DROP TABLE "public"."IStatus";
DROP TABLE "public"."ITag";


CREATE TABLE "public"."IStatus" (
    "id" SERIAL,
    "label" text  NOT NULL ,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."IProject" (
    "id" SERIAL,
    "name" text  NOT NULL ,
    "description" text,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."ITask" (
    "id" SERIAL,
    "title" text  NOT NULL ,
    "description" text,
    "statusId" integer  NOT NULL ,
    "projectId" integer  NOT NULL ,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("statusId") REFERENCES "public"."IStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "public"."IProject"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "public"."ITag" (
    "id" SERIAL,
    "label" text  NOT NULL ,
    PRIMARY KEY ("id")
);


CREATE TABLE "public"."ITaskTag" (
    "id" SERIAL,
    "tagId" integer  NOT NULL ,
    "taskId" integer  NOT NULL ,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("tagId") REFERENCES "public"."ITag"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("taskId") REFERENCES "public"."ITask"("id") ON DELETE CASCADE ON UPDATE CASCADE
);






CREATE UNIQUE INDEX "TaskTag_tagId_taskId" ON "public"."ITaskTag"("tagId","taskId");


-- -- 
--   "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- add fields date_created and date_modified to all tables
ALTER TABLE "public"."IStatus" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."IStatus" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."IProject" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."IProject" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."ITask" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."ITask" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."ITag" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."ITag" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
