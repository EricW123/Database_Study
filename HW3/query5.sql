-- get number of customers in each country.

SELECT BillingCity FROM
invoices JOIN invoice_items
ON invoices.InvoiceId = invoice_items.InvoiceId
WHERE UnitPrice > 1;

