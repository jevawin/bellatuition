import Airtable from "airtable";

const airtable = async ({ request, env }) => {
  const data = await request.json();
  const base = new Airtable({
    apiKey: env.AIRTABLE_API_KEY,
  }).base("appqFNeD0ktU7Tvh4");

  await new Promise((resolve, reject) => {
    base("Website Responses").create(
      [
        {
          fields: {
            Email: data.email,
            Name: data.name,
            Message: data.message,
          },
        },
      ],
      (err) => {
        if (err) {
          throw new Error(err);
        }

        resolve();
      }
    );
  });

  return new Response("ok");
};

export const onRequest = [airtable];
