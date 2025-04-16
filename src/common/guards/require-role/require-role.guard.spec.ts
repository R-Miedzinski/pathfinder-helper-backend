import { RequireRoleGuard } from './require-role.guard';

describe('RequireRoleGuard', () => {
  it('should be defined', () => {
    expect(new RequireRoleGuard()).toBeDefined();
  });
});
