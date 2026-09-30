const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Bắt tất cả các route mà app gọi tới RevenueCat
app.all('*', (req, res) => {
  console.log(`===> Nhận request từ App: \({req.method}\){req.url}`);

  // Trả về dữ liệu VIP giả lập
  res.json({
    "request_date": new Date().toISOString(),
    "request_date_ms": Date.now(),
    "subscriber": {
      "entitlements": {
        "gold": {
          "expires_date": "2099-12-31T23:59:59Z",
          "purchase_date": "2024-01-01T00:00:00Z",
          "product_identifier": "com.app.gold_yearly"
        }
      },
      "subscriptions": {
        "com.app.gold_yearly": {
          "expires_date": "2099-12-31T23:59:59Z",
          "is_sandbox": false,
          "original_purchase_date": "2024-01-01T00:00:00Z",
          "purchase_date": "2024-01-01T00:00:00Z",
          "store": "app_store"
        }
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock RevenueCat Server đang chạy trên port ${PORT}`);
});
