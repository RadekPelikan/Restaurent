import { Response } from "express";

/**
 * Use [] to set the status code dynamically
 *
 * @param {Response} res
 * @param {string} message
 */
const handleError = {
  400: (res: Response, message: string) => {
    res.status(400).json({ message });
  },
  403: (res: Response, message: string) => {
    console.error(message);
    res.status(403).json({ message: "Forbidden" });
  },
  404: (res: Response, message: string) => {
    res.status(404).json({ message });
  },
  500: (res: Response, message: string) => {
    console.error(message);
    res.status(500).json({ message: "Internal server error" });
  },
  503: (res: Response, message: string) => {
    console.error(message);
    res.status(503).json({ message: "Service unavailable" });
  },
};

export default handleError;
