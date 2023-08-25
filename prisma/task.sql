
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


ALTER TABLE "public"."IStatus" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."IStatus" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."IProject" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."IProject" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."ITask" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."ITask" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."ITag" ADD COLUMN "date_created" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."ITag" ADD COLUMN "date_modified" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- create 3 projects
INSERT INTO "public"."IProject" ("name", "description") VALUES ('Project 1', 'This is the first project');
INSERT INTO "public"."IProject" ("name", "description") VALUES ('Project 2', 'This is the second project');
INSERT INTO "public"."IProject" ("name", "description") VALUES ('Project 3', 'This is the third project');

-- create 3 statuses
INSERT INTO "public"."IStatus" ("label") VALUES ('To Do');
INSERT INTO "public"."IStatus" ("label") VALUES ('In Progress');
INSERT INTO "public"."IStatus" ("label") VALUES ('Done');

-- create 3 tags
INSERT INTO "public"."ITag" ("label") VALUES ('Tag 1');
INSERT INTO "public"."ITag" ("label") VALUES ('Tag 2');
INSERT INTO "public"."ITag" ("label") VALUES ('Tag 3');

-- create 3 tasks
INSERT INTO "public"."ITask" ("title", "description", "statusId", "projectId") VALUES ('Task 1', 'This is the first task', 1, 1);
INSERT INTO "public"."ITask" ("title", "description", "statusId", "projectId") VALUES ('Task 2', 'This is the second task', 2, 2);
INSERT INTO "public"."ITask" ("title", "description", "statusId", "projectId") VALUES ('Task 3', 'This is the third task', 3, 3);

-- create 3 task tags
INSERT INTO "public"."ITaskTag" ("tagId", "taskId") VALUES (1, 1);
INSERT INTO "public"."ITaskTag" ("tagId", "taskId") VALUES (2, 2);
INSERT INTO "public"."ITaskTag" ("tagId", "taskId") VALUES (2, 3);