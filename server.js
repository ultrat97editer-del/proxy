const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Log mọi request đổ về server
app.use((req, res, next) => {
  console.log(`[\({new Date().toISOString()}]\){req.method} \({req.hostname}\){req.url}`);
  next();
});

// Route xử lý cho Firebase Remote Config
app.all('*/v1/projects/*/namespaces/firebase:fetch', (req, res) => {
  console.log('===> Xử lý Firebase Remote Config');
  res.json({
    entries: {
      "is_premium": "true",
      "show_paywall": "false",
      "subscription_status": "gold"
    },
    state: "UPDATE"
  });
});

// Route xử lý mặc định cho RevenueCat & các API khác
app.all('*', (req, res) => {
  console.log('===> Xử lý RevenueCat / Default Mock Response');
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
  console.log(`Server đang chạy tại port ${PORT}`);
});
