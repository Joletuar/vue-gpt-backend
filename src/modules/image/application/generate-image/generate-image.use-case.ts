import * as fs from 'node:fs';
import * as path from 'node:path';

import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';

import { GenerateImageDto } from './generate-image.dto';

export class GenerateImage {
  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(payload: GenerateImageDto) {
    const result = await this.completionRepository.generateImage(
      payload.prompt,
    );

    const imagePath = await this.saveImageInFileSystem(result);

    return imagePath;
  }

  async saveImageInFileSystem(b64Image: string) {
    const BASE_PATH = path.resolve(__dirname, '../../../../../generated');
    const IMAGES_PATH = path.resolve(BASE_PATH, 'images');

    await fs.promises.mkdir(IMAGES_PATH, { recursive: true });

    const imageName = `${new Date().getTime()}.png`;
    const IMAGE_PATH = path.resolve(IMAGES_PATH, imageName);

    await fs.promises.writeFile(IMAGE_PATH, b64Image, { encoding: 'base64' });

    return imageName;
  }
}
