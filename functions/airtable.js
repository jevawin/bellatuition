import Airtable from "airtable";

const airtable = async ({ request }) => {
  const data = await request.json();
  const base = new Airtable({
    apiKey: "patxNSHf6whWG6JNC.d0f144943c3a913504913431b49c740cc1378c0e7355998e47af73571270289d",
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
