import { Test, TestingModule } from '@nestjs/testing';
import { KubeController } from './kube.controller';
import { KubeService } from './kube.service';

describe('KubeC', () => {
  let appController: KubeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KubeController],
      providers: [KubeService],
    }).compile();

    appController = app.get<KubeController>(KubeController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.deletePods()).toBe('Hello World!');
  //   });
  // });
});
