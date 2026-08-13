declare module "heic2any" {
  type Heic2AnyOptions = {
    blob: Blob;
    toType?: string;
    quality?: number;
    gifInterval?: number;
    multiple?: boolean;
  };

  export default function heic2any(
    options: Heic2AnyOptions
  ): Promise<Blob | Blob[]>;
}

declare module "utif" {
  export interface IFD {
    width: number;
    height: number;
    data?: Uint8Array;
    [key: string]: unknown;
  }

  export function decode(buffer: ArrayBuffer | Buffer): IFD[];
  export function decodeImage(buffer: ArrayBuffer | Buffer, ifd: IFD): void;
  export function toRGBA8(ifd: IFD): Uint8Array;
  export function encodeImage(
    rgba: Uint8Array,
    w: number,
    h: number,
    metadata?: IFD
  ): ArrayBuffer;
  export function encode(ifds: IFD[]): ArrayBuffer;

  const UTIF: {
    decode: typeof decode;
    decodeImage: typeof decodeImage;
    toRGBA8: typeof toRGBA8;
    encodeImage: typeof encodeImage;
    encode: typeof encode;
  };

  export default UTIF;
}
