import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, DisputeEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Dispute } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // DISPUTES
  app.get('/api/disputes', async (c) => {
    await DisputeEntity.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const page = await DisputeEntity.list(c.env, cursor ?? null, limit ? Math.max(1, Number(limit)) : 50);
    return ok(c, page);
  });
  app.get('/api/disputes/:id', async (c) => {
    const entity = new DisputeEntity(c.env, c.req.param('id'));
    if (!await entity.exists()) return notFound(c, 'Dispute not found');
    return ok(c, await entity.getState());
  });
  app.post('/api/disputes', async (c) => {
    const body = await c.req.json() as Dispute;
    if (!body.patientName || !body.billedAmount) return bad(c, 'Required fields missing');
    const id = body.id || crypto.randomUUID();
    const dispute = {
      ...body,
      id,
      createdAt: body.createdAt || Date.now()
    };
    await DisputeEntity.create(c.env, dispute);
    return ok(c, dispute);
  });
  app.delete('/api/disputes/:id', async (c) => {
    const deleted = await DisputeEntity.delete(c.env, c.req.param('id'));
    return ok(c, { deleted });
  });
  // USERS (Template Default)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
}