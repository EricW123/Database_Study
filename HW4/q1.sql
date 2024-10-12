SELECT customers.LastName, customers.Email FROM invoices
JOIN customers ON invoices.CustomerId = customers.CustomerId
GROUP BY customers.CustomerId;
