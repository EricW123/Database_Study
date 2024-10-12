SELECT customers.State, COUNT(customers.CustomerId) AS "count" FROM customers
GROUP BY customers.State
HAVING (COUNT(customers.CustomerId) > 10);
