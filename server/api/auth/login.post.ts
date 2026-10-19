import { z } from 'zod';

const bodySchema = z.object({
  password: z.string().min(1).max(200),
});

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store');

  const parsed = bodySchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: '请输入密码',
    });
  }

  if (await isRateLimited(event, 'login')) {
    throw createError({
      statusCode: 429,
      statusMessage: '尝试次数过多，请稍后再试',
    });
  }

  const hash = useRuntimeConfig().adminPasswordHash;
  if (!hash) {
    throw createError({
      statusCode: 500,
      statusMessage: '管理员登录未配置',
    });
  }

  let valid = false;
  try {
    valid = await verifyPassword(hash, parsed.data.password);
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: '管理员密码哈希无效',
    });
  }

  if (!valid) {
    await recordAttempt(event, 'login');
    throw createError({
      statusCode: 401,
      statusMessage: '管理员密码错误',
    });
  }

  await clearAttempts(event, 'login');
  await setUserSession(event, {
    user: { role: 'admin' },
  });

  return { ok: true };
});
