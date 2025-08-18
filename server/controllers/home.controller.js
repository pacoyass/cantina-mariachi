import { createResponse, createError } from '../utils/response.js';
import cacheService from '../services/cacheService.js';
import prisma from '../config/database.js';

const OFFERS_CACHE_KEY = (lng) => `home:offers:${lng || 'en'}`;
const TESTIMONIALS_CACHE_KEY = (lng) => `home:testimonials:${lng || 'en'}`;

async function getCmsSection(section, lng = 'en') {
  try {
    const page = await prisma.pageContent.findUnique({ where: { slug_locale: { slug: 'home', locale: lng } } });
    return page?.data?.[section];
  } catch {
    return undefined;
  }
}

export const getOffers = async (req, res) => {
  const lng = req.language || req.lng || 'en';
  try {
    const cacheKey = OFFERS_CACHE_KEY(lng);
    const cached = await cacheService.getCache(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return createResponse(res, 200, 'dataRetrieved', { offers: cached, cached: true }, req, {}, 'api');
    }

    // Prefer CMS offers if available
    const cmsOffers = await getCmsSection('offers', lng);
    let offers = Array.isArray(cmsOffers?.items) ? cmsOffers.items : undefined;

    if (!offers) {
      const now = Date.now();
      offers = [
        {
          id: 'bundle-summer-2for1',
          title: 'Summer Fiesta Bundle',
          bundleName: 'Taco Trio + 2 Drinks',
          description: 'Perfect for sharing. Choose any 3 tacos with two refreshing drinks.',
          badge: req.t ? req.t('offers.badge', {}, 'home') : 'Limited Time',
          expiresAt: new Date(now + 1000 * 60 * 60 * 36).toISOString(),
          imageUrl: null,
        },
      ];
    }

    await cacheService.setCache(cacheKey, offers, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'dataRetrieved', { offers, cached: false }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const getTestimonials = async (req, res) => {
  const lng = req.language || req.lng || 'en';
  try {
    const cacheKey = TESTIMONIALS_CACHE_KEY(lng);
    const cached = await cacheService.getCache(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return createResponse(res, 200, 'dataRetrieved', { testimonials: cached, cached: true }, req, {}, 'api');
    }

    // Prefer CMS testimonials if available
    const cmsTestimonials = await getCmsSection('testimonials', lng);
    let testimonials = Array.isArray(cmsTestimonials?.items) ? cmsTestimonials.items : undefined;

    if (!testimonials) {
      testimonials = [
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
    }

    await cacheService.setCache(cacheKey, testimonials, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'dataRetrieved', { testimonials, cached: false }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export default { getOffers, getTestimonials };