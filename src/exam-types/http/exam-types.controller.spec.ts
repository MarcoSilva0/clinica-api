import { Test, TestingModule } from '@nestjs/testing';
import { ExamTypesController } from './exam-types.controller';

describe('ExamTypesController', () => {
  let controller: ExamTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamTypesController],
    }).compile();

    controller = module.get<ExamTypesController>(ExamTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
