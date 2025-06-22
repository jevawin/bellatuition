export const onRequest = async () => {
  await fetch(
    "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/47093f6a-030e-4273-89d2-d3d2c252de3c",
    { method: "POST" }
  );

  return new Response("Done! It should be live in 1 minute.", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
