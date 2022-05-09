export default class SystemError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
