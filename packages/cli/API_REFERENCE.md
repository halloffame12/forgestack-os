# ForgeStack CLI - API Reference

## Command: `organize`

### Function Signature
```typescript
export async function organizeCommand(
  folderPath?: string,
  options?: Record<string, unknown>
): Promise<void>
```

### Parameters

#### `folderPath` (optional)
- Type: `string`
- Description: Path to the folder to organize
- Default: Interactive prompt if not provided
- Example: `"/home/user/Downloads"`

#### `options` (optional)
- Type: `Record<string, unknown>`
- Properties:
  - `strategy` (string): Organization method - `"type"` or `"date"`
  - `duplicates` (boolean): Enable duplicate detection and moving

### Return Value
- Type: `Promise<void>`
- Throws: `Error` on invalid path or permission issues

### Exit Codes
- `0`: Success
- `1`: Failure (invalid path, permission denied, etc.)

### Example Usage

```typescript
// From CLI
npx forgestack organize ~/Downloads --strategy type --duplicates

// Programmatic (if exported)
import { organizeCommand } from './commands/organize.js';

await organizeCommand('./my-folder', {
  strategy: 'type',
  duplicates: true
});
```

---

## Command: `run-tasks`

### Function Signature
```typescript
export async function runTasksCommand(
  configPath?: string,
  options?: Record<string, unknown>
): Promise<void>
```

### Parameters

#### `configPath` (optional)
- Type: `string`
- Description: Path to the tasks.json config file
- Default: Interactive prompt or looks for `./tasks.json`
- Example: `"./tasks.json"` or `"/path/to/config.json"`

#### `options` (optional)
- Type: `Record<string, unknown>`
- Properties:
  - `parallel` (boolean): Run tasks concurrently
  - `stopOnError` (boolean): Stop on first failure (default: true)

### Return Value
- Type: `Promise<void>`
- Throws: `Error` on config parsing or task execution failure

### Exit Codes
- `0`: All tasks succeeded
- `1`: One or more tasks failed

### Example Usage

```typescript
// From CLI - Sequential
npx forgestack run-tasks ./tasks.json

// From CLI - Parallel
npx forgestack run-tasks ./tasks.json --parallel

// From CLI - Continue on error
npx forgestack run-tasks ./tasks.json --stop-on-error false

// Programmatic (if exported)
import { runTasksCommand } from './commands/run-tasks.js';

await runTasksCommand('./tasks.json', {
  parallel: false,
  stopOnError: true
});
```

---

## Utility: `file-organizer`

### Functions

#### `getFileHash(filePath: string): Promise<string>`
Calculates MD5 hash of a file for duplicate detection.

**Parameters:**
- `filePath` (string): Absolute path to file

**Returns:** Promise<string> - MD5 hash of file contents

**Example:**
```typescript
const hash = await getFileHash('./document.pdf');
// "5d41402abc4b2a76b9719d911017c592"
```

---

#### `detectDuplicates(folderPath: string): Promise<Map<string, string[]>>`
Scans folder recursively and identifies duplicate files by hash.

**Parameters:**
- `folderPath` (string): Path to folder to scan

**Returns:** Promise<Map<string, string[]>>
- Key: MD5 hash
- Value: Array of file paths with that hash

**Example:**
```typescript
const duplicates = await detectDuplicates('./documents');
// Map(2) {
//   "abc123..." => ["file1.pdf", "file2.pdf"],
//   "def456..." => ["photo1.jpg", "photo2.jpg", "photo3.jpg"]
// }
```

---

#### `organizeFilesByType(folderPath: string, duplicates?: Map<string, string[]>): Promise<OrganizeResult>`
Organizes files into type-based folders.

**Parameters:**
- `folderPath` (string): Path to folder
- `duplicates` (Map, optional): Duplicate files from `detectDuplicates()`

**Returns:** Promise<OrganizeResult>
```typescript
interface OrganizeResult {
  categorized: Record<string, number>;  // Folder name => file count
  duplicates: number;                   // Total duplicate files moved
}
```

**Example:**
```typescript
const result = await organizeFilesByType('./downloads');
// {
//   categorized: {
//     "Images": 45,
//     "Documents": 12,
//     "Videos": 8,
//     "Code": 23
//   },
//   duplicates: 3
// }
```

---

#### `organizeFilesByDate(folderPath: string, duplicates?: Map<string, string[]>): Promise<OrganizeResult>`
Organizes files into date-based folders (YYYY-MM format).

**Parameters:**
- `folderPath` (string): Path to folder
- `duplicates` (Map, optional): Duplicate files

**Returns:** Promise<OrganizeResult> (same as `organizeFilesByType`)

**Example:**
```typescript
const result = await organizeFilesByDate('./photos');
// {
//   categorized: {
//     "2024-12": 28,
//     "2024-11": 35,
//     "2024-10": 22,
//     "2024-09": 15
//   },
//   duplicates: 0
// }
```

---

## Utility: `task-runner`

### Functions

#### `executeTask(task: Task): Promise<TaskResult>`
Executes a single shell command task.

**Parameters:**
- `task` (Task object):
  ```typescript
  interface Task {
    name: string;           // Display name
    command: string;        // Shell command to run
    cwd?: string;          // Working directory
  }
  ```

**Returns:** Promise<TaskResult>
```typescript
interface TaskResult {
  name: string;             // Task name
  success: boolean;         // Whether task succeeded
  error?: string;          // Error message if failed
}
```

**Example:**
```typescript
const result = await executeTask({
  name: "Build",
  command: "npm run build",
  cwd: "./"
});
// { name: "Build", success: true }

// Or with failure:
// { name: "Build", success: false, error: "command exited with code 1" }
```

---

#### `executeTasksSequentially(tasks: Task[], stopOnError?: boolean): Promise<TaskResult[]>`
Runs tasks one after another in order.

**Parameters:**
- `tasks` (Task[]): Array of tasks
- `stopOnError` (boolean, default: true): Stop on first failure

**Returns:** Promise<TaskResult[]> - Results for all executed tasks

**Example:**
```typescript
const tasks = [
  { name: "Build", command: "npm run build" },
  { name: "Test", command: "npm test" }
];

const results = await executeTasksSequentially(tasks, true);
// [
//   { name: "Build", success: true },
//   { name: "Test", success: false, error: "..."}
// ]
```

---

#### `executeTasksInParallel(tasks: Task[], stopOnError?: boolean): Promise<TaskResult[]>`
Runs all tasks concurrently.

**Parameters:**
- `tasks` (Task[]): Array of tasks
- `stopOnError` (boolean, default: true): Note failures

**Returns:** Promise<TaskResult[]> - Results for all tasks

**Example:**
```typescript
const tasks = [
  { name: "Lint Frontend", command: "npm run lint", cwd: "./packages/frontend" },
  { name: "Lint Backend", command: "npm run lint", cwd: "./packages/backend" }
];

const results = await executeTasksInParallel(tasks, true);
// Runs both commands at the same time
```

---

## Configuration Interfaces

### Task Interface
```typescript
interface Task {
  /**
   * Display name for the task
   * @example "Build project"
   */
  name: string;

  /**
   * Shell command to execute
   * @example "npm run build"
   */
  command: string;

  /**
   * Working directory for command execution
   * @optional
   * @default process.cwd()
   * @example "./" or "./packages/cli"
   */
  cwd?: string;
}
```

### TasksConfig Interface
```typescript
interface TasksConfig {
  /**
   * Array of tasks to execute
   * @required
   * @minItems 1
   */
  tasks: Task[];

  /**
   * Run all tasks in parallel
   * @optional
   * @default false
   */
  parallel?: boolean;

  /**
   * Stop execution if any task fails
   * @optional
   * @default true
   */
  stopOnError?: boolean;
}
```

### TaskResult Interface
```typescript
interface TaskResult {
  /**
   * Name of the task
   */
  name: string;

  /**
   * Whether task succeeded
   */
  success: boolean;

  /**
   * Error message if task failed
   * @optional
   */
  error?: string;
}
```

### OrganizeResult Interface
```typescript
interface OrganizeResult {
  /**
   * Categorized files: folder name => count
   * @example { "Images": 45, "Documents": 12 }
   */
  categorized: Record<string, number>;

  /**
   * Number of duplicate files moved
   */
  duplicates: number;
}
```

---

## File Type Categories

### Images
`.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.ico`, `.tiff`

### Documents
`.pdf`, `.doc`, `.docx`, `.txt`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `.odt`

### Archives
`.zip`, `.rar`, `.7z`, `.tar`, `.gz`, `.bz2`, `.iso`

### Videos
`.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`, `.flv`, `.webm`, `.m4v`

### Audio
`.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.wma`, `.m4a`

### Code
`.js`, `.ts`, `.py`, `.java`, `.cpp`, `.c`, `.go`, `.rs`, `.rb`, `.php`, `.html`, `.css`, `.json`, `.xml`, `.yaml`, `.yml`

### Data
`.csv`, `.sql`, `.db`, `.sqlite`, `.json`, `.yaml`

### Executables
`.exe`, `.msi`, `.app`, `.bin`, `.sh`, `.bat`

### Others
Any unrecognized extensions

---

## Error Handling

### organize Command
- **InvalidPathError**: Thrown when folder doesn't exist or isn't accessible
- **PermissionError**: Thrown when lacking read/write permissions
- **FileOperationError**: Thrown during file operations (caught and logged)

### run-tasks Command
- **ConfigNotFoundError**: Thrown when config file doesn't exist
- **InvalidJsonError**: Thrown when config JSON is malformed
- **ConfigValidationError**: Thrown when config missing required fields
- **TaskExecutionError**: Thrown when shell command fails

---

## Logging Output

### organize Command
```
📁 Organizing files...

✔ Organization complete!

Summary:
──────────────────────────────
→ Images: 45 files
→ Documents: 12 files
→ Duplicates: 3 files
──────────────────────────────
Total files moved: 60
```

### run-tasks Command
```
🚀 Running Tasks

Total tasks: 4
Mode: Sequential
Stop on error: Yes

→ Running: Build
✔ Build completed

→ Running: Test
✔ Test completed

📊 Task Results
──────────────────────────────
✔ Build: SUCCESS
✔ Test: SUCCESS
──────────────────────────────

Results: 2 succeeded / 0 failed
```

---

## CLI Usage Examples

### organize - Interactive
```bash
$ npx forgestack organize
? Enter the folder path to organize: ~/Downloads
? How would you like to organize files?
  By File Type (images, documents, etc.)
  By Date (YYYY-MM)
? Move duplicate files to a "Duplicates" folder? (Y/n)
```

### organize - By Type
```bash
$ npx forgestack organize ~/Downloads --strategy type --duplicates
📁 Organizing files...
✔ Organization complete!
Summary:
─────────────────────────
→ Images: 45 files
→ Documents: 12 files
→ Duplicates: 3 files
─────────────────────────
Total files moved: 60
```

### organize - By Date
```bash
$ npx forgestack organize ~/Photos --strategy date
📁 Organizing files...
✔ Organization complete!
Summary:
─────────────────────────
→ 2024-12: 28 files
→ 2024-11: 35 files
→ 2024-10: 22 files
─────────────────────────
Total files moved: 85
```

### run-tasks - Sequential
```bash
$ npx forgestack run-tasks ./tasks.json
🚀 Running Tasks
Total tasks: 4
Mode: Sequential
Stop on error: Yes

→ Running: Build
✔ Build completed

→ Running: Test
✔ Test completed

→ Running: Lint
✔ Lint completed

→ Running: Deploy
✔ Deploy completed

📊 Task Results
────────────────────────
✔ Build: SUCCESS
✔ Test: SUCCESS
✔ Lint: SUCCESS
✔ Deploy: SUCCESS
────────────────────────
Results: 4 succeeded / 0 failed
```

### run-tasks - Parallel
```bash
$ npx forgestack run-tasks ./tasks.json --parallel
🚀 Running Tasks
Total tasks: 4
Mode: Parallel
Stop on error: Yes

→ Running: Lint Frontend
→ Running: Lint Backend
→ Running: Build Frontend
→ Running: Build Backend

✔ Lint Frontend completed
✔ Lint Backend completed
✔ Build Frontend completed
✔ Build Backend completed

📊 Task Results
──────────────────────────
✔ Lint Frontend: SUCCESS
✔ Lint Backend: SUCCESS
✔ Build Frontend: SUCCESS
✔ Build Backend: SUCCESS
──────────────────────────
Results: 4 succeeded / 0 failed
```

---

## Performance Considerations

### organize Command
- **Time Complexity**: O(n) where n = total files in directory tree
- **Space Complexity**: O(m) where m = unique files (for duplicate detection)
- **MD5 Hashing**: ~10-50ms per MB of file
- **Recursive Scan**: Processes one directory level at a time

### run-tasks Command
- **Sequential**: Tasks run one-by-one, total time = sum of individual times
- **Parallel**: Tasks run concurrently, total time = max individual time
- **Process Overhead**: ~50-100ms per task
- **Memory**: Minimal, streams task output

---

## Type Definitions Summary

All types are exported from their respective modules:
```typescript
// From organize.ts
export async function organizeCommand(...)

// From run-tasks.ts
export interface Task { ... }
export interface TasksConfig { ... }
export async function runTasksCommand(...)

// From file-organizer.ts
export async function detectDuplicates(...)
export async function organizeFilesByType(...)
export async function organizeFilesByDate(...)
interface OrganizeResult { ... }

// From task-runner.ts
export interface TaskResult { ... }
export async function executeTasksSequentially(...)
export async function executeTasksInParallel(...)
```

