import { jest } from '@jest/globals';

jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    getUserById: jest.fn().mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', role: 'CUSTOMER', phone: '1', isActive: true }),
    updateUser: jest.fn().mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'B', role: 'CUSTOMER', phone: '2', isActive: true }),
  }
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: { compare: jest.fn(async (a,b)=> a === 'OldPass1!'), hash: jest.fn(async (s)=> 'hashed') }
}));

jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logAudit: jest.fn().mockResolvedValue(), logError: jest.fn().mockResolvedValue() } }));

const { getMe, updateMe, changePassword } = await import('../controllers/user.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('user.controller extra', () => {
  it('getMe returns 200 when authenticated', async () => {
    const res = makeRes();
    await getMe({ user: { userId: 'u1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updateMe returns 200', async () => {
    const res = makeRes();
    await updateMe({ user: { userId: 'u1' }, body: { name: 'B', phone: '2' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('changePassword success and invalid current paths', async () => {
    const res1 = makeRes();
    await changePassword({ user: { userId: 'u1' }, body: { currentPassword: 'OldPass1!', newPassword: 'NewPass2!' } }, res1);
    expect(res1.status).toHaveBeenCalledWith(200);

    const res2 = makeRes();
    await changePassword({ user: { userId: 'u1' }, body: { currentPassword: 'Wrong', newPassword: 'NewPass2!' } }, res2);
    expect(res2.status).toHaveBeenCalledWith(400);
  });
});