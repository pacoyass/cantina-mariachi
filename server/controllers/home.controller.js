import { createResponse, createError } from '../utils/response.js';
import cacheService from '../services/cacheService.js';

const OFFERS_CACHE_KEY = 'home:offers';
const TESTIMONIALS_CACHE_KEY = 'home:testimonials';

export const getOffers = async (req, res) => {
  try {
    const cached = await cacheService.getCache(OFFERS_CACHE_KEY);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return createResponse(res, 200, 'dataRetrieved', { offers: cached, cached: true }, req, {}, 'api');
    }

    // In a real app, fetch from DB. Here we return curated data.
    const now = Date.now();
    const offers = [
      {
        id: 'bundle-summer-2for1',
        title: 'Summer Fiesta Bundle',
        bundleName: 'Taco Trio + 2 Drinks',
        description: 'Perfect for sharing. Choose any 3 tacos with two refreshing drinks.',
        badge: 'Limited Time',
        expiresAt: new Date(now + 1000 * 60 * 60 * 36).toISOString(),
        imageUrl: null,
      },
    ];

    await cacheService.setCache(OFFERS_CACHE_KEY, offers, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'dataRetrieved', { offers, cached: false }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const cached = await cacheService.getCache(TESTIMONIALS_CACHE_KEY);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return createResponse(res, 200, 'dataRetrieved', { testimonials: cached, cached: true }, req, {}, 'api');
    }

    const testimonials = [
      {
        id: 't1',
        name: 'A. Rivera',
        initials: 'AR',
        rating: 5,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        content: 'Best tacos in town. Delivery was quick and still hot!'
      },
      {
        id: 't2',
        name: 'M. Santos',
        initials: 'MS',
        rating: 5,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
        content: 'Loyalty points add up fast. My go-to lunch spot.'
      },
      {
        id: 't3',
        name: 'L. Chen',
        initials: 'LC',
        rating: 4,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        content: 'Fresh ingredients and generous portions. Highly recommend.'
      },
    ];

    await cacheService.setCache(TESTIMONIALS_CACHE_KEY, testimonials, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'dataRetrieved', { testimonials, cached: false }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export default { getOffers, getTestimonials };