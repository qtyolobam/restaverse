import { Request, Response } from "express";
export declare const requestScrape: (req: Request, res: Response) => Promise<void>;
export declare const fetchUser: (req: Request, res: Response) => Promise<void>;
export declare const fetchPreviousScrapedData: (req: Request, res: Response) => Promise<void>;
