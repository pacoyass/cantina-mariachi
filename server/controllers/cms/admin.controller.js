import prisma from '../../config/database.js';
import { createError, createResponse } from '../../utils/response.js';
import { LoggerService } from '../../utils/logger.js';
import DynamicTranslationService from '../../services/dynamicTranslation.service.js';

/**
 * Language Management
 */

export const getLanguages = async (req, res) => {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { priority: 'asc' }
    });

    return createResponse(res, 200, 'dataRetrieved', { languages }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const createLanguage = async (req, res) => {
  try {
    const { code, name, rtl = false, fallback = null, priority = 0 } = req.body;

    if (!code || !name) {
      return createError(res, 400, 'badRequest', 'MISSING_REQUIRED_FIELDS', {
        message: 'Language code and name are required'
      }, req);
    }

    const language = await prisma.language.create({
      data: { code, name, rtl, fallback, priority }
    });

    await LoggerService.logAudit(req.user?.id, 'LANGUAGE_CREATED', null, {
      languageCode: code,
      languageName: name
    });

    return createResponse(res, 201, 'created', { language }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2002') {
      return createError(res, 409, 'conflict', 'LANGUAGE_ALREADY_EXISTS', {
        message: 'Language code already exists'
      }, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const updateLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, rtl, fallback, priority, isActive } = req.body;

    const language = await prisma.language.update({
      where: { id },
      data: { code, name, rtl, fallback, priority, isActive }
    });

    await LoggerService.logAudit(req.user?.id, 'LANGUAGE_UPDATED', null, {
      languageId: id,
      languageCode: code
    });

    return createResponse(res, 200, 'updated', { language }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'LANGUAGE_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.language.delete({
      where: { id }
    });

    await LoggerService.logAudit(req.user?.id, 'LANGUAGE_DELETED', null, {
      languageId: id
    });

    return createResponse(res, 200, 'deleted', { message: 'Language deleted successfully' }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'LANGUAGE_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Namespace Management
 */

export const getNamespaces = async (req, res) => {
  try {
    const { locale = 'en' } = req.query;
    
    const namespaces = await prisma.namespace.findMany({
      where: { locale },
      orderBy: { name: 'asc' }
    });

    return createResponse(res, 200, 'dataRetrieved', { namespaces }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const createNamespace = async (req, res) => {
  try {
    const { name, locale = 'en', description } = req.body;

    if (!name) {
      return createError(res, 400, 'badRequest', 'MISSING_REQUIRED_FIELDS', {
        message: 'Namespace name is required'
      }, req);
    }

    const namespace = await prisma.namespace.create({
      data: { name, locale, description }
    });

    await LoggerService.logAudit(req.user?.id, 'NAMESPACE_CREATED', null, {
      namespaceName: name,
      locale
    });

    return createResponse(res, 201, 'created', { namespace }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2002') {
      return createError(res, 409, 'conflict', 'NAMESPACE_ALREADY_EXISTS', {
        message: 'Namespace already exists for this locale'
      }, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const updateNamespace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const namespace = await prisma.namespace.update({
      where: { id },
      data: { name, description, isActive }
    });

    await LoggerService.logAudit(req.user?.id, 'NAMESPACE_UPDATED', null, {
      namespaceId: id,
      namespaceName: name
    });

    return createResponse(res, 200, 'updated', { namespace }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'NAMESPACE_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const deleteNamespace = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.namespace.delete({
      where: { id }
    });

    await LoggerService.logAudit(req.user?.id, 'NAMESPACE_DELETED', null, {
      namespaceId: id
    });

    return createResponse(res, 200, 'deleted', { message: 'Namespace deleted successfully' }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'NAMESPACE_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Content Schema Management
 */

export const getContentSchemas = async (req, res) => {
  try {
    const { slug, locale = 'en' } = req.query;
    
    const where = {};
    if (slug) where.slug = slug;
    if (locale) where.locale = locale;

    const schemas = await prisma.contentSchema.findMany({
      where,
      orderBy: [{ slug: 'asc' }, { locale: 'asc' }]
    });

    return createResponse(res, 200, 'dataRetrieved', { schemas }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const createContentSchema = async (req, res) => {
  try {
    const { slug, locale = 'en', fields } = req.body;

    if (!slug || !fields) {
      return createError(res, 400, 'badRequest', 'MISSING_REQUIRED_FIELDS', {
        message: 'Schema slug and fields are required'
      }, req);
    }

    const schema = await prisma.contentSchema.create({
      data: { slug, locale, fields }
    });

    await LoggerService.logAudit(req.user?.id, 'CONTENT_SCHEMA_CREATED', null, {
      schemaSlug: slug,
      locale
    });

    return createResponse(res, 201, 'created', { schema }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2002') {
      return createError(res, 409, 'conflict', 'SCHEMA_ALREADY_EXISTS', {
        message: 'Schema already exists for this slug and locale'
      }, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const updateContentSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, locale, fields, isActive } = req.body;

    const schema = await prisma.contentSchema.update({
      where: { id },
      data: { slug, locale, fields, isActive }
    });

    await LoggerService.logAudit(req.user?.id, 'CONTENT_SCHEMA_UPDATED', null, {
      schemaId: id,
      schemaSlug: slug
    });

    return createResponse(res, 200, 'updated', { schema }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'SCHEMA_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const deleteContentSchema = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contentSchema.delete({
      where: { id }
    });

    await LoggerService.logAudit(req.user?.id, 'CONTENT_SCHEMA_DELETED', null, {
      schemaId: id
    });

    return createResponse(res, 200, 'deleted', { message: 'Content schema deleted successfully' }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'SCHEMA_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Fallback Rules Management
 */

export const getFallbackRules = async (req, res) => {
  try {
    const { sourceLocale, targetLocale } = req.query;
    
    const where = {};
    if (sourceLocale) where.sourceLocale = sourceLocale;
    if (targetLocale) where.targetLocale = targetLocale;

    const rules = await prisma.fallbackRule.findMany({
      where,
      orderBy: { priority: 'asc' }
    });

    return createResponse(res, 200, 'dataRetrieved', { rules }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const createFallbackRule = async (req, res) => {
  try {
    const { sourceLocale, targetLocale, priority = 0 } = req.body;

    if (!sourceLocale || !targetLocale) {
      return createError(res, 400, 'badRequest', 'MISSING_REQUIRED_FIELDS', {
        message: 'Source and target locales are required'
      }, req);
    }

    const rule = await prisma.fallbackRule.create({
      data: { sourceLocale, targetLocale, priority }
    });

    await LoggerService.logAudit(req.user?.id, 'FALLBACK_RULE_CREATED', null, {
      sourceLocale,
      targetLocale,
      priority
    });

    return createResponse(res, 201, 'created', { rule }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2002') {
      return createError(res, 409, 'conflict', 'FALLBACK_RULE_ALREADY_EXISTS', {
        message: 'Fallback rule already exists for this locale pair'
      }, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const updateFallbackRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { sourceLocale, targetLocale, priority, isActive } = req.body;

    const rule = await prisma.fallbackRule.update({
      where: { id },
      data: { sourceLocale, targetLocale, priority, isActive }
    });

    await LoggerService.logAudit(req.user?.id, 'FALLBACK_RULE_UPDATED', null, {
      ruleId: id,
      sourceLocale,
      targetLocale
    });

    return createResponse(res, 200, 'updated', { rule }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'FALLBACK_RULE_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const deleteFallbackRule = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.fallbackRule.delete({
      where: { id }
    });

    await LoggerService.logAudit(req.user?.id, 'FALLBACK_RULE_DELETED', null, {
      ruleId: id
    });

    return createResponse(res, 200, 'deleted', { message: 'Fallback rule deleted successfully' }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'FALLBACK_RULE_NOT_FOUND', {}, req);
    }
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Initialize Dynamic Translation Data
 */

export const initializeDynamicTranslation = async (req, res) => {
  try {
    await DynamicTranslationService.initializeDefaultData();

    await LoggerService.logAudit(req.user?.id, 'DYNAMIC_TRANSLATION_INITIALIZED', null, {
      initializedBy: req.user?.id
    });

    return createResponse(res, 200, 'operationSuccess', { 
      message: 'Dynamic translation data initialized successfully' 
    }, req, {}, 'api');
  } catch (error) {
    await LoggerService.logError('Dynamic translation initialization failed', error.stack, {
      error: error.message
    });
    return createError(res, 500, 'internalError', 'INITIALIZATION_FAILED', {}, req);
  }
};