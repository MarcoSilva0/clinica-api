import { Test, TestingModule } from '@nestjs/testing';
import { ExamsTypeService } from './exams-type.service';

describe('ExamsTypeService', () => {
  let service: ExamsTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamsTypeService],
    }).compile();

    service = module.get<ExamsTypeService>(ExamsTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
