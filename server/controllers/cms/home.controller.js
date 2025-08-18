import prisma from '../../config/database.js';
import { createError, createResponse } from '../../utils/response.js';
import { TranslationService } from '../../utils/translation.js';

/**
 * Get home page content with proper locale fallbacks
 * Provides structured content for hero, sections, and SEO
 */
export const getHomePage = async (req, res) => {
  try {
    const { locale = 'en' } = req.query;
    
    // Build fallback chain: de-CH → de → en
    const fallbackChain = buildFallbackChain(locale);
    
    // Fetch home page content from all fallback locales
    const candidates = await prisma.pageContent.findMany({
      where: { 
        slug: 'home', 
        locale: { in: fallbackChain },
        status: 'PUBLISHED'
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Pick first locale in fallback order that has content
    let page = null;
    let resolvedLocale = null;
    
    for (const lng of fallbackChain) {
      const candidate = candidates.find(c => c.locale === lng);
      if (candidate) { 
        page = candidate; 
        resolvedLocale = lng;
        break; 
      }
    }

    if (!page) {
      // No CMS record; return sane defaults so frontend doesn't skeleton
      const defaultContent = getDefaultHomeContent(fallbackChain[0]);
      const synthetic = {
        slug: 'home',
        locale: fallbackChain[0],
        data: defaultContent,
        status: 'PUBLISHED',
        updatedAt: new Date()
      };
      res.set({
        'Content-Language': fallbackChain[0],
        'Vary': 'Accept-Language',
        'Cache-Control': 'public, max-age=300, s-maxage=3600'
      });
      return createResponse(res, 200, 'dataRetrieved', {
        page: synthetic,
        localeResolved: fallbackChain[0],
        fallbackChain
      }, req, {}, 'api');
    }

    // Apply field-level fallbacks for missing content
    const resolvedContent = applyFieldLevelFallbacks(page.data, candidates, fallbackChain);
    
    // Ensure required fields exist with fallbacks
    const homeContent = ensureRequiredFields(resolvedContent, resolvedLocale);

    // Set proper headers for SEO and caching
    res.set({
      'Content-Language': resolvedLocale,
      'Vary': 'Accept-Language',
      'Cache-Control': 'public, max-age=300, s-maxage=3600' // 5min client, 1h CDN
    });

    return createResponse(res, 200, 'dataRetrieved', { 
      page: { 
        ...page, 
        data: homeContent,
        locale: resolvedLocale 
      }, 
      localeResolved: resolvedLocale,
      fallbackChain 
    }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Build locale fallback chain (e.g., de-CH → de → en)
 */
function buildFallbackChain(locale) {
  const chain = [locale];
  
  // Add base language if locale has region (e.g., de-CH → de)
  if (locale.includes('-')) {
    const baseLang = locale.split('-')[0];
    if (baseLang !== locale) {
      chain.push(baseLang);
    }
  }
  
  // Always add English as final fallback
  if (locale !== 'en') {
    chain.push('en');
  }
  
  return chain;
}

/**
 * Apply field-level fallbacks for missing content
 */
function applyFieldLevelFallbacks(content, candidates, fallbackChain) {
  if (!content || typeof content !== 'object') {
    return content;
  }

  const resolved = { ...content };
  
  // For each field, check if it's missing and apply fallback
  for (const field of Object.keys(content)) {
    if (content[field] === null || content[field] === undefined || content[field] === '') {
      // Find this field in fallback locales
      for (const lng of fallbackChain) {
        const candidate = candidates.find(c => c.locale === lng);
        if (candidate?.data?.[field]) {
          resolved[field] = candidate.data[field];
          break;
        }
      }
    }
  }
  
  return resolved;
}

/**
 * Ensure required fields exist with proper fallbacks
 */
function ensureRequiredFields(content, locale) {
  const defaultContent = getDefaultHomeContent(locale);
  
  return {
    // Hero section
    hero: {
      badge: content?.hero?.badge || defaultContent.hero.badge,
      title: content?.hero?.title || defaultContent.hero.title,
      desc: content?.hero?.desc || defaultContent.hero.desc,
      image: content?.hero?.image || defaultContent.hero.image,
      imageAlt: content?.hero?.imageAlt || defaultContent.hero.imageAlt,
      ...content?.hero
    },
    
    // CTA section
    cta: {
      limited: content?.cta?.limited || defaultContent.cta?.limited,
      title: content?.cta?.title || defaultContent.cta?.title,
      desc: content?.cta?.desc || defaultContent.cta?.desc,
      endsTonight: content?.cta?.endsTonight || defaultContent.cta?.endsTonight,
      socialProof: content?.cta?.socialProof || defaultContent.cta?.socialProof,
      start: content?.cta?.start || defaultContent.cta?.start,
      reserve: content?.cta?.reserve || defaultContent.cta?.reserve,
      ...(content?.cta || {})
    },

    // Features section
    features: content?.features || defaultContent.features,
    
    // About section
    about: content?.about || defaultContent.about,
    
    // Contact section
    contact: content?.contact || defaultContent.contact,
    
    // SEO metadata
    seo: {
      title: content?.seo?.title || defaultContent.seo.title,
      description: content?.seo?.description || defaultContent.seo.description,
      keywords: content?.seo?.keywords || defaultContent.seo.keywords,
      ...content?.seo
    },
    
    // Any other custom fields
    ...content
  };
}

/**
 * Get default home content for fallback scenarios
 */
function getDefaultHomeContent(locale) {
  const isRTL = ['ar', 'he', 'fa'].includes(locale);
  
  return {
    hero: {
      badge: TranslationService.t('home:hero.badge', { lng: locale }),
      title: TranslationService.t('home:hero.title', { lng: locale }),
      desc: TranslationService.t('home:hero.desc', { lng: locale }),
      image: {
        jpg: '/hero.jpg',
        webp: '/hero.webp',
        avif: '/hero.avif'
      },
      imageAlt: TranslationService.t('home:hero.imageAlt', { lng: locale })
    },
    cta: {
      limited: TranslationService.t('business:home.cta.limited', { lng: locale }),
      title: TranslationService.t('business:home.cta.title', { lng: locale }),
      desc: TranslationService.t('business:home.cta.desc', { lng: locale }),
      endsTonight: TranslationService.t('business:home.cta.endsTonight', { lng: locale }),
      socialProof: TranslationService.t('business:home.cta.socialProof', { lng: locale }),
      start: TranslationService.t('business:home.cta.start', { lng: locale }),
      reserve: TranslationService.t('business:home.cta.reserve', { lng: locale })
    },
    features: {
      title: TranslationService.t('home:features.title', { lng: locale }),
      items: [
        {
          icon: 'star',
          title: TranslationService.t('home:features.quality.title', { lng: locale }),
          description: TranslationService.t('home:features.quality.desc', { lng: locale })
        },
        {
          icon: 'clock',
          title: TranslationService.t('home:features.speed.title', { lng: locale }),
          description: TranslationService.t('home:features.speed.desc', { lng: locale })
        },
        {
          icon: 'heart',
          title: TranslationService.t('home:features.service.title', { lng: locale }),
          description: TranslationService.t('home:features.service.desc', { lng: locale })
        }
      ]
    },
    about: {
      title: TranslationService.t('home:about.title', { lng: locale }),
      content: TranslationService.t('home:about.content', { lng: locale }),
      image: '/about.jpg'
    },
    contact: {
      title: TranslationService.t('home:contact.title', { lng: locale }),
      address: TranslationService.t('home:contact.address', { lng: locale }),
      phone: TranslationService.t('home:contact.phone', { lng: locale }),
      email: TranslationService.t('home:contact.email', { lng: locale })
    },
    seo: {
      title: TranslationService.t('home:seo.title', { lng: locale }),
      description: TranslationService.t('home:seo.description', { lng: locale }),
      keywords: TranslationService.t('home:seo.keywords', { lng: locale })
    }
  };
}