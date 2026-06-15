import airtable from "airtable";
import fs from "fs";

const base = new airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base("appqFNeD0ktU7Tvh4");
import ejs from "ejs";

fs.mkdirSync("./pub/testimonials", { recursive: true });

/* CONTENT */
const getWebsiteContent = async () => {
  const content = {};

  await new Promise((resolve, reject) => {
    base("Website Content")
      .select({
        view: "Grid view",
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            content[record.get("Name")] = record.get("Content");
          });

          fetchNextPage(); // Continue to the next page
        },
        (err) => {
          if (err) {
            reject(err); // Reject the promise on error
          } else {
            resolve(); // Resolve when all pages are fetched
          }
        }
      );
  });

  return content;
};

const content = await getWebsiteContent();

ejs.renderFile("./src/index.ejs", { content }, {}, (err, html) => {
  if (err) {
    console.error("Error processing .ejs:", err);
    return;
  }

  fs.writeFile("./pub/index.html", html, "utf8", (err) => {
    if (err) {
      console.error("Error writing homepage:", err);
      return;
    }
    console.log("Homepage written successfully!");
  });
});

/* TESTIMONIALS */
const getTestimonials = async () => {
  const testimonials = [];

  await new Promise((resolve, reject) => {
    base("Testimonials")
      .select({
        // Don't constrain to a named view: a view's own filters/hidden rows
        // would silently exclude published testimonials. Gate on the
        // Published field alone and sort newest-first for deterministic order.
        filterByFormula: "{Published} = TRUE()",
        sort: [{ field: "Date", direction: "desc" }],
      })
      .eachPage(
        (records, fetchNextPage) => {
          // This function (`page`) will get called for each page of records.

          records.forEach((record) => {
            let name = record.get("Name");
            let content = record.get("Testimonial");
            let date = new Date(record.get("Date")).toLocaleDateString("en-gb", {
              year: "numeric",
              month: "short",
            });

            testimonials.push({ name, content, date });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        (err) => {
          if (err) {
            reject(err); // Reject the promise on error
          } else {
            resolve(); // Resolve when all pages are fetched
          }
        }
      );
  });

  return testimonials;
};

const testimonials = await getTestimonials();

ejs.renderFile("./src/testimonials/index.ejs", { content, testimonials }, {}, (err, html) => {
  if (err) {
    console.error("Error processing .ejs:", err);
    return;
  }
  fs.writeFile("./pub/testimonials/index.html", html, "utf8", (err) => {
    if (err) {
      console.error("Error writing testimonials:", err);
      return;
    }
    console.log("Testimonials written successfully!");
  });
});
