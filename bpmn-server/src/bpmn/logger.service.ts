import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class BPMNLoggerService {
  private readonly logger = new Logger("BPMN-SERVER");

  log(message: string) {
    this.logger.log(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  callback(message: string, type: string) {
    switch (type) {
      case "debug":
        this.debug(message);
        break;
      case "warn":
        this.warn(message);
        break;
      case "error":
        this.error(message);
        break;
      default:
        this.log(message);
        break;
    }
  }
}