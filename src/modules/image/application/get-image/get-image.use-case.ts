import * as fs from 'node:fs';
import * as path from 'node:path';

import { GetImageDto } from './get-image.dto';

export class GetImage {
  execute(dto: GetImageDto) {
    return this.readImageFromFileSystem(dto.imageId);
  }

  private readImageFromFileSystem(id: string): fs.ReadStream {
    const BASE_PATH = path.resolve(
      __dirname,
      '../../../../../generated/images',
    );

    const IMAGE_PATH = path.resolve(BASE_PATH, id);

    try {
      return fs.createReadStream(IMAGE_PATH);
    } catch {
      throw new Error('Error al leer la imagen');
    }
  }
}
