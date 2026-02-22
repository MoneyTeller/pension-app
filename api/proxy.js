// Vercel Serverless Function
export default async function handler(req, res) {
  const url = process.env.GAS_APP_URL; // Vercel에 저장한 환경 변수를 읽어옴

  // 클라이언트로부터 들어온 모든 요청(GET/POST)을 구글로 전달
  try {
    const options = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
    };

    if (req.method === "POST") {
      options.body = JSON.stringify(req.body);
    }

    // 쿼리 파라미터가 있다면 URL 뒤에 붙여줌 (op=loadAll 등)
    const queryString = new URLSearchParams(req.query).toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const response = await fetch(finalUrl, options);
    const data = await response.json();

    // 결과를 다시 브라우저로 반환
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ result: "error", message: error.toString() });
  }
}