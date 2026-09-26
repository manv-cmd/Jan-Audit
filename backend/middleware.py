import time
import logging

from fastapi import Request

logger = logging.getLogger("social_audit")


async def request_logging_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = (time.perf_counter() - start) * 1000

    logger.info(
        "%s %s -> %s (%.2f ms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed,
    )

    response.headers["X-Process-Time"] = f"{elapsed:.2f}ms"
    return response
