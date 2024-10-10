import fs from "fs";

//level: "warning" | "error" | "debug" | "info";
interface LoggerOptions {
  autoOverwrite: boolean; // if false, rename old file
  maxTimeToKeepLog?: "1d" | "14d" | "30d" | "0d";
  fileName?: string;
  folder?: boolean; // folder name: "logs"
}

interface DefaultLoggerTempate {
  message: string;
  level: string;
  date: string;
}

class GiannisLogger {
  private autoOverwrite: boolean;
  private maxTimeToKeep: "1d" | "14d" | "30d" | "0d";
  private fileName: string;
  private folder: boolean;

  constructor(options: LoggerOptions) {
    this.autoOverwrite = options.autoOverwrite;
    this.maxTimeToKeep = options.maxTimeToKeepLog || "0d";
    this.fileName = options.fileName || "log.json";
    this.folder = options.folder || true;

    this.initLogger();
  }

  private initLogger() {
    // format file Name and folder
    const fullFileName = this.folder
      ? `./logs/${this.fileName}`
      : this.fileName;

    // check if the file actually exists
    if (fs.existsSync(fullFileName)) {
      const dateToLog = new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0];
      const dateForFileName = new Date()
        .toISOString()
        .replace("T", "_")
        .replace(/:/g, "-")
        .split(".")[0]; // e.g., '2024-10-10_14-45-30'

      const defaultLogMessage: DefaultLoggerTempate = {
        message: "Successfully initialized the Logger",
        date: dateToLog,
        level: "info",
      };

      if (this.autoOverwrite) {
        fs.unlinkSync(fullFileName);
        fs.writeFileSync(fullFileName, JSON.stringify(defaultLogMessage));
      } else {
        const oldFullFileName = this.folder
          ? `./logs/${this.fileName}_${dateForFileName}`
          : `${this.fileName}_${dateForFileName}`;
        fs.renameSync(fullFileName, oldFullFileName);
      }
    }
  }

  log(
    level: "w" | "e" | "d" | "i" | "warning" | "error" | "debug" | "info",
    message: string
  ) {}
}
