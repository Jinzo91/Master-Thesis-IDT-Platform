export class SSHResponse {
    stdout: string;
    stderr: string;
    code: number;

    constructor(code: number, stdout: string, stderr: string) {
        this.code = code;
        this.stderr = stderr;
        this.stdout = stdout;
    }
}