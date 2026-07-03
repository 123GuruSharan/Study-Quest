import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const environmentsDir = path.join(process.cwd(), "public", "focus", "environments");
    
    if (!fs.existsSync(environmentsDir)) {
      return NextResponse.json([]);
    }

    const folders = fs.readdirSync(environmentsDir);
    const configs = [];

    for (const folder of folders) {
      const folderPath = path.join(environmentsDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const configPath = path.join(folderPath, "config.json");
        if (fs.existsSync(configPath)) {
          try {
            const fileContent = fs.readFileSync(configPath, "utf-8");
            if (fileContent.trim()) {
              const config = JSON.parse(fileContent);
              configs.push(config);
            }
          } catch (e) {
            console.error(`Error parsing config.json in folder ${folder}:`, e);
          }
        }
      }
    }

    return NextResponse.json(configs);
  } catch (error) {
    console.error("Error loading focus environments:", error);
    return NextResponse.json({ error: "Failed to load environments" }, { status: 500 });
  }
}
