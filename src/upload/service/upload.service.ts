import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  async deleteFileSafe(path: string) {
    try {
      await fs.unlink(path);
      console.log(`Arquivo removido: ${path}`);
    } catch (err) {
      console.error(`Erro ao remover arquivo ${path}:`, err.message);
    }
  }
}
