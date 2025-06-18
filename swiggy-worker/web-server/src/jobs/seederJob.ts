// Some dependencies
import prisma from "../database";
import fs from "fs";
import path from "path";
import cron from "node-cron";

const seederJob = async () => {
  const restaurantsDir = path.join(__dirname, "worker-script", "restaurants");

  try {
    // Check if directory exists
    if (!fs.existsSync(restaurantsDir)) {
      throw new Error("Restaurants directory does not exist");
    }

    // Read directory contents
    const files = fs.readdirSync(restaurantsDir);

    // Check if directory is empty
    if (files.length === 0) {
      throw new Error("Restaurants directory is empty");
    }

    // Check for restaurants.json file
    let restaurantsJsonFile = files.find((file: string) =>
      file.endsWith("restaurants.json")
    );

    if (!restaurantsJsonFile) {
      throw new Error("Restaurants.json file does not exist");
    }

    let restaurantsFile = fs.readFileSync(
      path.join(restaurantsDir, restaurantsJsonFile),
      "utf8"
    );

    let restaurants = JSON.parse(restaurantsFile);

    let swiggyRestaurantIds: string[] = [];
    let existingRestaurantsIds: string[] = [];

    // Scrape Id
    let scrapeRequestId = "";

    for (const restaurant of restaurants) {
      restaurant.cuisines = restaurant.cuisines.split(",");
      const fileName = restaurantsJsonFile.split("_");
      restaurant.pincode = fileName[0];
      restaurant.scrapeRequestId = fileName[1];
      scrapeRequestId = restaurant.scrapeRequestId;

      const existingRestaurant = await prisma.swiggyRestaurant.findFirst({
        where: {
          name: restaurant.name,
        },
      });

      if (existingRestaurant) {
        console.log(
          `Restaurant ${restaurant.name} already exists in db, skipping...`
        );
        existingRestaurantsIds.push(existingRestaurant.id);
        swiggyRestaurantIds.push(existingRestaurant.id);
        continue;
      }

      const scrapeRequest = await prisma.scrapeRequest.findFirst({
        where: {
          id: restaurant.scrapeRequestId,
        },
      });

      if (!scrapeRequest) {
        console.log(
          `Scrape request ${restaurant.scrapeRequestId} not found, skipping...`
        );
        continue;
      }

      const swiggyRestaurant = await prisma.swiggyRestaurant.create({
        data: {
          name: restaurant.name || "",
          url: restaurant.url || "",
          rating: restaurant.rating || "",
          deliveryTime: restaurant.delivery_time || "",
          cuisines: restaurant.cuisines || [],
          pincode: restaurant.pincode || "",
          area: restaurant.area || "",
          scrapeRequestId: scrapeRequest.id,
        },
      });

      swiggyRestaurantIds.push(swiggyRestaurant.id);
    }

    console.log(`Seeded ${restaurants.length} restaurants`);

    console.log(swiggyRestaurantIds);
    // Delete the file after seeding
    fs.unlinkSync(path.join(restaurantsDir, restaurantsJsonFile));

    let idx = 0;

    // Seeding menu items
    files.forEach(async (folder: string) => {
      if (
        fs.existsSync(path.join(restaurantsDir, folder)) &&
        fs.lstatSync(path.join(restaurantsDir, folder)).isDirectory()
      ) {
        if (existingRestaurantsIds.includes(swiggyRestaurantIds[idx])) {
          console.log(
            `Restaurant ${swiggyRestaurantIds[idx]} already exists in db, skipping its menu...`
          );
          idx++;
          return;
        }

        const menuFile = fs.readFileSync(
          path.join(restaurantsDir, folder, "menu.json"),
          "utf8"
        );

        const menuItems = JSON.parse(menuFile);
        console.log(menuItems.length);

        for (const menuItem of menuItems) {
          await prisma.swiggyMenuItem.create({
            data: {
              swiggyRestaurantId: swiggyRestaurantIds[idx],
              imageUrl: menuItem.image_url || "",
              rating: menuItem.rating || "",
              name: menuItem.name || "",
              price: menuItem.price || "0",
              description: menuItem.description || "",
            },
          });
        }

        console.log(`Seeded ${menuItems.length} menu items`);

        fs.unlinkSync(path.join(restaurantsDir, folder, "menu.json"));
        fs.rmdirSync(path.join(restaurantsDir, folder));
        console.log(`Deleted ${folder} and its contents`);
        idx++;
      }
    });

    // Update scrape request status to completed
    await prisma.scrapeRequest.update({
      where: {
        id: scrapeRequestId,
      },
      data: { status: "completed" },
    });
  } catch (error) {
    console.log(
      "Error in seeder job",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

let seederTask: any = null;

// Scheduling 5 min interval cron job
seederTask = cron.schedule("*/5 * * * *", () => {
  console.log("Seeder job started");
  seederJob();
});

export default seederTask;
