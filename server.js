const { Proxy } = require('http-mitm-proxy');
const proxy = new Proxy();

const PORT = process.env.PORT || 8080;

proxy.onError((ctx, err) => {
  console.error('Lỗi Proxy:', err);
});

// Chặn request kết nối tới api.revenuecat.com
proxy.onRequest((ctx, callback) => {
  if (ctx.clientToProxyRequest.headers.host === 'api.revenuecat.com') {
    
    ctx.onResponseData((ctx, chunk, callback) => {
      ctx.responseData = ctx.responseData || [];
      ctx.responseData.push(chunk);
      return callback(null, null);
    });

    ctx.onResponseEnd((ctx, callback) => {
      let body = Buffer.concat(ctx.responseData).toString('utf8');

      try {
        let json = JSON.parse(body);

        // Chèn dữ liệu VIP giả vào JSON trả về
        if (json.subscriber) {
          json.subscriber.entitlements = {
            "gold": {
              "expires_date": "2099-12-31T23:59:59Z",
              "purchase_date": "2024-01-01T00:00:00Z",
              "product_identifier": "com.app.gold_yearly"
            }
          };
          json.subscriber.subscriptions = {
            "com.app.gold_yearly": {
              "expires_date": "2099-12-31T23:59:59Z",
              "is_sandbox": false,
              "original_purchase_date": "2024-01-01T00:00:00Z",
              "purchase_date": "2024-01-01T00:00:00Z",
              "store": "app_store"
            }
          };
        }

        body = JSON.stringify(json);
        console.log("===> ĐÃ BỎ QUA VÀ KÍCH HOẠT VIP THÀNH CÔNG!");
      } catch (e) {
        // Giữ nguyên nếu không phải JSON
      }

      ctx.proxyToClientResponse.write(body);
      return callback();
    });
  }

  return callback();
});

proxy.listen({ port: PORT }, () => {
  console.log(`Server đang chạy trên Railway tại port ${PORT}...`);
});