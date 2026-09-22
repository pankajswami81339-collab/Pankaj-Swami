declare module 'next/server' {
  export class NextResponse extends Response {
    static next(): NextResponse;
    static redirect(url: string | URL): NextResponse;
    static json(body: any, init?: ResponseInit): NextResponse;
    headers: Headers;
  }
  export interface NextRequest extends Request {
    nextUrl: URL;
  }
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    prefetch: (url: string) => void;
  };
  export function usePathname(): string;
  export function useParams(): Record<string, string | string[]>;
}

declare module 'next/headers' {
  export function cookies(): any;
  export function headers(): Headers;
}
