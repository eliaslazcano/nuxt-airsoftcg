export default function (value: string): string {
  return process.client ?
    decodeURIComponent(window.atob(value)) :
    Buffer.from(value, 'base64').toString('ascii')
}