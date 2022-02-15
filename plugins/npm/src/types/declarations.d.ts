declare module 'libnpmpack' {
  export default function pack(packagePath: string): Promise<Buffer>
}
