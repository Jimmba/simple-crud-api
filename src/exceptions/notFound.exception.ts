export class NotFoundException extends Error {
  constructor(path?: string) {
    const message = path ? `Path ${path} not found` : `Path not found`; //! refactor?
    super(message);
  }
}
