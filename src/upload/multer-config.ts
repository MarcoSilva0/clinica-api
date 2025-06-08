import { diskStorage } from 'multer';
import * as path from 'path';
import { UPLOAD_FOLDER_NAME } from 'src/core/constants';
import { v4 as uuidv4 } from 'uuid';

const multerConfig = ({
  customPath,
  customFolder,
}: {
  customPath?: string;
  customFolder?: string;
}) => {
  return {
    storage: diskStorage({
      destination: `./${UPLOAD_FOLDER_NAME}${customFolder ? '/' + customFolder : ''}`,
      filename: (req, file, cb) => {
        const fileName =
          (customPath
            ? customPath
            : path.parse(file.originalname).name.replace(/\s/g, '')) +
          '-' +
          uuidv4();

        const extension = path.parse(file.originalname).ext;
        cb(null, `${fileName}${extension}`);
      },
    }),
  };
};

export default multerConfig;
