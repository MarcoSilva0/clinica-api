import { Test, TestingModule } from '@nestjs/testing';
import { ExamsTypeController } from './exams-type.controller';

describe('ExamsTypeController', () => {
  let controller: ExamsTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsTypeController],
    }).compile();

    controller = module.get<ExamsTypeController>(ExamsTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
