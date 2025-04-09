export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing ID", { status: 400 });
  }

  try {
    const url = `https://www.aliexpress.com/item/${id}.html`;
    const res = await fetch(url);
    const html = await res.text();

    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const imgMatch = html.match(/"imageUrl":"(.*?)"/);

    const title = titleMatch ? titleMatch[1].replace(/ - AliExpress.*$/, '') : 'Product';
    const image = imgMatch ? imgMatch[1].replace(/\\/, '') : '';

    return new Response(JSON.stringify({ title, image }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response("Failed to fetch product", { status: 500 });
  }
}