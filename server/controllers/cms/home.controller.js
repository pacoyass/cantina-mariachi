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