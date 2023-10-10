import { Test, TestingModule } from '@nestjs/testing';
import { CommanderController } from './commander.controller';

describe('CommanderController', () => {
  let controller: CommanderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommanderController],
    }).compile();

    controller = module.get<CommanderController>(CommanderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
