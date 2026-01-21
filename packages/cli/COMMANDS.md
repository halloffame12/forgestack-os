# ForgeStack CLI - New Commands

## `organize` Command

Organize files in a folder by type or date, with optional duplicate detection.

### Usage

```bash
npx forgestack organize <folder-path> [options]
npx forgestack organize                # Interactive mode
```

### Options

- `--strategy <type>` - Organization strategy: `type` or `date`
- `--duplicates` - Move duplicate files to a `Duplicates` folder

### Examples

**Organize by file type with duplicates detection:**
```bash
npx forgestack organize ./Downloads --strategy type --duplicates
```

**Organize by date:**
```bash
npx forgestack organize ./photos --strategy date
```

**Interactive mode:**
```bash
npx forgestack organize
```

### Features

- **By Type**: Organizes files into folders like `Images`, `Documents`, `Videos`, `Audio`, `Code`, `Archives`, etc.
- **By Date**: Organizes files into YYYY-MM formatted folders based on modification date
- **Duplicate Detection**: Uses MD5 hashing to find duplicate files and optionally moves them to a `Duplicates` folder
- **Recursive**: Processes all files in subfolders

### Output

The command displays a summary of:
- Number of files moved to each category
- Number of duplicate files moved (if detected)
- Total files moved

---

## `run-tasks` Command

Execute a batch of shell commands from a JSON config file, either sequentially or in parallel.

### Usage

```bash
npx forgestack run-tasks <config-path> [options]
npx forgestack run-tasks                # Interactive mode (looks for ./tasks.json)
```

### Options

- `--parallel` - Run tasks in parallel instead of sequentially
- `--stop-on-error` - Stop execution if any task fails (default: true)

### Examples

**Run tasks sequentially:**
```bash
npx forgestack run-tasks ./tasks.json
```

**Run tasks in parallel:**
```bash
npx forgestack run-tasks ./tasks.json --parallel
```

**Continue even if a task fails:**
```bash
npx forgestack run-tasks ./tasks.json --stop-on-error false
```

### Config File Format

Create a `tasks.json` file with the following structure:

```json
{
  "tasks": [
    {
      "name": "Task 1 Name",
      "command": "npm run build",
      "cwd": "./"
    },
    {
      "name": "Task 2 Name",
      "command": "npm test",
      "cwd": "./"
    }
  ],
  "parallel": false,
  "stopOnError": true
}
```

### Task Properties

- `name` (required): Display name for the task
- `command` (required): Shell command to execute
- `cwd` (optional): Working directory for the command

### Global Config Properties

- `parallel` (optional): Run all tasks in parallel (default: false)
- `stopOnError` (optional): Stop on first failure (default: true)

### Output

Displays:
- Task execution progress with colored indicators
- Success/failure status for each task
- Summary showing succeeded and failed task counts
- Error messages for failed tasks

---

## Examples

See the `examples/tasks.json` file in the CLI package for a complete example.
