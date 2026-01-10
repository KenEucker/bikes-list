import { prisma } from "./prisma.js";

const cities = [
  {
    name: "Portland",
    slug: "portland",
    country_code: "US",
    region: "OR",
    timezone: "America/Los_Angeles"
  },
  {
    name: "Seattle",
    slug: "seattle",
    country_code: "US",
    region: "WA",
    timezone: "America/Los_Angeles"
  },
  {
    name: "Denver",
    slug: "denver",
    country_code: "US",
    region: "CO",
    timezone: "America/Denver"
  },
  {
    name: "Austin",
    slug: "austin",
    country_code: "US",
    region: "TX",
    timezone: "America/Chicago"
  },
  {
    name: "Chicago",
    slug: "chicago",
    country_code: "US",
    region: "IL",
    timezone: "America/Chicago"
  },
  {
    name: "New York",
    slug: "new-york",
    country_code: "US",
    region: "NY",
    timezone: "America/New_York"
  },
  {
    name: "Los Angeles",
    slug: "los-angeles",
    country_code: "US",
    region: "CA",
    timezone: "America/Los_Angeles"
  },
  {
    name: "Vienna",
    slug: "vienna",
    country_code: "AT",
    region: null,
    timezone: "Europe/Vienna"
  },
  {
    name: "London",
    slug: "london",
    country_code: "GB",
    region: null,
    timezone: "Europe/London"
  },
  {
    name: "Vancouver",
    slug: "vancouver-bc",
    country_code: "CA",
    region: "BC",
    timezone: "America/Vancouver"
  },
  {
    name: "Berlin",
    slug: "berlin",
    country_code: "DE",
    region: null,
    timezone: "Europe/Berlin"
  },
  {
    name: "Paris",
    slug: "paris",
    country_code: "FR",
    region: null,
    timezone: "Europe/Paris"
  }
];

const seed = async () => {
  const results = await Promise.all(
    cities.map((city) =>
      prisma.city.upsert({
        where: { slug: city.slug },
        update: {
          name: city.name,
          country_code: city.country_code,
          region: city.region,
          timezone: city.timezone
        },
        create: {
          name: city.name,
          slug: city.slug,
          country_code: city.country_code,
          region: city.region,
          timezone: city.timezone,
          is_active: true
        }
      })
    )
  );

  const defaultUser = await prisma.user.upsert({
    where: { email: "keneucker@gmail.com" },
    update: {},
    create: {
      email: "keneucker@gmail.com",
      display_name: "Kene Ucker"
    }
  });

  await prisma.roleAssignment.upsert({
    where: {
      user_id_role_city_id_module: {
        user_id: defaultUser.id,
        role: "SUPER_ADMIN",
        city_id: null,
        module: null
      }
    },
    update: {},
    create: {
      user_id: defaultUser.id,
      role: "SUPER_ADMIN",
      city_id: null,
      module: null
    }
  });

  console.log(`Seeded ${results.length} cities.`);
};

seed()
  .catch((error) => {
    console.error("Failed to seed cities", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
