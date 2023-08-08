"use client";

import { Menu } from "@/components/container";
import { useTheme } from "next-themes";

export const PageTopMenu = () => {
  const { setTheme } = useTheme();
  return (
    <Menu
      items={[
        {
          label: "Admin Panel",
          subItems: [
            {
              label: "Radio",
              shortcut: "⌘1",
            },
            {
              label: "Music",
              shortcut: "⌘2",
              disabled: true,
            },
            {
              label: "Quit Music",
              shortcut: "⌘Q",
            },
            {
              label: "Theme",
              items: [
                {
                  label: "Dark",
                  shortcut: "⌘D",
                  onClick: () => setTheme("dark"),
                },
                {
                  label: "Light",
                  shortcut: "⌘L",
                  onClick: () => setTheme("light"),
                },
              ],
            },
            {
              label: "New",
              items: [
                {
                  label: "Playlist",
                  shortcut: "⌘N",
                },
              ],
            },
          ],
        },
        {
          label: "Options",
          checkbox: true,
          subItems: [
            {
              label: "Show Mini Player",
            },
            {
              label: "Lyrics?",
              isChecked: true,
            },
          ],
        },
      ]}
    />
  );
};
