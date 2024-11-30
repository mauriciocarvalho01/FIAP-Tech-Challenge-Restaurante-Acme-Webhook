import { RequestHandler } from 'express';

type AdapterHealthcheck = () => RequestHandler;

export const adaptExpressHealthcheckRoute: AdapterHealthcheck =
  () => async (_, res) => {
    const json = { ok: true };
    res.status(200).json(json);
};
