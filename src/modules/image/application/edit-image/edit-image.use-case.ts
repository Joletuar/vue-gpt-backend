import * as fs from 'node:fs';
import * as path from 'node:path';

import { CompletionRepository } from 'src/modules/shared/domain/completion.repository';

import { EditImageDto } from './edit-image.dto';

export class EditImage {
  constructor(private readonly completionRepository: CompletionRepository) {}

  async execute(dto: EditImageDto) {
    const { prompt, originalImage, maskImage } = dto;

    const res = await this.completionRepository.editImage(
      prompt,
      originalImage,
      maskImage,
    );

    const imageName = await this.saveImageInFileSystem(res);

    return {
      imageId: imageName,
    };
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
