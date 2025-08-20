import prisma from '../../config/database.js';
import { createError, createResponse } from '../../utils/response.js';
import { TranslationService } from '../../utils/translation.js';
import DynamicTranslationService from '../../services/dynamicTranslation.service.js';

/**
 * Get home page content with dynamic locale fallbacks
 * Provides structured content for hero, sections, and SEO
 */
export const getHomePage = async (req, res) => {
  try {
    const { locale = 'en' } = req.query;
    
    // Build dynamic fallback chain: de-CH → de → en
    const fallbackChain = await DynamicTranslationService.buildDynamicFallbackChain(locale);
    
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
      const defaultContent = await getDefaultHomeContent(fallbackChain[0]);
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
    const resolvedContent = await applyDynamicFieldLevelFallbacks(page.data, candidates, fallbackChain, 'home');
    
    // Ensure required fields exist with dynamic fallbacks
    const homeContent = await ensureDynamicRequiredFields(resolvedContent, resolvedLocale, 'home');

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
 * Apply dynamic field-level fallbacks for missing content
 */
async function applyDynamicFieldLevelFallbacks(content, candidates, fallbackChain, slug) {
  if (!content || typeof content !== 'object') {
    return content;
  }

  const resolved = { ...content };
  
  // Get dynamic schema for this page
  const schema = await DynamicTranslationService.getDynamicSchema(slug, fallbackChain[0]);
  
  // For each field defined in schema, check if it's missing and apply fallback
  for (const [section, fields] of Object.entries(schema)) {
    if (Array.isArray(fields)) {
      // Handle array-based field definitions
      for (const field of fields) {
        if (content[section]?.[field] === null || content[section]?.[field] === undefined || content[section]?.[field] === '') {
          // Find this field in fallback locales
          for (const lng of fallbackChain) {
            const candidate = candidates.find(c => c.locale === lng);
            if (candidate?.data?.[section]?.[field]) {
              if (!resolved[section]) resolved[section] = {};
              resolved[section][field] = candidate.data[section][field];
              break;
            }
          }
        }
      }
    } else if (typeof fields === 'object') {
      // Handle nested object field definitions
      for (const [subsection, subfields] of Object.entries(fields)) {
        if (Array.isArray(subfields)) {
          for (const field of subfields) {
            if (content[section]?.[subsection]?.[field] === null || content[section]?.[subsection]?.[field] === undefined || content[section]?.[subsection]?.[field] === '') {
              // Find this field in fallback locales
              for (const lng of fallbackChain) {
                const candidate = candidates.find(c => c.locale === lng);
                if (candidate?.data?.[section]?.[subsection]?.[field]) {
                  if (!resolved[section]) resolved[section] = {};
                  if (!resolved[section][subsection]) resolved[section][subsection] = {};
                  resolved[section][subsection][field] = candidate.data[section][subsection][field];
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
  
  return resolved;
}

/**
 * Ensure required fields exist with dynamic fallbacks
 */
async function ensureDynamicRequiredFields(content, locale, slug) {
  const defaultContent = await getDefaultHomeContent(locale);
  const schema = await DynamicTranslationService.getDynamicSchema(slug, locale);
  
  const resolved = { ...content };
  
  // Apply schema-based field resolution
  for (const [section, fields] of Object.entries(schema)) {
    if (Array.isArray(fields)) {
      // Handle array-based field definitions
      if (!resolved[section]) resolved[section] = {};
      for (const field of fields) {
        if (resolved[section][field] === null || resolved[section][field] === undefined || resolved[section][field] === '') {
          resolved[section][field] = defaultContent[section]?.[field] || null;
        }
      }
    } else if (typeof fields === 'object') {
      // Handle nested object field definitions
      if (!resolved[section]) resolved[section] = {};
      for (const [subsection, subfields] of Object.entries(fields)) {
        if (Array.isArray(subfields)) {
          if (!resolved[section][subsection]) resolved[section][subsection] = {};
          for (const field of subfields) {
            if (resolved[section][subsection][field] === null || resolved[section][subsection][field] === undefined || resolved[section][subsection][field] === '') {
              resolved[section][subsection][field] = defaultContent[section]?.[subsection]?.[field] || null;
            }
          }
        }
      }
    }
  }
  
  return resolved;
}

/**
 * Get default home content for fallback scenarios
 */
async function getDefaultHomeContent(locale) {
  const isRTL = ['ar', 'he', 'fa'].includes(locale);
  
  return {
    hero: {
      badge: TranslationService.t('hero.badge', { lng: locale, ns: 'home' }),
      title: TranslationService.t('hero.title', { lng: locale, ns: 'home' }),
      desc: TranslationService.t('hero.desc', { lng: locale, ns: 'home' }),
      image: {
        jpg: '/hero.jpg',
        webp: '/hero.webp',
        avif: '/hero.avif'
      },
      imageAlt: TranslationService.t('hero.imageAlt', { lng: locale, ns: 'home' })
    },
    cta: {
      limited: TranslationService.t('home.cta.limited', { lng: locale, ns: 'business' }),
      title: TranslationService.t('home.cta.title', { lng: locale, ns: 'business' }),
      desc: TranslationService.t('home.cta.desc', { lng: locale, ns: 'business' }),
      endsTonight: TranslationService.t('home.cta.endsTonight', { lng: locale, ns: 'business' }),
      socialProof: TranslationService.t('home.cta.socialProof', { lng: locale, ns: 'business' }),
      start: TranslationService.t('home.cta.start', { lng: locale, ns: 'business' }),
      reserve: TranslationService.t('home.cta.reserve', { lng: locale, ns: 'business' })
    },
    features: {
      title: TranslationService.t('features.title', { lng: locale, ns: 'home' }),
      items: [
        {
          icon: 'star',
          title: TranslationService.t('features.quality.title', { lng: locale, ns: 'home' }),
          description: TranslationService.t('features.quality.desc', { lng: locale, ns: 'home' })
        },
        {
          icon: 'clock',
          title: TranslationService.t('features.speed.title', { lng: locale, ns: 'home' }),
          description: TranslationService.t('features.speed.desc', { lng: locale, ns: 'home' })
        },
        {
          icon: 'heart',
          title: TranslationService.t('features.service.title', { lng: locale, ns: 'home' }),
          description: TranslationService.t('features.service.desc', { lng: locale, ns: 'home' })
        }
      ]
    },
    about: {
      title: TranslationService.t('about.title', { lng: locale, ns: 'home' }),
      content: TranslationService.t('about.content', { lng: locale, ns: 'home' }),
      image: '/about.jpg'
    },
    contact: {
      title: TranslationService.t('contact.title', { lng: locale, ns: 'home' }),
      address: TranslationService.t('contact.address', { lng: locale, ns: 'home' }),
      phone: TranslationService.t('contact.phone', { lng: locale, ns: 'home' }),
      email: TranslationService.t('contact.email', { lng: locale, ns: 'home' })
    },
    seo: {
      title: TranslationService.t('seo.title', { lng: locale, ns: 'home' }),
      description: TranslationService.t('seo.description', { lng: locale, ns: 'home' }),
      keywords: TranslationService.t('seo.keywords', { lng: locale, ns: 'home' })
    }
  };
}