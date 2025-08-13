import { jest } from '@jest/globals';
import * as cacheSvc from '../services/cacheService.js';
import { listCategories, listMenuItems } from '../controllers/menu.controller.js';

const makeResRaw = () => {
  const res = {};
  res.statusCode = 200;
  res.setHeader = jest.fn();
  res.end = jest.fn();
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('menu controller', () => {
  it('returns 304 when ETag matches for categories', async () => {
    const categories = [{ id: 'c1', name: 'Main', order: 1 }];
    jest.spyOn(cacheSvc.default, 'getCache').mockResolvedValue(categories);
    const res = makeResRaw();
    const etag = `W/"${Buffer.from(JSON.stringify(categories)).length}"`;
    const req = { headers: { 'if-none-match': etag } };
    await listCategories(req, res);
    expect(res.statusCode).toBe(304);
    expect(res.end).toHaveBeenCalled();
  });

  it('returns cached items with headers', async () => {
    const items = [{ id: 'm1', name: 'Taco', price: '8.00' }];
    jest.spyOn(cacheSvc.default, 'getCache').mockResolvedValue(items);
    const res = makeResRaw();
    const req = { headers: {}, validatedQuery: {} };
    await listMenuItems(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=300');
    expect(res.json).toHaveBeenCalled();
  });
});