# ForgeStack CLI - New Commands Implementation Guide

This guide covers the two new productivity commands added to ForgeStack CLI: `organize` and `run-tasks`.

## Files Added

### Command Files
- `packages/cli/src/commands/organize.ts` - File/folder organizer command
- `packages/cli/src/commands/run-tasks.ts` - Batch task runner command

### Utility Files
- `packages/cli/src/utils/file-organizer.ts` - File organization logic
- `packages/cli/src/utils/task-runner.ts` - Task execution logic

### Updated Files
- `packages/cli/src/index.ts` - Registered new commands with CLI

### Documentation & Examples
- `packages/cli/COMMANDS.md` - Full command documentation
- `packages/cli/examples/tasks.json` - Basic tasks example
- `packages/cli/examples/build-pipeline.json` - Build pipeline example
- `packages/cli/examples/monorepo-build.json` - Monorepo build example

---

## Command 1: `organize`

### Purpose
Organize files in a folder by type or date, with optional duplicate detection.

### Usage
```bash
npx forgestack organize <folder-path> [options]
npx forgestack organize ./Downloads --strategy type --duplicates
npx forgestack organize ./photos --strategy date
npx forgestack organize                # Interactive mode
```

### Options
- `--strategy <type>` - Choose between `type` or `date` organization
- `--duplicates` - Detect and move duplicate files to a `Duplicates` folder

### Features

#### Organization by Type
Creates folders for different file categories:
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.ico`, `.tiff`
- **Documents**: `.pdf`, `.doc`, `.docx`, `.txt`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `.odt`
- **Archives**: `.zip`, `.rar`, `.7z`, `.tar`, `.gz`, `.bz2`, `.iso`
- **Videos**: `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`, `.flv`, `.webm`, `.m4v`
- **Audio**: `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.wma`, `.m4a`
- **Code**: `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.c`, `.go`, `.rs`, `.rb`, `.php`, `.html`, `.css`, `.json`, `.xml`, `.yaml`, `.yml`
- **Data**: `.csv`, `.sql`, `.db`, `.sqlite`, `.json`, `.yaml`
- **Executables**: `.exe`, `.msi`, `.app`, `.bin`, `.sh`, `.bat`
- **Others**: Unrecognized file types

#### Organization by Date
Creates folders in `YYYY-MM` format based on file modification date.

#### Duplicate Detection
- Uses MD5 hashing to identify duplicate files
- Moves duplicates to a `Duplicates` folder
- Supports nested directory scanning

### Example Workflow
```bash
# Organize downloads folder by type
npx forgestack organize ~/Downloads --strategy type --duplicates

# Organize photos by date
npx forgestack organize ~/Pictures --strategy date

# Interactive prompts for all options
npx forgestack organize
```

### Output Example
```
📁 Organizing files...

✔ Organization complete!

Summary:
─────────────────────────────────────────────
→ Images: 45 files
→ Documents: 12 files
→ Videos: 8 files
→ Code: 23 files
→ Duplicates: 3 files
─────────────────────────────────────────────
Total files moved: 91
```

---

## Command 2: `run-tasks`

### Purpose
Execute a batch of shell commands from a JSON config file, either sequentially or in parallel.

### Usage
```bash
npx forgestack run-tasks <config-path> [options]
npx forgestack run-tasks ./tasks.json --parallel
npx forgestack run-tasks                # Looks for ./tasks.json
```

### Options
- `--parallel` - Run tasks concurrently instead of one at a time
- `--stop-on-error` - Stop execution if any task fails (default: true)

### Config File Format

#### Basic Structure
```json
{
  "tasks": [
    {
      "name": "Task 1",
      "command": "npm run build"
    },
    {
      "name": "Task 2",
      "command": "npm test"
    }
  ],
  "parallel": false,
  "stopOnError": true
}
```

#### Task Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Display name for the task |
| `command` | string | Yes | Shell command to execute |
| `cwd` | string | No | Working directory for the command |

#### Global Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `parallel` | boolean | false | Run all tasks in parallel |
| `stopOnError` | boolean | true | Stop on first failure |

### Example Configurations

#### Build Pipeline (Sequential)
```json
{
  "tasks": [
    {
      "name": "Clean",
      "command": "rm -rf dist"
    },
    {
      "name": "Install",
      "command": "npm install"
    },
    {
      "name": "Build",
      "command": "npm run build"
    },
    {
      "name": "Test",
      "command": "npm test"
    }
  ],
  "stopOnError": true
}
```

#### Monorepo Build (Parallel)
```json
{
  "tasks": [
    {
      "name": "Lint frontend",
      "command": "npm run lint",
      "cwd": "./packages/landing"
    },
    {
      "name": "Lint CLI",
      "command": "npm run lint",
      "cwd": "./packages/cli"
    },
    {
      "name": "Build frontend",
      "command": "npm run build",
      "cwd": "./packages/landing"
    },
    {
      "name": "Build CLI",
      "command": "npm run build",
      "cwd": "./packages/cli"
    }
  ],
  "parallel": true,
  "stopOnError": false
}
```

#### CI/CD Tasks
```json
{
  "tasks": [
    {
      "name": "Lint",
      "command": "npm run lint"
    },
    {
      "name": "Type check",
      "command": "npx tsc --noEmit"
    },
    {
      "name": "Unit tests",
      "command": "npm test"
    },
    {
      "name": "Build",
      "command": "npm run build"
    }
  ],
  "stopOnError": true
}
```

### Execution Modes

#### Sequential Execution (Default)
Tasks run one after another:
```bash
npx forgestack run-tasks ./tasks.json
```

Tasks wait for the previous task to complete. If `stopOnError: true`, stops on first failure.

#### Parallel Execution
Tasks run concurrently:
```bash
npx forgestack run-tasks ./tasks.json --parallel
```

All tasks start at the same time. Useful for independent tasks like linting multiple packages.

### Output Example

#### Sequential Success
```
🚀 Running Tasks

Total tasks: 4
Mode: Sequential
Stop on error: Yes

→ Running: Build TypeScript
✔ Build TypeScript completed

→ Running: Run Linter
✔ Run Linter completed

→ Running: Run Tests
✔ Run Tests completed

→ Running: Format Code
✔ Format Code completed

📊 Task Results
──────────────────────────────────────────────────────
✔ Build TypeScript: SUCCESS
✔ Run Linter: SUCCESS
✔ Run Tests: SUCCESS
✔ Format Code: SUCCESS
──────────────────────────────────────────────────────

Results: 4 succeeded / 0 failed
```

#### With Failures
```
✔ Build TypeScript: SUCCESS
✖ Run Tests: FAILED
   Error: npm test failed with exit code 1

📊 Task Results
──────────────────────────────────────────────────────
✔ Build TypeScript: SUCCESS
✖ Run Tests: FAILED
──────────────────────────────────────────────────────

Results: 1 succeeded / 1 failed
```

---

## Integration with Existing CLI

Both commands are fully integrated into the ForgeStack CLI:

1. **Registered in `index.ts`** - Commands are registered with the Commander.js CLI framework
2. **Follow CLI patterns** - Use same error handling, logging, and interactive prompts as `create` command
3. **Use shared utilities** - Leverage existing `logger` utility for consistent output
4. **Modular structure** - Each command in its own file with separate utility modules

### CLI Entry Point
All commands are accessible via:
```bash
npx forgestack <command> [options]
```

---

## Error Handling

### organize Command
- Validates folder path exists and is a directory
- Handles unreadable files gracefully during duplicate detection
- Gracefully skips system folders (`.`, `..`, `.git`, etc.)

### run-tasks Command
- Validates config file exists and is valid JSON
- Ensures all tasks have required `name` and `command` properties
- Handles task execution errors with detailed error messages
- Exits with code 1 if any task fails

---

## Development Notes

### Dependencies Used
- `chalk` - Colored output
- `inquirer` - Interactive prompts
- `fs-extra` - File system operations
- `commander` - CLI framework
- Node.js built-ins: `crypto`, `child_process`, `path`

### Key Functions

#### File Organizer (`file-organizer.ts`)
- `getFileHash(filePath)` - Calculate MD5 hash of files
- `detectDuplicates(folderPath)` - Find duplicate files by hash
- `organizeFilesByType(folderPath, duplicates)` - Organize by file type
- `organizeFilesByDate(folderPath, duplicates)` - Organize by date

#### Task Runner (`task-runner.ts`)
- `executeTask(task)` - Execute a single task
- `executeTasksSequentially(tasks, stopOnError)` - Run tasks one by one
- `executeTasksInParallel(tasks, stopOnError)` - Run tasks concurrently

---

## Testing the Commands

### Test organize command
```bash
# Create a test directory with mixed files
mkdir test-org
cd test-org
touch document.pdf image.jpg video.mp4 code.js duplicate.txt duplicate.txt

# Run organize
npx forgestack organize ./ --strategy type --duplicates

# Check results
ls -la
# You should see: Documents/, Images/, Videos/, Code/, Duplicates/ folders
```

### Test run-tasks command
```bash
# Create a tasks.json
echo '{
  "tasks": [
    { "name": "Echo 1", "command": "echo Task 1" },
    { "name": "Echo 2", "command": "echo Task 2" }
  ]
}' > tasks.json

# Run tasks
npx forgestack run-tasks ./tasks.json

# Test parallel
npx forgestack run-tasks ./tasks.json --parallel
```

---

## Building and Publishing

To build and prepare for publishing:

```bash
# Build TypeScript
npm run build

# Lint
npm run lint

# Test
npm test
```

The compiled files go to `dist/` and will be included in npm package based on the `files` field in `package.json`.

---

## Future Enhancements

Possible additions to these commands:

### organize
- Dry-run mode (preview changes without moving)
- Custom category definitions
- Recursive depth limit
- Pattern-based organization (regex)
- Undo functionality

### run-tasks
- Task dependencies/ordering
- Task retries on failure
- Timeout per task
- Progress indicator for parallel tasks
- JSON output for CI/CD integration
- Task hooks (pre-task, post-task scripts)

