import { Request, Response } from "express";

import prisma from "../clients/database";
import { userScrapeSchema } from "../utils/validations/user";
import axios from "axios";

export const requestScrape = async (req: Request, res: Response) => {
  try {
    // Input validation
    const { success, data } = userScrapeSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { pincode, limit, cuisines } = data;

    // Fetching the restaurants
    // Checking if has been a previous scrape for this pincode
    const previousScrape = await prisma.scrapeRequest.findFirst({
      where: {
        pincode,
      },
    });

    // If previous scrape exists, return it
    if (previousScrape) {
      // If both are true, return the previous scrape
      if (previousScrape.status === "completed") {
        const restaurants = await prisma.swiggyRestaurant.findMany({
          where: {
            scrapeRequestId: previousScrape.id,
          },
          select: {
            id: true,
            url: true,
            name: true,
            rating: true,
            deliveryTime: true,
            cuisines: true,
            pincode: true,
            area: true,
            swiggyMenuItems: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                imageUrl: true,
              },
            },
          },
        });

        res.status(200).json({ message: "Scrape already exists", restaurants });
        return;
      } else {
        // TODO : if the scrape had more than the current limit (ideally the scraper should only scrpae what it hasnt scraped before but that needs a external
        // source of truth, can try a hash based check where the restro name and area or some field can be hashed stored in redis and then checked by the scraper
        // for now, we will just send the scrape request with new limit
        res.status(200).json({ message: "Similar scrape request in progress" });
        return;
      }
    } else {
      // If no previous scrape exists, create a new one
      // Calling the scraper service
      await axios.post(`${process.env.SCRAPER_SERVICE_URL}/scrape`, {
        userId: req.user!.id,
        pincode,
        limit,
        cuisines,
      });

      // Returning the new scrape
      res.json({ message: "Scrape request sent" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error requesting a scrape" });
    return;
  }
};

export const fetchUser = async (req: Request, res: Response) => {
  try {
    // Fetching the user
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        onboarded: true,
        restaurants: {
          select: {
            id: true,
            name: true,
            pincode: true,
            menuItems: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // If user not found, return 404
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Returning the user
    res.status(200).json({ message: "User fetched", user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying user" });
    return;
  }
};

// Adhoc controller
export const fetchPreviousScrapedData = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        scrapeRequests: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.scrapeRequests.length === 0) {
      // Find the scrape with same pincode and status completed
      const restaurant = await prisma.restaurant.findFirst({
        where: {
          userId: req.user!.id,
        },
        select: {
          pincode: true,
        },
      });

      const pincode = restaurant?.pincode;

      const swiggyRestaurants = await prisma.swiggyRestaurant.findMany({
        where: {
          pincode,
        },
        select: {
          id: true,
          url: true,
          name: true,
          rating: true,
          deliveryTime: true,
          cuisines: true,
          pincode: true,
          area: true,
          swiggyMenuItems: {
            select: {
              id: true,
              name: true,
              price: true,
              rating: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      });

      res.status(200).json({
        message: "Previous scraped data fetched",
        restaurants: swiggyRestaurants,
      });

      return;
    }

    const lastScrapeRequest =
      user.scrapeRequests[user.scrapeRequests.length - 1];

    if (lastScrapeRequest.status !== "completed") {
      res.status(200).json({
        error: "Scrape request not completed yet",
        msgCode: 400,
      });
      return;
    }

    const restaurants = await prisma.swiggyRestaurant.findMany({
      where: {
        scrapeRequestId: lastScrapeRequest.id,
      },
      select: {
        id: true,
        url: true,
        name: true,
        rating: true,
        deliveryTime: true,
        cuisines: true,
        pincode: true,
        area: true,
        swiggyMenuItems: {
          select: {
            id: true,
            name: true,
            price: true,
            rating: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Previous scraped data fetched",
      restaurants,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching previous scraped data" });
    return;
  }
};
