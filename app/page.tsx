// import { prisma } from "./db";

export default async function Home() {
  const colors = [{ name: "Red", id: 1 }]; // await prisma.color.findMany({});

  return (
    <main>
      <h1>Colors</h1>
      <ul>
        {colors.map((color) => (
          <li
            style={{
              color: color.name,
            }}
            key={color.id}
          >
            {color.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
