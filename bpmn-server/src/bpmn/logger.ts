import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from "bpmn-server";
import * as process from "node:process";

@Injectable()
export class CustomLogger extends Logger implements ILogger {
  log(message: any) {
    super.log(message.toString());
  }

  info(message: any) {
    super.log(message.toString())
  }

  warn(message: any) {
    super.warn(message.toString());
  }

  debug(message: any) {
    super.debug(message.toString());
  }

  verbose(message: string) {
    super.verbose(message.toString());
  }

  private getContext(): string {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    return `[Nest] ${pid} - ${timestamp}`;
  }

  clear(): void {
  }

  get(): any[] {
    return [];
  }

  reportError(err: any): void {
  }

  save(filename: any): Promise<void> {
    return Promise.resolve(undefined);
  }

  setOptions({ toConsole, toFile, callback }: { toConsole: any; toFile: any; callback: any }): void {
  }

  logS(message: any){
    super.log(message.toString());
  }

  logE(message: any){
    super.log(message.toString());
  }

}
