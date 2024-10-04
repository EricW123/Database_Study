SELECT customers.CustomerId, SUM(Milliseconds)/60000 AS "minutes"
FROM customers
JOIN invoices ON customers.CustomerId = invoices.CustomerId
JOIN invoice_items ON invoices.InvoiceId = invoice_items.InvoiceId
JOIN tracks ON invoice_items.TrackId = tracks.TrackId
GROUP BY customers.CustomerId
HAVING SUM(Milliseconds) > 900000;

