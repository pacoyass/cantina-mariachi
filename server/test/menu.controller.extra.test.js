import { jest } from '@jest/globals';

// Mocks
const cache = { getCache: jest.fn(), setCache: jest.fn(), invalidateByPrefix: jest.fn() };
const db = { listCategories: jest.fn(), listMenuItems: jest.fn(), createCategory: jest.fn() };
await jest.unstable_mockModule('../services/cacheService.js', () => ({ default: cache }));
await jest.unstable_mockModule('../services/databaseService.js', () => ({ databaseService: db }));

const { listCategories, listMenuItems, createCategory, cleanupMenuCache } = await import('../controllers/menu.controller.js');

// Helpers
function makeRes() {
  const res = { headers: {}, setHeader: jest.fn(function(k,v){ this.headers[k]=v; }), status: jest.fn(function(c){ this.statusCode=c; return this; }), json: jest.fn(function(b){ this.body=b; return this; }), end: jest.fn() };
  return res;
}

describe('menu.controller extra', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('listCategories: cache miss then sets cache and headers', async () => {
    cache.getCache.mockResolvedValueOnce(null);
    db.listCategories.mockResolvedValueOnce([{ id: 'c1', name: 'A' }]);
    const req = { headers: {} };
    const res = makeRes();
    await listCategories(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(cache.setCache).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=60');
  });

  it('listCategories: cache hit with matching ETag returns 304', async () => {
    const cached = [{ id: 'c1' }];
    cache.getCache.mockResolvedValueOnce(cached);
    const etag = `W/"${Buffer.from(JSON.stringify(cached)).length}"`;
    const req = { headers: { 'if-none-match': etag } };
    const res = makeRes();
    await listCategories(req, res);
    expect(res.statusCode).toBe(304);
    expect(res.end).toHaveBeenCalled();
  });

  it('listMenuItems: cache hit returns cached=true', async () => {
    const cached = [{ id: 'i1' }];
    cache.getCache.mockResolvedValueOnce(cached);
    const req = { headers: {}, validatedQuery: { categoryId: 'x', available: true } };
    const res = makeRes();
    await listMenuItems(req, res);
    expect(res.body.data.cached).toBe(true);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('createCategory: db error returns 500', async () => {
    db.createCategory.mockRejectedValueOnce(new Error('db fail'));
    const req = { body: { name: 'B' } };
    const res = makeRes();
    await createCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});