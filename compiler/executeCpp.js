import { exec } from "child_process";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

/*
 * Helper responsible for compiling/executing code in C++, Python, or Java.
 *
 * How it works:
 * 1. For C++, compiles and runs the binary.
 * 2. For Python, directly runs the script.
 * 3. For Java, compiles and runs the class.
 */

export const executeCode = (filepath, language) => {
    const jobId = path.basename(filepath).split(".")[0];
    let command;

    if (language === "cpp") {
        const outPath = path.join(outputPath, `${jobId}.exe`);
        command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\${jobId}.exe`;
    } else if (language === "python") {
        command = `python "${filepath}"`;
    } else if (language === "java") {
        const dir = path.dirname(filepath);
        const filename = path.basename(filepath, ".java");
        command = `javac "${filepath}" && cd "${dir}" && java ${filename}`;
    } else {
        throw new Error("Unsupported language");
    }

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) return reject({ error, stderr });
            if (stderr) return reject(stderr);
            resolve(stdout);
        });
    });
};