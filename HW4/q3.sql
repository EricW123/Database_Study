SELECT customers.State, COUNT(customers.CustomerId) AS "count" FROM customers
GROUP BY customers.State
ORDER BY customers.State;

