
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
INSERT INTO "public"."IProject" ("name", "description") VALUES ('Builduing a new House', 'We want to create a new house');
INSERT INTO "public"."IProject" ("name", "description") VALUES ('Create website for client', 'Website with React and Prisma');
INSERT INTO "public"."IProject" ("name", "description") VALUES ('Win Mr Olympia', 'Win Bodybuilding Competition');

-- create 3 statuses
INSERT INTO "public"."IStatus" ("label") VALUES ('To Do');
INSERT INTO "public"."IStatus" ("label") VALUES ('In Progress');
INSERT INTO "public"."IStatus" ("label") VALUES ('Done');

-- create 3 tags
INSERT INTO "public"."ITag" ("label") VALUES ('Fun');
INSERT INTO "public"."ITag" ("label") VALUES ('Gym');
INSERT INTO "public"."ITag" ("label") VALUES ('Learning');

INSERT INTO "public"."ITask" ("id", "title", "description", "statusId", "projectId") VALUES (100, 'Buy material for the house', 'A lot of stuff for the house', 1, 1);
INSERT INTO "public"."ITask" ("id","title", "description", "statusId", "projectId") VALUES (101, 'Create the design of the website', 'Use Figma for designing the mvp', 1, 2);
INSERT INTO "public"."ITask" ("id","title", "description", "statusId", "projectId") VALUES (102, 'Create the backend of the website', 'With Remix build out backend', 1, 2);
INSERT INTO "public"."ITask" ("id","title", "description", "statusId", "projectId") VALUES (103, 'Buy food for the competition', 'A lot of protein and MEAT', 1, 3);
INSERT INTO "public"."ITask" ("id","title", "description", "statusId", "projectId") VALUES (104, 'Train for the competition', 'Go train 8 times a week', 1, 3);


-- create 3 task tags
INSERT INTO "public"."ITaskTag" ("tagId", "taskId") VALUES (1, 1);
INSERT INTO "public"."ITaskTag" ("tagId", "taskId") VALUES (2, 2);
INSERT INTO "public"."ITaskTag" ("tagId", "taskId") VALUES (2, 3);