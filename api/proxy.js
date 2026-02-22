// /api/proxy.js 수정본
export default async function handler(req, res) {
  const url = process.env.GAS_APP_URL;

  if (!url) {
    return res.status(500).json({ result: "error", message: "환경변수 GAS_APP_URL이 설정되지 않았습니다." });
  }

  try {
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      // 구글 리다이렉트를 자동으로 따라가도록 설정
      redirect: "follow" 
    };

    if (req.method === "POST") {
      // Body 데이터가 객체라면 문자열로 변환
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // 파라미터 처리 (op=loadAll 등)
    const urlObj = new URL(url);
    Object.keys(req.query).forEach(key => urlObj.searchParams.append(key, req.query[key]));

    const response = await fetch(urlObj.toString(), options);
    
    // 응답이 JSON이 아닐 경우를 대비한 처리
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const textData = await response.text();
      // 구글 응답이 텍스트로 올 경우 강제 JSON 처리
      try {
        res.status(200).json(JSON.parse(textData));
      } catch (e) {
        res.status(200).send(textData);
      }
    }
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ result: "error", message: error.toString() });
  }
}