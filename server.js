// シークレットキー
const stripe = require("stripe")(
    "sk_test_51M8LknJEhhIN1NLTjSi4QL8OzOkid0tVHV1ADyDL8PkjR4Vid6KRfiygqlhuwQDFjt9WjSXzCgaTScsQ78ztev6M00E9Ii06lZ"
  );
// expressモジュールを使用する宣言を行います
const express = require("express");
// expressのインスタンスを作成
const app = express();

// リッスンを開始するポート番号
const PORT = 8000;
// publicフォルダの下に静的なHTMLファイルがあることを示しています
app.use(express.static("public"));

// リダイレクト先のURL
const YOUR_DOMAIN = "http://localhost:8000";

// エンドポイント"/create-checkout-session"のPOSTアクションの実装を、
// server.jsに実装します。
// 非同期モードで実行できるように、asyncで実装する必要があります。
app.post("/create-checkout-session", async (req, res) => {
    try {
        // 商品情報のリストを取得します。
        const prices = await stripe.prices.list({});
        // コンソールに出力します
        // console.log(prices);

        // セッションを作成
        const session = await stripe.checkout.sessions.create({
            // 
            //billing_address_collection: "auto",
            // 
            line_items: [
              {
                // 商品ID
                price: prices.data[0].id,
                // 量
                quantity: 1,
              },
            ],
            // モード。今回はサブスクリプションで作成したので、subscriptionを指定
            mode: "subscription",
            // 成功した場合のリダイレクト先
            success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            // キャンセルした場合のリダイレクト先
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
          });
          // 会計が終了した場合、リダイレクトします
          res.redirect(303, session.url);
    } catch (err) {
      console.log(err);
    }
  });


// サーバーを指定したポートでリッスン開始します。
app.listen(PORT, () => {
    console.log("listening on 8000");
} );
