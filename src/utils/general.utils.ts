import fs from "fs";

export class GeneralUtils {
  /**
   * Safely stringify a JavaScript value to JSON, with special handling for `bigint`.
   *
   * Behavior:
   *  - Uses `JSON.stringify` internally.
   *  - Replacer:
   *      * Converts bigint values to string (`value.toString()`).
   *      * Leaves non-bigint values unchanged.
   *  - Indentation:
   *      * Controlled by `space` argument (default 2 spaces for pretty-printing).
   *
   * Error handling:
   *  - If `JSON.stringify` throws (e.g., due to circular references),
   *    returns the error’s string representation instead of throwing.
   *
   * @param obj any
   *   Value to stringify (object, array, primitive, etc.).
   *
   * @param space number
   *   Number of spaces used for indentation in the output JSON string.
   *   Defaults to 2.
   *
   * @returns string
   *   JSON string representation of `obj`, or a stringified error on failure.
   */
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

  /**
   * Synchronously read and parse a JSON file from disk.
   *
   * Behavior:
   *  - If `filePath` does not exist:
   *      * Returns `null` (no exception).
   *  - If file exists:
   *      * Reads contents as UTF-8.
   *      * Attempts to parse via `JSON.parse`.
   *      * On success, returns parsed value.
   *      * On parse error, returns `null`.
   *
   * Usage:
   *  - Use this helper when you want a defensive, synchronous JSON read that
   *    won’t crash the process on missing or malformed data.
   *
   * @param filePath string
   *   Absolute or relative path to the JSON file.
   *
   * @returns any
   *   Parsed JSON value, or `null` if file is missing or invalid.
   */
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

  /**
   * Synchronously serialize an object to JSON and write it to disk.
   *
   * Behavior:
   *  - Serializes `data` using `GeneralUtils.stringify` with 2-space indentation.
   *  - Writes the resulting JSON string to `filename` using `fs.writeFileSync`.
   *  - Overwrites the file if it already exists.
   *
   * Error handling:
   *  - Any file system errors (permission denied, ENOSPC, etc.) will propagate
   *    to the caller; wrap the call in try/catch if needed.
   *
   * @param filename string
   *   Target file path for the JSON output.
   *
   * @param data any
   *   Arbitrary data to write (objects, arrays, primitives; bigint-safe).
   */
  static saveToJsonFileSync(filename: string, data: any): void {
    const jsonString = this.stringify(data, 2);
    fs.writeFileSync(filename, jsonString);
  }

  /**
   * Asynchronous sleep / delay helper.
   *
   * Behavior:
   *  - If `milliseconds <= 0`, returns immediately (no delay).
   *  - Otherwise:
   *      * Returns a Promise that resolves after the given milliseconds.
   *      * The resolved value is `1` (arbitrary sentinel).
   *
   * Typical usage:
   *  - `await GeneralUtils.sleep(1000);` // Wait approximately 1 second.
   *
   * Notes:
   *  - This wrapper never rejects; it only resolves or returns early.
   *
   * @param milliseconds number
   *   Duration of the delay in milliseconds.
   *
   * @returns Promise<unknown> | void
   *   A Promise resolving after the delay, or `void` if delay <= 0.
   */
  static async sleep(milliseconds: number) {
    if (milliseconds <= 0) return;
    return new Promise((res) => {
      setTimeout(() => {
        res(1);
      }, milliseconds);
    });
  }
}
