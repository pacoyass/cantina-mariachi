import prisma from '../config/database.js';
import { createError, createResponse } from '../utils/response.js';

export const getPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'en' } = req.query;
    const page = await prisma.pageContent.findUnique({ where: { slug_locale: { slug, locale } } });
    if (!page || page.status !== 'PUBLISHED') {
      return createError(res, 404, 'notFound', 'PAGE_NOT_FOUND', {}, req);
    }
    return createResponse(res, 200, 'dataRetrieved', { page }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const upsertPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'en', data = {}, status = 'PUBLISHED' } = req.body || {};
    const result = await prisma.pageContent.upsert({
      where: { slug_locale: { slug, locale } },
      update: { data, status },
      create: { slug, locale, data, status },
    });
    return createResponse(res, 200, 'operationSuccess', { page: result }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export default { getPage, upsertPage };