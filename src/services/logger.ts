export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class CentralizedLogger {
  private level: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.WARN;

  setLogLevel(newLevel: LogLevel) {
    this.level = newLevel;
  }

  private shouldLog(msgLevel: LogLevel): boolean {
    return msgLevel >= this.level;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, error?: any, ...args: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), error || '', ...args);
      this.reportToCrashlytics('WARN', message, error);
    }
  }

  error(message: string, error?: any, ...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), error || '', ...args);
      this.reportToCrashlytics('ERROR', message, error);
    }
  }

  /**
   * Centralized Hook for Crash Reporting Service integration (Sentry / Firebase Crashlytics)
   */
  private reportToCrashlytics(level: string, message: string, error?: any) {
    if (__DEV__) {
      // In development, we rely on standard console warning/error displays.
      return;
    }

    try {
      // PLUG-IN HOOK: In the future, uncomment this to send reports directly to Firebase Crashlytics or Sentry.
      /*
      if (error) {
        // Crashlytics: crashlytics().recordError(error);
        // Sentry: Sentry.captureException(error);
      } else {
        // Crashlytics: crashlytics().log(`[${level}] ${message}`);
        // Sentry: Sentry.captureMessage(message);
      }
      */
      console.log(`[Crash Reporter Hook] Logged error event: ${message}`);
    } catch (e) {
      console.error('Failed to log event to Crash Reporter Service:', e);
    }
  }
}

export const Logger = new CentralizedLogger();
