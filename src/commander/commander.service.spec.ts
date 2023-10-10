import { Test, TestingModule } from '@nestjs/testing';
import { CommanderService } from './commander.service';

describe('CommanderService', () => {
  let service: CommanderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommanderService],
    }).compile();

    service = module.get<CommanderService>(CommanderService);
  });

  it('should be definedsss', () => {
    expect(service).toBeDefined();
  });
});
