import { jest } from '@jest/globals';

const cache = { getCache: jest.fn(), setCache: jest.fn(), invalidateByPrefix: jest.fn() };
const db = {
  listMenuItems: jest.fn(),
  createMenuItem: jest.fn(),
  updateMenuItem: jest.fn(),
  deleteMenuItem: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
};
await jest.unstable_mockModule('../services/cacheService.js', () => ({ default: cache }));
await jest.unstable_mockModule('../services/databaseService.js', () => ({ databaseService: db }));

const prisma = { $transaction: jest.fn(async (fn)=> fn({})) };
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));
await jest.unstable_mockModule('../utils/lock.js', () => ({ acquireLock: jest.fn(async ()=> true), releaseLock: jest.fn(async ()=>{}) }));
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logCronRun: jest.fn(), logAudit: jest.fn(), logError: jest.fn() } }));

const { listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability, createCategory, updateCategory, deleteCategory, cleanupMenuCache } = await import('../controllers/menu.controller.js');

function makeRes() { const res = { headers: {}, setHeader: jest.fn(function(k,v){ this.headers[k]=v; }), status: jest.fn(function(c){ this.statusCode=c; return this; }), json: jest.fn(function(b){ this.body=b; return this; }), end: jest.fn() }; return res; }

describe('menu.controller more', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('listMenuItems: ETag match returns 304', async () => {
    const items = [{ id: 'i1' }];
    cache.getCache.mockResolvedValueOnce(items);
    const etag = `W/"${Buffer.from(JSON.stringify(items)).length}"`;
    const req = { headers: { 'if-none-match': etag }, validatedQuery: {} };
    const res = makeRes();
    await listMenuItems(req, res);
    expect(res.statusCode).toBe(304);
    expect(res.end).toHaveBeenCalled();
  });

  it('createMenuItem: success sets 201 and invalidates cache', async () => {
    db.createMenuItem.mockResolvedValueOnce({ id: 'i2' });
    const res = makeRes();
    await createMenuItem({ body: { name: 'X' } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(cache.invalidateByPrefix).toHaveBeenCalled();
  });

  it('updateMenuItem: error returns 500', async () => {
    db.updateMenuItem.mockRejectedValueOnce(new Error('db'));
    const res = makeRes();
    await updateMenuItem({ params: { id: 'i1' }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('deleteMenuItem: success returns 200', async () => {
    db.deleteMenuItem.mockResolvedValueOnce({});
    const res = makeRes();
    await deleteMenuItem({ params: { id: 'i1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('toggleMenuItemAvailability: success', async () => {
    db.updateMenuItem.mockResolvedValueOnce({ id: 'i1', isAvailable: true });
    const res = makeRes();
    await toggleMenuItemAvailability({ params: { id: 'i1' }, body: { isAvailable: true } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('create/update/delete Category success and error', async () => {
    const res1 = makeRes();
    db.createCategory.mockResolvedValueOnce({ id: 'c1' });
    await createCategory({ body: { name: 'C' } }, res1);
    expect(res1.status).toHaveBeenCalledWith(201);

    const res2 = makeRes();
    db.updateCategory.mockResolvedValueOnce({ id: 'c1' });
    await updateCategory({ params: { id: 'c1' }, body: { name: 'C2' } }, res2);
    expect(res2.status).toHaveBeenCalledWith(200);

    const res3 = makeRes();
    db.deleteCategory.mockResolvedValueOnce({});
    await deleteCategory({ params: { id: 'c1' } }, res3);
    expect(res3.status).toHaveBeenCalledWith(200);

    const res4 = makeRes();
    db.updateCategory.mockRejectedValueOnce(new Error('db'));
    await updateCategory({ params: { id: 'c1' }, body: {} }, res4);
    expect(res4.status).toHaveBeenCalledWith(500);
  });

  it('cleanupMenuCache: lock skip then success', async () => {
    const { acquireLock } = await import('../utils/lock.js');
    acquireLock.mockResolvedValueOnce(false);
    await cleanupMenuCache();
    acquireLock.mockResolvedValueOnce(true);
    await cleanupMenuCache();
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});