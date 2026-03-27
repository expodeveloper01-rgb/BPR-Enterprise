-- Check all recent orders and their delivery_status
SELECT 
  o.id,
  o."userId",
  o.phone,
  o.address,
  o.order_status,
  o.delivery_status,
  o."paymentMethod",
  o."riderId",
  COUNT(oi.id) as item_count,
  o."createdAt"
FROM "Order" o
LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
GROUP BY o.id
ORDER BY o."createdAt" DESC
LIMIT 10;

-- Check specifically for pending unassigned orders
SELECT 
  o.id,
  o."userId",
  u.name,
  o.phone,
  o.address,
  o.delivery_status,
  o."riderId",
  COUNT(oi.id) as item_count
FROM "Order" o
LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
LEFT JOIN "User" u ON o."userId" = u.id
WHERE o.delivery_status = 'pending' AND o."riderId" IS NULL
GROUP BY o.id, u.id
ORDER BY o."createdAt" DESC;
