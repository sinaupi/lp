export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return new Response(JSON.stringify({ error: "Missing product ID" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const productUrl = `https://www.aliexpress.com/item/${productId}.html`;

    try {
      const res = await fetch(productUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const html = await res.text();

      const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
      const imgMatch = html.match(/<meta property="og:image" content="(.*?)"/);

      const title = titleMatch ? titleMatch[1] : "Unknown Product";
      const image = imgMatch ? imgMatch[1] : "";

      const result = {
        id: productId,
        title,
        image,
        buy_url: `https://www.aliexpress.com/item/${productId}.html`,
      };

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to fetch product" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  },
};
