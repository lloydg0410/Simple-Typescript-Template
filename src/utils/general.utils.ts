import fs from "fs";

export class GeneralUtils {
  static stringify(obj: any, space: number = 2): string {
    try {
      return JSON.stringify(
        obj,
        (_key, value) => (typeof value === "bigint" ? value.toString() : value),
        space
      );
    } catch (err) {
      return `${err}`;
    }
  }

  static readFromJsonFileSync(filePath: string): any {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    try {
      return JSON.parse(fileContent);
    } catch (err) {
      return null;
    }
  }

  static saveToJsonFileSync(filename: string, data: any): void {
    const jsonString = this.stringify(data, 2);
    fs.writeFileSync(filename, jsonString);
  }

  static async sleep(milliseconds: number) {
    if (milliseconds <= 0) return;
    return new Promise((res) => {
      setTimeout(() => {
        res(1);
      }, milliseconds);
    });
  }
}
