const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

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

const executeCpp = (filepath, language = "cpp", input = "") => {
    const jobId = path.basename(filepath).split(".")[0];
    let compileCommand, runCommand, runArgs, runCwd;
    let javaRenamedFile = null;

    if (language === "cpp") {
        const outPath = path.join(outputPath, `${jobId}.exe`);
        compileCommand = `g++ "${filepath}" -o "${outPath}"`;
        runCommand = outPath;
        runArgs = [];
        runCwd = outputPath;
    } else if (language === "python") {
        compileCommand = null;
        runCommand = "python";
        runArgs = [filepath];
        runCwd = undefined;
    } else if (language === "java") {
        // Read the file and extract the public class name
        const fileContent = fs.readFileSync(filepath, "utf8");
        const classMatch = fileContent.match(/public\s+class\s+(\w+)/);
        if (!classMatch) {
            throw new Error("Could not find public class name in Java file");
        }
        const className = classMatch[1];
        const dir = path.dirname(filepath);
        const newJavaPath = path.join(dir, `${className}.java`);
        if (path.basename(filepath) !== `${className}.java`) {
            fs.copyFileSync(filepath, newJavaPath);
            javaRenamedFile = newJavaPath;
        }
        compileCommand = `javac "${newJavaPath}"`;
        runCommand = "java";
        runArgs = [className];
        runCwd = dir;
    } else {
        throw new Error("Unsupported language");
    }

    return new Promise((resolve, reject) => {
        const run = () => {
            const proc = spawn(runCommand, runArgs, { cwd: runCwd });
            let stdout = "";
            let stderr = "";
            if (input && input.length > 0) {
                // Ensure input ends with a newline
                proc.stdin.write(input.endsWith('\n') ? input : input + '\n');
            }
            proc.stdin.end();
            proc.stdout.on("data", data => { stdout += data; });
            proc.stderr.on("data", data => { stderr += data; });
            proc.on("close", code => {
                // Clean up the renamed Java file if it was created
                if (javaRenamedFile) {
                    try { fs.unlinkSync(javaRenamedFile); } catch (e) {}
                }
                if (code !== 0) return reject(stderr || `Process exited with code ${code}`);
                resolve(stdout);
            });
            proc.on("error", err => {
                if (javaRenamedFile) {
                    try { fs.unlinkSync(javaRenamedFile); } catch (e) {}
                }
                reject(err);
            });
        };
        if (compileCommand) {
            // Compile first
            const compileProc = spawn(compileCommand, { shell: true });
            let compileErr = "";
            compileProc.stderr.on("data", data => { compileErr += data; });
            compileProc.on("close", code => {
                if (code !== 0) {
                    // Clean up the renamed Java file if it was created
                    if (javaRenamedFile) {
                        try { fs.unlinkSync(javaRenamedFile); } catch (e) {}
                    }
                    return reject(compileErr || `Compilation failed with code ${code}`);
                }
                run();
            });
            compileProc.on("error", err => {
                if (javaRenamedFile) {
                    try { fs.unlinkSync(javaRenamedFile); } catch (e) {}
                }
                reject(err);
            });
        } else {
            run();
        }
    });
};

module.exports = { executeCpp };