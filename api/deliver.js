export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='OPTIONS') return res.status(200).end();
  const { phone, network, capacity, ref } = req.body;
  const KEY = process.env.DATAMART_KEY;
  if(!KEY) return res.status(500).json({error:'DATAMART_KEY not set in Vercel'});
  const map = { MTN:'YELLO', TELECEL:'TELECEL', AT:'AT_PREMIUM', AIRTELTIGO:'AT_PREMIUM' };
  try{
    const r = await fetch('https://api.datamartgh.shop/api/developer/purchase',{
      method:'POST',
      headers:{ 'X-API-Key': KEY, 'Content-Type':'application/json', 'X-Idempotency-Key': ref || 'thunder-'+Date.now() },
      body: JSON.stringify({ phoneNumber:phone, network: map[network.toUpperCase()]||'YELLO', capacity: capacity.toString().replace('GB','').trim(), gateway:'wallet' })
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }catch(e){ return res.status(500).json({error:e.message}); }
}